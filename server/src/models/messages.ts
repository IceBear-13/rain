import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId | IUser;
  content: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IMessage>('Message', messageSchema);
