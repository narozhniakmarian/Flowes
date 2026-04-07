import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryImage extends Document {
  id: string;
  url: string;
  publicId: string;
  alt: string;
  order: number;
  active: boolean;
}

const GalleryImageSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  alt: { type: String, default: "" },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, {
  timestamps: true
});

export default mongoose.models.GalleryImage || mongoose.model<IGalleryImage>('GalleryImage', GalleryImageSchema);
