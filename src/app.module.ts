import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from './schedule/schedule.module';
import { RoomsModule } from './rooms/rooms.module';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ScheduleModule,
    RoomsModule,
    MongooseModule.forRoot('mongodb://admin:admin@localhost:27017/my-project', {
      authSource: 'admin',
    }),
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'env'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
