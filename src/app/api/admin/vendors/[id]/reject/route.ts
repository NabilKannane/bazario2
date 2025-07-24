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
    const { reason } = await request.json();

    // Marquer comme rejeté (ou supprimer selon votre logique)
    const updatedVendor = await User.findByIdAndUpdate(
      vendorId,
      {
        $set: {
          'vendorInfo.isApproved': false,
          'vendorInfo.rejectedAt': new Date(),
          'vendorInfo.rejectedBy': session.user.id,
          'vendorInfo.rejectionReason': reason
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

    // TODO: Envoyer un email de rejet au vendeur
    // await sendVendorRejectionEmail(updatedVendor.email, reason);

    return NextResponse.json({
      message: 'Demande rejetée',
      vendor: updatedVendor
    });

  } catch (error) {
    console.error('Reject Vendor Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du rejet' },
      { status: 500 }
    );
  }
}