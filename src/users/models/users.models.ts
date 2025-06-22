import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../common/enums/users-role';

export type UsersDocument = HydratedDocument<Users>;

@Schema()
export class Users {
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  phone: string;
  @Prop({ required: true, enum: Role })
  role: Role;
}
export const UsersSchema = SchemaFactory.createForClass(Users);
