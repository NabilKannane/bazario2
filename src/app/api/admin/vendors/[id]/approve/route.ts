import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(
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

    const vendorId = params.id;

    // Mettre à jour le vendeur pour l'approuver
    const updatedVendor = await User.findByIdAndUpdate(
      vendorId,
      {
        $set: {
          isVerified: true,
          'vendorInfo.isApproved': true,
          'vendorInfo.approvedAt': new Date(),
          'vendorInfo.approvedBy': session.user.id
        }
      },
      { new: true }
    ).select('-password');

    if (!updatedVendor) {
      return NextResponse.json(
        { error: 'Vendeur non trouvé' },
        { status: 404 }
      );
    }

    
    // TODO: Envoyer un email de confirmation au vendeur
    // await sendVendorApprovalEmail(updatedVendor.email);

    return NextResponse.json({
      message: 'Vendeur approuvé avec succès',
      vendor: updatedVendor
    });

  } catch (error) {
    console.error('Approve Vendor Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'approbation' },
      { status: 500 }
    );
  }
}
