import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from './models/users.models';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-users.dto';
import { hashSync } from 'bcryptjs';
import { UserSummary } from '../common/types/user-summary';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<UsersDocument>,
    private configService: ConfigService,
  ) {}
  async findByEmail(
    email: string,
  ): Promise<Pick<
    UsersDocument,
    '_id' | 'email' | 'password' | 'role'
  > | null> {
    return await this.userModel
      .findOne({ email: email }, { _id: 1, email: 1, password: 1, role: 1 })
      .lean()
      .exec();
  }
  async createUser(users: CreateUserDto): Promise<UsersDocument> {
    const { password } = users;
    const hash = hashSync(
      password,
      Number(this.configService.get<string>('SALT')),
    );
    users.password = hash;
    const createModel = new this.userModel(users);
    return await createModel.save();
  }

  async findAll() {
    const res = this.userModel
      .find()
      .select('_id email name phone role')
      .lean()
      .exec()
      .then((users: UsersDocument[]): UserSummary[] =>
        users.map((user) => ({
          _id: user._id.toHexString(),
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
        })),
      );
    return res;
  }
  async findById(id: string): Promise<Users> {
    const foundUser = await this.userModel
      .findById(id)
      .select('_id email name phone role')
      .lean()
      .exec();
    if (!foundUser) {
      throw new NotFoundException(`User c id ${foundUser} не найден`);
    }
    return foundUser;
  }
  async deleteAll() {
    await this.userModel.deleteMany({});
  }
}
