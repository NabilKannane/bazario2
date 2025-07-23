import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const includeCount = searchParams.get('includeCount') === 'true';
    const parentOnly = searchParams.get('parentOnly') === 'true';

    let filter: any = { isActive: true };
    
    if (parentOnly) {
      filter.parent = { $exists: false };
    }

    const categories = await Category.find(filter)
      .populate('parent', 'name slug')
      .sort({ name: 1 });

    // Ajouter le nombre de produits si demandé
    if (includeCount) {
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const count = await Product.countDocuments({ 
            category: category._id, 
            status: 'active' 
          });
          return {
            ...category.toObject(),
            productCount: count,
          };
        })
      );
      return NextResponse.json(categoriesWithCount);
    }

    return NextResponse.json(categories);

  } catch (error) {
    console.error('Categories API Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    );
  }
}