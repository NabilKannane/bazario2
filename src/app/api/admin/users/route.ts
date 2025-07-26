// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    // Construction du filtre
    let filter: any = {};
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role && role !== 'all') {
      filter.role = role;
    }

    if (status && status !== 'all') {
      if (status === 'verified') {
        filter.isVerified = true;
      } else if (status === 'unverified') {
        filter.isVerified = false;
      } else if (status === 'pending') {
        filter.role = 'vendor';
        filter['vendorInfo.isApproved'] = { $ne: true };
      }
    }

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(filter);

    // Calculer les statistiques
    const stats = await User.aggregate([
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
          }
        }
      }
    ]);

    return NextResponse.json({
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      stats: stats[0] || {
        totalUsers: 0,
        totalBuyers: 0,
        totalVendors: 0,
        totalAdmins: 0,
        verifiedUsers: 0,
        pendingVendors: 0
      }
    });

  } catch (error) {
    console.error('Users API Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}
