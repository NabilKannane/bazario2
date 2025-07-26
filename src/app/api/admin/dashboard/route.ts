import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Récupérer les statistiques globales
    const [userStats, productStats, orderStats] = await Promise.all([
      // Statistiques utilisateurs
      User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            totalBuyers: {
              $sum: { $cond: [{ $eq: ['$role', 'buyer'] }, 1, 0] }
            },
            totalVendors: {
              $sum: { $cond: [{ $eq: ['$role', 'vendor'] }, 1, 0] }
            },
            totalAdmins: {
              $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
            },
            verifiedUsers: {
              $sum: { $cond: ['$isVerified', 1, 0] }
            },
            pendingVendors: {
              $sum: { 
                $cond: [
                  { 
                    $and: [
                      { $eq: ['$role', 'vendor'] },
                      { $ne: ['$vendorInfo.isApproved', true] }
                    ]
                  }, 
                  1, 
                  0
                ] 
              }
            },
            activeUsers: {
              $sum: {
                $cond: [
                  { $gte: ['$updatedAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]),

      // Statistiques produits
      Product.aggregate([
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
            totalViews: { $sum: '$views' }
          }
        }
      ]),

      // Statistiques commandes
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            completedOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
            },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            totalRevenue: {
              $sum: { 
                $cond: [
                  { $eq: ['$paymentStatus', 'paid'] },
                  '$totalAmount',
                  0
                ]
              }
            },
            monthlyRevenue: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$paymentStatus', 'paid'] },
                      { $gte: ['$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] }
                    ]
                  },
                  '$totalAmount',
                  0
                ]
              }
            }
          }
        }
      ])
    ]);

    // Récupérer les utilisateurs récents
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Récupérer les commandes récentes
    const recentOrders = await Order.find()
      .populate('buyer', 'firstName lastName email')
      .populate('items.vendor', 'firstName lastName vendorInfo.businessName')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Calculer la commission (10% du chiffre d'affaires)
    const monthlyRevenue = orderStats[0]?.monthlyRevenue || 0;
    const commission = monthlyRevenue * 0.1;

    return NextResponse.json({
      stats: {
        users: userStats[0] || {
          totalUsers: 0,
          totalBuyers: 0,
          totalVendors: 0,
          totalAdmins: 0,
          verifiedUsers: 0,
          pendingVendors: 0,
          activeUsers: 0
        },
        products: productStats[0] || {
          totalProducts: 0,
          activeProducts: 0,
          draftProducts: 0,
          featuredProducts: 0,
          totalViews: 0
        },
        orders: orderStats[0] || {
          totalOrders: 0,
          completedOrders: 0,
          pendingOrders: 0,
          totalRevenue: 0,
          monthlyRevenue: 0
        },
        commission
      },
      recentUsers,
      recentOrders
    });

  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données du dashboard' },
      { status: 500 }
    );
  }
}
