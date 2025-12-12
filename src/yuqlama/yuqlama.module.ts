import { Module } from '@nestjs/common';
import { YuqlamaService } from './yuqlama.service';
import { YuqlamaController } from './yuqlama.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Yuqlama } from './entities/yuqlama.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Yuqlama]),
    UserModule
  ],
  controllers: [YuqlamaController],
  providers: [YuqlamaService],
})
export class YuqlamaModule {}
