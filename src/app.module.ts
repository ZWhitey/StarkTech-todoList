import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TodoModule,
    MongooseModule.forRoot('mongodb://localhost/todo'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
