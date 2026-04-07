import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  id: string;
  name_ua: string;
  name_pl: string;
  slug: string;
  order: number;
  active: boolean;
}

const CategorySchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name_ua: { type: String, required: true },
  name_pl: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, {
  timestamps: true
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
