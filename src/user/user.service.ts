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
  ){}

  async create(createUserDto: CreateUserDto, photo) {
    const olduser = await this.userRepo.findOne({where: {class_name: createUserDto.class_name, name: createUserDto.name, fam: createUserDto.fam}})
    if (olduser){
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
      photo: photo ? photo.path: ""
    })
    await this.userRepo.save(newuser);
    return newuser;
  }

  async findAll() {
    const users = await this.userRepo.find()
    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
