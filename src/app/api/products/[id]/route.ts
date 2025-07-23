import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const product = await Product.findById(params.id)
      .populate('category', 'name slug')
      .populate('vendor', 'firstName lastName avatar vendorInfo profile.bio profile.socialLinks');

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Incrémenter les vues
    await Product.findByIdAndUpdate(params.id, { $inc: { views: 1 } });

    return NextResponse.json(product);

  } catch (error) {
    console.error('Get Product Error:', error);
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
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();

    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier les permissions
    if (session.user.role !== 'admin' && product.vendor.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const data = await request.json();
    
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      { ...data, updatedAt: new Date() },
      { new: true }
    )
      .populate('category', 'name slug')
      .populate('vendor', 'firstName lastName avatar vendorInfo.businessName');

    return NextResponse.json(updatedProduct);

  } catch (error) {
    console.error('Update Product Error:', error);
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
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();

    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier les permissions
    if (session.user.role !== 'admin' && product.vendor.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    await Product.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Produit supprimé avec succès' });

  } catch (error) {
    console.error('Delete Product Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    );
  }
}
