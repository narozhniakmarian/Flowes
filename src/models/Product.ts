import mongoose, { Schema, Document } from 'mongoose';

export interface IIngredient {
  name_ua: string;
  name_pl: string;
  amount: string;
}

export interface IProduct extends Document {
  id: string;
  image: string;
  name_ua: string;
  name_pl: string;
  category_ua: string;
  category_pl: string;
  price: number;
  ingredients: IIngredient[];
  tags_ua: string[];
  tags_pl: string[];
  description_ua: string;
  description_pl: string;
  seo_ua: string;
  seo_pl: string;
}

const IngredientSchema: Schema = new Schema({
  name_ua: { type: String, required: true },
  name_pl: { type: String, required: true },
  amount: { type: String, required: true },
}, { _id: false });

const ProductSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  name_ua: { type: String, required: true },
  name_pl: { type: String, required: true },
  category_ua: { type: String, required: true },
  category_pl: { type: String, required: true },
  price: { type: Number, required: true },
  ingredients: { type: [IngredientSchema], required: true },
  tags_ua: { type: [String], required: true },
  tags_pl: { type: [String], required: true },
  description_ua: { type: String, required: true },
  description_pl: { type: String, required: true },
  seo_ua: { type: String, required: true },
  seo_pl: { type: String, required: true },
}, {
  timestamps: true
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
