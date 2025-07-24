import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

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

    // Récupérer tous les vendeurs en attente d'approbation
    const pendingVendors = await User.find({
      role: 'vendor',
      $or: [
        { 'vendorInfo.isApproved': false },
        { 'vendorInfo.isApproved': { $exists: false } }
      ]
    }).select('-password').sort({ createdAt: -1 });

    return NextResponse.json({
      vendors: pendingVendors,
      count: pendingVendors.length
    });

  } catch (error) {
    console.error('Pending Vendors API Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des vendeurs' },
      { status: 500 }
    );
  }
}