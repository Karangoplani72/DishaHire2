
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true, 
    lowercase: true,
    trim: true 
  },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

// Password verification instance method
userSchema.methods.comparePassword = async function(password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.models.User || mongoose.model('User', userSchema);
