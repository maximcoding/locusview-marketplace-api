import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ModelEnum} from '../../../enums/model.enum';
import * as mongoose from 'mongoose';
import {Document} from 'mongoose';
import {CommonSchemaOptions} from '../../../helpers/common-schema.options';

@Schema(CommonSchemaOptions)
export class ResetPassword {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelEnum.Users,
    required: true,
  })
  userId: string;

  @Prop({
    type: Date,
    default: Date.now,
    expires: 3600, // this is the expiry time in seconds
  })
  createdAt: Date;

  @Prop({type: String, required: true})
  newPassword: string;

  @Prop({
    type: Number,
    required: true,
  })
  mobileSmsCode: number;

  @Prop({
    type: Date,
  })
  mobileSmsCodeExpires: Date;

  @Prop({type: String, required: true})
  emailToken: string; // if token exist , reset token process not completed
}

export type ResetPasswordDocument = ResetPassword & Document;

export const ResetPassSchema = SchemaFactory.createForClass(ResetPassword);
