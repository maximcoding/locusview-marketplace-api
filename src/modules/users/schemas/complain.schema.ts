import * as mongoose from 'mongoose';
import {ModelEnum} from '../../../enums/model.enum';
import {Model, model} from 'mongoose';

export interface ComplainDocument extends Document {
  from: string;
  text: string;
  userId: number;
}

export interface IComplainModel extends Model<ComplainDocument> {
  from: string;
  text: string;
  userId: number;
}

export const ComplainSchema = new mongoose.Schema(
  {
    from: {type: String, required: true},
    text: {type: String, required: true},
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ModelEnum.Users,
    },
  },
  {timestamps: true},
);
