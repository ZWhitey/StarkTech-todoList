import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TodoModule } from './todo/todo.module';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/todo';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TodoModule,
    MongooseModule.forRoot(MONGO_URI),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
