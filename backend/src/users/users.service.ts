import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async getUserByEmail(email: string): Promise<UserDocument> {
    try {
      return await this.UserModel.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  async create(user: User) {
    try {
      await this.UserModel.create(user);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string) {
    try {
      return await this.UserModel.findById(id);
    } catch (error) {
      throw error;
    }
  }
}
