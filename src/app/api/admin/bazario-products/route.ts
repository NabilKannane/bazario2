// src/app/api/admin/bazario-products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Vérifier que l'utilisateur est admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const type = searchParams.get('type');

    // Construire le filtre pour les produits Bazario
    let filter: any = { 
      // Identifier les produits Bazario par le vendeur spécial ou un tag
      $or: [
        { tags: { $in: ['bazario', 'officiel'] } },
        { 'metadata.isBazarioProduct': true }
      ]
    };

    if (search) {
      filter.$text = { $search: search };
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (type) {
      filter['metadata.productType'] = type;
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    // Calculer les statistiques
    const stats = await Product.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          draftProducts: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
          },
          featuredProducts: {
            $sum: { $cond: ['$featured', 1, 0] }
          },
          totalViews: { $sum: '$views' },
          averageRating: { $avg: '$rating' },
          totalRevenue: {
            $sum: { $multiply: ['$price', { $ifNull: ['$salesCount', 0] }] }
          }
        }
      }
    ]);

    return NextResponse.json({
      products,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      stats: stats[0] || {
        totalProducts: 0,
        activeProducts: 0,
        draftProducts: 0,
        featuredProducts: 0,
        totalViews: 0,
        averageRating: 0,
        totalRevenue: 0
      }
    });

  } catch (error) {
    console.error('Bazario Products API Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();

    const data = await request.json();
    
    // Validation des données spécifiques Bazario
    if (!data.title || !data.description || !data.price || !data.type) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Créer ou trouver l'utilisateur Bazario officiel
    let bazarioUser = await User.findOne({ email: 'boutique@bazario.com' });
    
    if (!bazarioUser) {
      bazarioUser = await User.create({
        email: 'boutique@bazario.com',
        firstName: 'Boutique',
        lastName: 'Bazario',
        role: 'vendor',
        isVerified: true,
        password: 'bazario-official-account',
        vendorInfo: {
          businessName: 'Boutique Officielle Bazario',
          businessDescription: 'Produits officiels et exclusifs de la marketplace Bazario',
          specialties: ['Coffrets', 'Cartes Cadeaux', 'Expériences'],
          isApproved: true,
          rating: 5.0,
          totalSales: 0,
          commission: 0 // Pas de commission pour Bazario
        }
      });
    }

    // Générer un SKU si non fourni
    if (!data.sku) {
      data.sku = `BAZ-${data.type.toUpperCase()}-${Date.now()}`;
    }

    // Créer le produit avec des métadonnées spéciales Bazario
    const product = new Product({
      title: data.title,
      description: data.description,
      price: data.price,
      images: data.images || [],
      category: data.category,
      vendor: bazarioUser._id,
      tags: [...(data.tags || []), 'bazario', 'officiel'],
      specifications: {
        isBazarioProduct: true,
        productType: data.type,
        validityPeriod: data.validityPeriod,
        location: data.location,
        inclusions: data.inclusions || [],
        restrictions: data.restrictions || [],
        createdBy: session.user.id
      },
      inventory: {
        stock: data.isUnlimited ? 999999 : (data.stock || 0),
        sku: data.sku,
        isUnlimited: data.isUnlimited || false,
        lowStockAlert: 5
      },
      shipping: {
        weight: 0.5,
        freeShipping: true,
        shippingCost: 0,
        processingTime: '24-48h'
      },
      status: data.status || 'draft',
      featured: data.featured || false
    });

    await product.save();
    await product.populate('category', 'name slug');

    return NextResponse.json(product, { status: 201 });

  } catch (error) {
    console.error('Create Bazario Product Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
}