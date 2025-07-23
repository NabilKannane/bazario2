import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filter: any = {};

    // Filtrer selon le rôle
    if (session.user.role === 'buyer') {
      filter.buyer = session.user.id;
    } else if (session.user.role === 'vendor') {
      // Pour un vendeur, récupérer les commandes contenant ses produits
      filter['items.vendor'] = session.user.id;
    }
    // Les admins voient toutes les commandes

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .populate('buyer', 'firstName lastName email')
      .populate('items.product', 'title price images')
      .populate('items.vendor', 'firstName lastName vendorInfo.businessName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    return NextResponse.json({
      orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      }
    });

  } catch (error) {
    console.error('Orders API Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { items, shippingAddress, billingAddress, paymentMethod } = await request.json();

    // Validation des données
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Articles manquants' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !billingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'Informations manquantes' },
        { status: 400 }
      );
    }

    // Vérifier la disponibilité des produits et calculer les prix
    const orderItems = [];
    let subtotal = 0;
    let shippingCost = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId).populate('vendor');
      
      if (!product || product.status !== 'active') {
        return NextResponse.json(
          { error: `Produit ${item.productId} non disponible` },
          { status: 400 }
        );
      }

      if (!product.inventory.isUnlimited && product.inventory.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour ${product.title}` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      if (!product.shipping.freeShipping) {
        shippingCost += product.shipping.shippingCost;
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        vendor: product.vendor._id,
      });

      // Décrémenter le stock si pas illimité
      if (!product.inventory.isUnlimited) {
        await Product.findByIdAndUpdate(
          product._id,
          { $inc: { 'inventory.stock': -item.quantity } }
        );
      }
    }

    const tax = subtotal * 0.2; // TVA 20%
    const totalAmount = subtotal + shippingCost + tax;

    // Créer la commande
    const order = new Order({
      buyer: session.user.id,
      items: orderItems,
      subtotal,
      shippingCost,
      tax,
      totalAmount,
      shippingAddress,
      billingAddress,
      paymentMethod,
    });

    await order.save();
    await order.populate('items.product', 'title price images');
    await order.populate('items.vendor', 'firstName lastName vendorInfo.businessName');

    return NextResponse.json(order, { status: 201 });

  } catch (error) {
    console.error('Create Order Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}