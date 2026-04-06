import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env");
}

const dataPath = path.resolve(process.cwd(), 'src', 'app', 'data.json');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));

const IngredientSchema = new mongoose.Schema({
  name_ua: { type: String, required: true },
  name_pl: { type: String, required: true },
  amount: { type: String, required: true },
}, { _id: false });

const ProductSchema = new mongoose.Schema({
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

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    await Product.insertMany(data);
    console.log(`Inserted ${data.length} products`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seed();
