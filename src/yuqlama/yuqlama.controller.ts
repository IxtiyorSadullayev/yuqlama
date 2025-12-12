import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { YuqlamaService } from './yuqlama.service';
import { CreateYuqlamaDto } from './dto/create-yuqlama.dto';

@Controller('yuqlama')
export class YuqlamaController {
  constructor(private readonly yuqlamaService: YuqlamaService) { }

  @Post()
  async create(@Body() createYuqlamaDto: CreateYuqlamaDto) {
    return this.yuqlamaService.create(createYuqlamaDto);
  }

  @Get()
  async findAll() {
    return this.yuqlamaService.findAll();
  }

  @Get('params')
  async findOne(
    @Query('class_name') class_name: string, 
    @Query('user_type') user_type: string, 
    @Query('sana') sana: string, 
    @Query('gacha') gacha: string,
    @Query('dankeyin') dankeyin: string) {
    return this.yuqlamaService.findOne(class_name, user_type, sana,gacha,dankeyin);
  }

}
