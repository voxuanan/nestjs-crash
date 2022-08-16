import * as mongoose from 'mongoose';

export const BookMarkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export interface BookMark extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  link: string;
  userId: string;
}
