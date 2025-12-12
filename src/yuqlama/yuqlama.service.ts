import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateYuqlamaDto } from './dto/create-yuqlama.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Yuqlama } from './entities/yuqlama.entity';
import { In, Not, Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class YuqlamaService {
  constructor(
    @InjectRepository(Yuqlama) private yuqlamaRepo: Repository<Yuqlama>,
    private userService: UserService
  ) { }
  async create(createYuqlamaDto: CreateYuqlamaDto) {
    const user = await this.userService.findOne(createYuqlamaDto.user_id)
    if (!user) {
      throw new HttpException("Foydalanuvchi topilmadi.", HttpStatus.NOT_FOUND);
    }
    const newyoqlama = this.yuqlamaRepo.create({
      user: user,
      come: createYuqlamaDto.come
    })
    await this.yuqlamaRepo.save(newyoqlama);
    return newyoqlama;
  }

  async findAll() {
    const yuqlamalar = await this.yuqlamaRepo.find({ relations: { user: true } })
    return yuqlamalar;
  }

  async findOne(class_name: string, user_type: string, sana: string, gacha: string, dankeyin: string) {
    var data
    if (class_name && !user_type && !sana && !gacha && !dankeyin) {
      data = await this.yuqlamaRepo.find({ relations: { user: true }, where: { user: { class_name: class_name } } })
    }
    else if (user_type && !sana && !gacha && !dankeyin) {
      if (user_type == 'ishchi') {
        data = await this.yuqlamaRepo.find({ relations: { user: true }, where: { user: { user_type: Not("student") } } })
      }
      data = await this.yuqlamaRepo.find({ relations: { user: true }, where: { user: { user_type: user_type } } })
    }
    else if (user_type && sana && !gacha && !dankeyin) {

      const malumot = await this.yuqlamaRepo.find(
        {
          relations: { user: true },
          where: {
            user: { user_type: user_type },
          }
        })
      data = malumot.filter(y => {
        return y.come.toISOString().split("T")[0] == sana
      })
    }
    else if (class_name && sana && !gacha && !dankeyin) {
      const malumot = await this.yuqlamaRepo.find(
        {
          relations: { user: true },
          where: {
            user: { class_name: class_name },
          }
        })
      data = malumot.filter(y => {
        return y.come.toISOString().split("T")[0] == sana
      })
    }
    else if (class_name && gacha && !dankeyin && !sana) {
      const malumot = await this.yuqlamaRepo.find(
        {
          relations: { user: true },
          where: {
            user: { class_name: class_name },
          }
        })
      data = malumot.filter(y => y.come < new Date(gacha))
    }
    else if (user_type && gacha && !dankeyin && !sana) {
      console.log(new Date(gacha))

      var malumot = await this.yuqlamaRepo.find(
        {
          relations: { user: true },
          where: {
            user: { user_type: user_type },
            come: LessThanOrEqual(new Date(gacha))
          }
        })
      data = malumot.filter(y => y.come < new Date(gacha))
    }
    else if (class_name && dankeyin && !sana) {
      const malumot = await this.yuqlamaRepo.find(
        {
          relations: { user: true },
          where: {
            user: { class_name: class_name },
          }
        })
      data = malumot.filter(y => y.come > new Date(dankeyin))
    }
    else if (user_type && dankeyin && !sana) {
      const malumot = await this.yuqlamaRepo.find(
        {
          relations: { user: true },
          where: {
            user: { user_type: user_type },
          }
        })
      data = malumot.filter(y => y.come > new Date(dankeyin))
    }
    else if (user_type && sana && dankeyin) {
      const malumot = await this.yuqlamaRepo.find(
        {
          relations: { user: true },
          where: {
            user: { user_type: user_type },
          }
        })
      data = malumot.filter(y => y.come > new Date(dankeyin) && y.come.toISOString().split("T")[0]==sana)
    }
    else if (class_name && sana && dankeyin) {
      const malumot = await this.yuqlamaRepo.find(
        {
          relations: { user: true },
          where: {
            user: { class_name: class_name },
          }
        })
      data = malumot.filter(y => y.come > new Date(dankeyin) && y.come.toISOString().split("T")[0]==sana)
    }
    else if (class_name && sana && gacha) {
      const malumot = await this.yuqlamaRepo.find(
        {
          relations: { user: true },
          where: {
            user: { class_name: class_name },
          }
        })
      data = malumot.filter(y => y.come < new Date(gacha) && y.come.toISOString().split("T")[0]==sana)
    }
    else if (user_type && sana && gacha) {
      const malumot = await this.yuqlamaRepo.find(
        {
          relations: { user: true },
          where: {
            user: { user_type: user_type },
          }
        })
      data = malumot.filter(y => y.come < new Date(gacha) && y.come.toISOString().split("T")[0]==sana)
    }
    return data;
  }

  


}
