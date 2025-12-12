import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { YuqlamaModule } from './yuqlama/yuqlama.module';
import { Yuqlama } from './yuqlama/entities/yuqlama.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: "yuqlama.db",
      entities: [User, Yuqlama],
      synchronize: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads'
    }),
    UserModule,
    YuqlamaModule
  ],
  controllers: [AppController],
})
export class AppModule { }
