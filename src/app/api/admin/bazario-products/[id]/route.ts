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

    // Vérifier que c'est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: 'ID de produit invalide' },
        { status: 400 }
      );
    }

    // Vérifier que le produit existe et est un produit Bazario
    const product = await Product.findOne({
      _id: productId,
      $or: [
        { tags: { $in: ['bazario', 'officiel'] } },
        { 'specifications.isBazarioProduct': true }
      ]
    })
    .populate('category', 'name slug')
    .populate('vendor', 'firstName lastName vendorInfo.businessName')
    .lean();

    if (!product) {
      return NextResponse.json(
        { error: 'Produit Bazario non trouvé' },
        { status: 404 }
      );
    }


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

    // Vérifier que c'est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: 'ID de produit invalide' },
        { status: 400 }
      );
    }

    // Vérifier que le produit existe et est un produit Bazario
    const existingProduct = await Product.findOne({
      _id: productId,
      $or: [
        { tags: { $in: ['bazario', 'officiel'] } },
        { 'specifications.isBazarioProduct': true }
      ]
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produit Bazario non trouvé' },
        { status: 404 }
      );
    }

    // Validation des données
    if (data.sku && data.sku !== existingProduct.inventory.sku) {
      const existingSku = await Product.findOne({ 
        'inventory.sku': data.sku,
        _id: { $ne: productId }
      });
      if (existingSku) {
        return NextResponse.json(
          { error: 'Ce SKU existe déjà' },
          { status: 400 }
        );
      }
    }

    if (data.images && data.images.length === 0) {
      return NextResponse.json(
        { error: 'Au moins une image est requise' },
        { status: 400 }
      );
    }

    // Construire les données de mise à jour
    const updateData: any = {};

    // Champs simples
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.images) updateData.images = data.images;
    if (data.category) updateData.category = new mongoose.Types.ObjectId(data.category);
    if (data.status) updateData.status = data.status;
    if (data.featured !== undefined) updateData.featured = data.featured;

    // Tags (toujours inclure bazario et officiel)
    if (data.tags) {
      const allTags = [...new Set([...data.tags, 'bazario', 'officiel'])];
      updateData.tags = allTags;
    }

    // Specifications
    updateData.specifications = {
      ...existingProduct.specifications,
      isBazarioProduct: true,
      productType: data.type || existingProduct.specifications?.productType,
      validityPeriod: data.validityPeriod || existingProduct.specifications?.validityPeriod,
      location: data.location || existingProduct.specifications?.location,
      inclusions: data.inclusions || existingProduct.specifications?.inclusions || [],
      restrictions: data.restrictions || existingProduct.specifications?.restrictions || [],
      updatedBy: session.user.id,
      lastModified: new Date()
    };

    // Inventory
    updateData.inventory = {
      ...existingProduct.inventory,
      stock: data.isUnlimited ? 999999 : (data.stock !== undefined ? data.stock : existingProduct.inventory.stock),
      sku: data.sku || existingProduct.inventory.sku,
      isUnlimited: data.isUnlimited !== undefined ? data.isUnlimited : existingProduct.inventory.isUnlimited
    };

    // Date de mise à jour
    updateData.updatedAt = new Date();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('category', 'name slug')
    .populate('vendor', 'firstName lastName vendorInfo.businessName');

    return NextResponse.json(updatedProduct);

  } catch (error: any) {
    console.error('Update Bazario Product Error:', error);
    
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Erreur de validation: ' + errorMessages.join(', ') },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Ce SKU existe déjà' },
        { status: 400 }
      );
    }

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

    // Vérifier que c'est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: 'ID de produit invalide' },
        { status: 400 }
      );
    }

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

    // Vérifier s'il y a des commandes liées à ce produit
    const hasOrders = await Order.findOne({
      'items.product': new mongoose.Types.ObjectId(productId)
    });

    if (hasOrders) {
      // Au lieu de supprimer, désactiver le produit s'il y a des commandes
      const deactivatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          status: 'inactive',
          'specifications.deletedBy': session.user.id,
          'specifications.deletedAt': new Date(),
          'specifications.deletionReason': 'Suppression demandée mais commandes existantes',
          updatedAt: new Date()
        },
        { new: true }
      );

      return NextResponse.json({ 
        message: 'Produit désactivé car des commandes existent',
        action: 'deactivated',
        product: deactivatedProduct
      });
    } else {
      // Suppression définitive si aucune commande
      await Product.findByIdAndDelete(productId);
      
      return NextResponse.json({ 
        message: 'Produit Bazario supprimé avec succès',
        action: 'deleted',
        productId
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