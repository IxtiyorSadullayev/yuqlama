import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>
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
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id: id } })
    if (!user) {
      throw new HttpException("Foydalanuvchi topilmadi", HttpStatus.NOT_FOUND);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id: id } })
    if (!user) {
      throw new HttpException("Foydalanuvchi topilmadi", HttpStatus.NOT_FOUND);
    }
    await this.userRepo.remove(user)
    return "Ma'lumot o'chirildi";
  }

  async findByParamsOle(class_name: string, user_type: string) {
    if (!class_name || !user_type){
      return []
    }

    const data = await this.userRepo.find({where: {class_name: class_name, user_type: user_type}})
    return data;
  }

  async getBirthday(){
    const bugun = new Date().toISOString().split("T")[0]
    const data = await this.userRepo.find()
    return data.filter(d => d.birth_day.toISOString().split("T")[0]==bugun)
  }
}
