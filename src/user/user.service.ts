import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import ExcelJs from 'exceljs'
import { rm } from 'fs';
import { CreateUserByFileDto } from './dto/createUserByFile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService
  ) { }

  async create(createUserDto: CreateUserDto, photo) {
    const olduser = await this.userRepo.findOne({ where: { class_name: createUserDto.class_name, name: createUserDto.name, fam: createUserDto.fam } })
    if (olduser) {
      throw new HttpException("Ushbu foydalanuvchi oldin yaratilgan", HttpStatus.BAD_REQUEST);
    }
    const newuser = this.userRepo.create({
      name: createUserDto.name,
      fam: createUserDto.fam,
      class_name: createUserDto.class_name,
      birth_day: createUserDto.birth_day,
      user_type: createUserDto.user_type,
      tel: createUserDto.tel,
      login: createUserDto.login,
      parol: createUserDto.parol,
      photo: photo ? photo.path : ""
    })
    await this.userRepo.save(newuser);
    return newuser;
  }

  async findAll() {
    const users = await this.userRepo.find()
    return {
      count: users.length,
      users: users.map(user => {
      return {
        id: user.id,
        name: user.name,
        fam: user.fam,
        class_name: user.class_name,
        photo: user.photo,
        user_type: user.user_type,
        tel: user.tel,
        jinsi: user.jinsi,
        login: user.login,
        parol: user.parol,
        pas_seria: user.pas_seria,
        pas_number: user.pas_number,
        birth_day: new Date(user.birth_day.toISOString()),
        created: user.created,
        updated: user.updated
      }
    })
    }
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id: id } })
    if (!user) {
      throw new HttpException("Foydalanuvchi topilmadi", HttpStatus.NOT_FOUND);
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const user = await this.userRepo.findOne({ where: { id: id } })
    if (!user) {
      throw new HttpException("Foydalanuvchi topilmadi", HttpStatus.NOT_FOUND);
    }
    await this.userRepo.remove(user)
    return "Ma'lumot o'chirildi";
  }

  async findByParamsOle(class_name: string, user_type: string) {
    if (!class_name || !user_type) {
      return []
    }

    const data = await this.userRepo.find({ where: { class_name: class_name, user_type: user_type } })
    return data;
  }

  async getBirthday() {
    const bugun = new Date().toISOString().split("T")[0]
    const data = await this.userRepo.find()
    return data.filter(d => d.birth_day.toISOString().split("T")[0] == bugun)
  }

  async login(loginDto: LoginUserDto) {
    if (loginDto.login == '' || loginDto.password == '') {
      throw new HttpException("Ma'lumotlar to'liq emas", HttpStatus.BAD_REQUEST)
    }
    const user = await this.userRepo.findOne({ where: { login: loginDto.login } })
    if (!user || user.parol != loginDto.password) {
      throw new HttpException("User topilmadi, Yokida ma'lumotlar noto'g'ri", HttpStatus.NOT_FOUND)
    }

    const payload = { role: user.user_type, user_id: user.id }

    return {
      token: await this.jwtService.signAsync(payload),
      status: "ok"
    }

  }


  getReload(req) {
    return req.user
  }


  async createUserByFile(createUserByFileDto: CreateUserByFileDto, doc) {
    try {
      const workbook = new ExcelJs.Workbook()
      await workbook.xlsx.readFile(doc.path)
      const sheet = workbook.getWorksheet(1)
      sheet?.eachRow(async row=>{
        var sana =  row.values[6];
        var oy = parseInt(sana.split('.')[1])>=10?parseInt(sana.split('.')[1]): '0'+parseInt(sana.split('.')[1])
        var kun = parseInt(sana.split('.')[0])>=10?parseInt(sana.split('.')[0]): '0'+parseInt(sana.split('.')[0])
        var d = `${parseInt(sana.split(".")[2])}-${oy}-${kun}`
        console.log(d)
        var user = {
          name: row.values[4],
          fam: row.values[3],
          class_name: createUserByFileDto.class_name,
          birth_day:d,
          user_type: createUserByFileDto.user_type,
          jinsi: row.values[5], 
          pas_seria: row.values[1],
          pas_number: row.values[2]
        }
        // console.log(user)
        const newuser= this.userRepo.create(user)
        await this.userRepo.save(newuser)
      }) 
      rm(doc.path, ()=> {})
      return "Barcha ma'lumotlar saqlandi."
    }
    catch (err) {
      throw new HttpException("Ma'lumotlar bilan ishlashda hatolik bo'ldi" + err, HttpStatus.BAD_REQUEST)
    }
  }
}
