import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthLog extends Document {
  requestId: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  userAgent?: string;
  ip?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuthLogSchema: Schema = new Schema({
  requestId: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'approved', 'denied', 'expired'],
    default: 'pending'
  },
  userAgent: { type: String },
  ip: { type: String },
}, {
  timestamps: true
});

export default mongoose.models.AuthLog || mongoose.model<IAuthLog>('AuthLog', AuthLogSchema);
