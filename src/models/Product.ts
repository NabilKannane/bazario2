import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  tags: string[];
  specifications: Record<string, any>;
  inventory: {
    stock: number;
    sku: string;
    isUnlimited: boolean;
    lowStockAlert: number;
  };
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    freeShipping: boolean;
    shippingCost: number;
    processingTime: string;
  };
  status: 'draft' | 'active' | 'inactive' | 'sold_out';
  featured: boolean;
  views: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  specifications: {
    type: Schema.Types.Mixed,
    default: {}
  },
  inventory: {
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    sku: {
      type: String,
      required: true,
      unique: true
    },
    isUnlimited: {
      type: Boolean,
      default: false
    },
    lowStockAlert: {
      type: Number,
      default: 5
    }
  },
  shipping: {
    weight: {
      type: Number,
      required: true,
      min: 0
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0
    },
    processingTime: {
      type: String,
      default: '1-3 jours'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'sold_out'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index pour la recherche
ProductSchema.index({ title: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ vendor: 1, status: 1 });
ProductSchema.index({ featured: 1, status: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
