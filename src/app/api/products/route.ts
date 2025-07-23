import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);

    // Construction du filtre
    let filter: any = { status: 'active' };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }

    // Construction du tri
    let sort: any = {};
    switch (sortBy) {
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'rating':
        sort = { rating: -1, reviewCount: -1 };
        break;
      case 'popular':
        sort = { views: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      default: // newest
        sort = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('vendor', 'firstName lastName avatar vendorInfo.businessName')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    return NextResponse.json({
      products,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      }
    });

  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'vendor' && session.user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();

    const data = await request.json();
    
    // Validation des données
    if (!data.title || !data.description || !data.price || !data.category) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    const product = new Product({
      ...data,
      vendor: session.user.id,
      inventory: {
        ...data.inventory,
        sku: data.inventory.sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      }
    });

    await product.save();
    await product.populate('category', 'name slug');
    await product.populate('vendor', 'firstName lastName avatar vendorInfo.businessName');

    return NextResponse.json(product, { status: 201 });

  } catch (error) {
    console.error('Create Product Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
}
