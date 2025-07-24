import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

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

    const { vendorIds } = await request.json();

    if (!Array.isArray(vendorIds) || vendorIds.length === 0) {
      return NextResponse.json(
        { error: 'IDs de vendeurs requis' },
        { status: 400 }
      );
    }

    // Approuver plusieurs vendeurs en une fois
    const result = await User.updateMany(
      { 
        _id: { $in: vendorIds },
        role: 'vendor'
      },
      {
        $set: {
          isVerified: true,
          'vendorInfo.isApproved': true,
          'vendorInfo.approvedAt': new Date(),
          'vendorInfo.approvedBy': session.user.id
        }
      }
    );

    return NextResponse.json({
      message: `${result.modifiedCount} vendeurs approuvés`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Bulk Approve Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'approbation groupée' },
      { status: 500 }
    );
  }
}