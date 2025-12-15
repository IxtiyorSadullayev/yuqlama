import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseInterceptors, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: "./uploads",
      filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtname = extname(file.originalname);
          const randomName = `${name}-${Date.now()}${fileExtname}`;
          callback(null, randomName);
        },
    })
  }))
  create(@Body() createUserDto: CreateUserDto, @UploadedFile() photo: Express.Multer.File) {
    return this.userService.create(createUserDto, photo);
  }

  @Get()
  async findAll() {
    return  this.userService.findAll();
  }

  @Get('params')
  async findByParamsasasa(
    @Query("class_name") class_name: string,
    @Query("user_type") user_type: string,
  ){
    return this.userService.findByParamsOle(class_name, user_type);
  }

  @Get('birthday')
  async getbirthday(){
    return this.userService.getBirthday();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }


  @Post('login')
  loginuser(@Body() loginDto: LoginUserDto){
    return this.userService.login(loginDto);
  }
  
}
