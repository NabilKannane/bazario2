// src/app/api/admin/bazario-products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();

    const productId = params.id;

    // Vérifier que le produit existe et est un produit Bazario
    const product = await Product.findOne({
      _id: productId,
      $or: [
        { tags: { $in: ['bazario', 'officiel'] } },
        { 'specifications.isBazarioProduct': true }
      ]
    }).populate('category', 'name slug');

    if (!product) {
      return NextResponse.json(
        { error: 'Produit Bazario non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);

  } catch (error) {
    console.error('Get Bazario Product Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du produit' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();

    const productId = params.id;
    const data = await request.json();

    // Vérifier que le produit existe et est un produit Bazario
    const product = await Product.findOne({
      _id: productId,
      $or: [
        { tags: { $in: ['bazario', 'officiel'] } },
        { 'specifications.isBazarioProduct': true }
      ]
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produit Bazario non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le produit
    const updateData = {
      title: data.title,
      description: data.description,
      price: data.price,
      images: data.images,
      category: data.category,
      tags: [...(data.tags || []), 'bazario', 'officiel'],
      specifications: {
        ...product.specifications,
        productType: data.type,
        validityPeriod: data.validityPeriod,
        location: data.location,
        inclusions: data.inclusions || [],
        restrictions: data.restrictions || [],
        updatedBy: session.user.id,
        lastModified: new Date()
      },
      inventory: {
        ...product.inventory,
        stock: data.isUnlimited ? 999999 : (data.stock || 0),
        sku: data.sku,
        isUnlimited: data.isUnlimited || false
      },
      status: data.status,
      featured: data.featured || false,
      updatedAt: new Date()
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    ).populate('category', 'name slug');

    return NextResponse.json(updatedProduct);

  } catch (error) {
    console.error('Update Bazario Product Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();

    const productId = params.id;

    // Vérifier que le produit existe et est un produit Bazario
    const product = await Product.findOne({
      _id: productId,
      $or: [
        { tags: { $in: ['bazario', 'officiel'] } },
        { 'specifications.isBazarioProduct': true }
      ]
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produit Bazario non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des commandes liées
    const hasOrders = await Order.findOne({
      'items.product': new mongoose.Types.ObjectId(productId)
    });

    if (hasOrders) {
      // Au lieu de supprimer, désactiver le produit
      await Product.findByIdAndUpdate(productId, {
        status: 'inactive',
        specifications: {
          ...product.specifications,
          deletedBy: session.user.id,
          deletedAt: new Date(),
          reason: 'Suppression demandée mais commandes existantes'
        }
      });

      return NextResponse.json({ 
        message: 'Produit désactivé (commandes existantes)',
        action: 'deactivated'
      });
    } else {
      // Suppression définitive si aucune commande
      await Product.findByIdAndDelete(productId);
      
      return NextResponse.json({ 
        message: 'Produit supprimé avec succès',
        action: 'deleted'
      });
    }

  } catch (error) {
    console.error('Delete Bazario Product Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    );
  }
}