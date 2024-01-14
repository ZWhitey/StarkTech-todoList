import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(username: string): Promise<UserDocument | undefined> {
    return await this.userModel.findOne({ username });
  }

  async findAll() {
    return await this.userModel.find({}, { _id: 1, username: 1 });
  }

  async create(
    username: string,
    password: string,
  ): Promise<UserDocument | undefined> {
    const user = await this.userModel.findOne({ username });
    if (user) {
      return undefined;
    }
    const newUser = new this.userModel({
      username,
      password,
    });
    return await newUser.save();
  }
}
