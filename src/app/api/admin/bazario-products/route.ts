// src/app/api/admin/bazario-products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';
import Category from '@/models/Category';
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
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const type = searchParams.get('type');

    // Construire le filtre pour les produits Bazario
    let filter: any = { 
      // Identifier les produits Bazario par les tags ou les spécifications
      $or: [
        { tags: { $in: ['bazario', 'officiel'] } },
        { 'specifications.isBazarioProduct': true }
      ]
    };

    if (search) {
      filter.$and = [
        filter.$or ? { $or: filter.$or } : {},
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { 'inventory.sku': { $regex: search, $options: 'i' } }
          ]
        }
      ];
      // Restructurer le filtre pour éviter les conflits
      const bazarioFilter = filter.$or;
      delete filter.$or;
      filter.$and = [
        { $or: bazarioFilter },
        ...(filter.$and || [])
      ];
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (category) {
      filter.category = new mongoose.Types.ObjectId(category);
    }

    if (type) {
      filter['specifications.productType'] = type;
    }

    const skip = (page - 1) * limit;

    // Récupérer les produits avec les relations
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('vendor', 'firstName lastName vendorInfo.businessName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(filter);

    // Calculer les statistiques détaillées
    const statsAggregation = await Product.aggregate([
      { 
        $match: { 
          $or: [
            { tags: { $in: ['bazario', 'officiel'] } },
            { 'specifications.isBazarioProduct': true }
          ]
        }
      },
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
          inactiveProducts: {
            $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] }
          },
          featuredProducts: {
            $sum: { $cond: ['$featured', 1, 0] }
          },
          totalViews: { $sum: '$views' },
          totalSales: { $sum: { $ifNull: ['$salesCount', 0] } },
          averageRating: { $avg: '$rating' },
          totalRevenue: {
            $sum: { 
              $multiply: [
                '$price', 
                { $ifNull: ['$salesCount', 0] }
              ] 
            }
          }
        }
      }
    ]);

    const stats = statsAggregation[0] || {
      totalProducts: 0,
      activeProducts: 0,
      draftProducts: 0,
      inactiveProducts: 0,
      featuredProducts: 0,
      totalViews: 0,
      totalSales: 0,
      averageRating: 0,
      totalRevenue: 0
    };

    return NextResponse.json({
      products,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      stats
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
        { error: 'Données manquantes (titre, description, prix, type requis)' },
        { status: 400 }
      );
    }

    if (!data.images || data.images.length === 0) {
      return NextResponse.json(
        { error: 'Au moins une image est requise' },
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
        password: 'bazario-official-account-' + Date.now(),
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
      const typePrefix = data.type.toUpperCase().slice(0, 3);
      const timestamp = Date.now().toString().slice(-6);
      data.sku = `BAZ-${typePrefix}-${timestamp}`;
    }

    // Vérifier l'unicité du SKU
    const existingSku = await Product.findOne({ 'inventory.sku': data.sku });
    if (existingSku) {
      return NextResponse.json(
        { error: 'Ce SKU existe déjà' },
        { status: 400 }
      );
    }

    // Créer le produit avec des métadonnées spéciales Bazario
    const product = new Product({
      title: data.title,
      description: data.description,
      price: data.price,
      images: data.images,
      category: new mongoose.Types.ObjectId(data.category),
      vendor: bazarioUser._id,
      tags: [...(data.tags || []), 'bazario', 'officiel'],
      specifications: {
        isBazarioProduct: true,
        productType: data.type,
        validityPeriod: data.validityPeriod,
        location: data.location,
        inclusions: data.inclusions || [],
        restrictions: data.restrictions || [],
        createdBy: session.user.id,
        createdAt: new Date()
      },
      inventory: {
        stock: data.isUnlimited ? 999999 : (data.stock || 0),
        sku: data.sku,
        isUnlimited: data.isUnlimited || false,
        lowStockAlert: 5
      },
      shipping: {
        weight: 0.5,
        dimensions: {
          length: 20,
          width: 20,
          height: 5
        },
        freeShipping: true,
        shippingCost: 0,
        processingTime: '24-48h'
      },
      status: data.status || 'draft',
      featured: data.featured || false,
      views: 0,
      rating: 0,
      reviewCount: 0
    });

    await product.save();
    
    // Populer les relations avant de retourner
    await product.populate('category', 'name slug');
    await product.populate('vendor', 'firstName lastName vendorInfo.businessName');

    return NextResponse.json(product, { status: 201 });

  } catch (error: any) {
    console.error('Create Bazario Product Error:', error);
    
    // Gérer les erreurs de validation MongoDB
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Erreur de validation: ' + errorMessages.join(', ') },
        { status: 400 }
      );
    }

    // Gérer les erreurs de clé dupliquée
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Ce SKU existe déjà' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
}