import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'vendor' | 'buyer';
  avatar?: string;
  isVerified: boolean;
  profile: {
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    bio?: string;
    socialLinks?: {
      website?: string;
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
  vendorInfo?: {
    businessName: string;
    businessDescription: string;
    specialties: string[];
    isApproved: boolean;
    rating: number;
    totalSales: number;
    commission: number;
  };
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'vendor', 'buyer'],
    default: 'buyer'
  },
  avatar: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  profile: {
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    bio: String,
    socialLinks: {
      website: String,
      instagram: String,
      facebook: String,
      twitter: String
    }
  },
  vendorInfo: {
    businessName: String,
    businessDescription: String,
    specialties: [String],
    isApproved: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalSales: {
      type: Number,
      default: 0
    },
    commission: {
      type: Number,
      default: 10 // 10% par défaut
    }
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  emailVerificationToken: String
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
