// src/app/api/admin/bazario-products/bulk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import mongoose from 'mongoose';

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

    const { action, productIds } = await request.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'IDs de produits requis' },
        { status: 400 }
      );
    }

    // Convertir les IDs en ObjectId
    const objectIds = productIds.map(id => new mongoose.Types.ObjectId(id));

    let result;

    switch (action) {
      case 'activate':
        result = await Product.updateMany(
          { 
            _id: { $in: objectIds },
            $or: [
              { tags: { $in: ['bazario', 'officiel'] } },
              { 'specifications.isBazarioProduct': true }
            ]
          },
          {
            $set: {
              status: 'active',
              'specifications.bulkUpdatedBy': session.user.id,
              'specifications.bulkUpdatedAt': new Date()
            }
          }
        );
        break;

      case 'deactivate':
        result = await Product.updateMany(
          { 
            _id: { $in: objectIds },
            $or: [
              { tags: { $in: ['bazario', 'officiel'] } },
              { 'specifications.isBazarioProduct': true }
            ]
          },
          {
            $set: {
              status: 'inactive',
              'specifications.bulkUpdatedBy': session.user.id,
              'specifications.bulkUpdatedAt': new Date()
            }
          }
        );
        break;

      case 'delete':
        // Vérifier les commandes avant suppression
        const productsWithOrders = await Order.aggregate([
          {
            $match: {
              'items.product': { $in: objectIds }
            }
          },
          {
            $group: {
              _id: '$items.product'
            }
          }
        ]);

        const productIdsWithOrders = productsWithOrders.map(p => p._id.toString());
        const productIdsToDelete = productIds.filter(id => !productIdsWithOrders.includes(id));

        let deactivatedCount = 0;
        let deletedCount = 0;

        // Désactiver ceux avec des commandes
        if (productIdsWithOrders.length > 0) {
          const deactivateResult = await Product.updateMany(
            { 
              _id: { $in: productIdsWithOrders.map(id => new mongoose.Types.ObjectId(id)) },
              $or: [
                { tags: { $in: ['bazario', 'officiel'] } },
                { 'specifications.isBazarioProduct': true }
              ]
            },
            {
              $set: {
                status: 'inactive',
                'specifications.bulkDeletedBy': session.user.id,
                'specifications.bulkDeletedAt': new Date(),
                'specifications.reason': 'Suppression demandée mais commandes existantes'
              }
            }
          );
          deactivatedCount = deactivateResult.modifiedCount;
        }

        // Supprimer ceux sans commandes
        if (productIdsToDelete.length > 0) {
          const deleteResult = await Product.deleteMany({
            _id: { $in: productIdsToDelete.map(id => new mongoose.Types.ObjectId(id)) },
            $or: [
              { tags: { $in: ['bazario', 'officiel'] } },
              { 'specifications.isBazarioProduct': true }
            ]
          });
          deletedCount = deleteResult.deletedCount;
        }

        result = {
          deactivated: deactivatedCount,
          deleted: deletedCount,
          total: deactivatedCount + deletedCount
        };
        break;

      case 'feature':
        result = await Product.updateMany(
          { 
            _id: { $in: objectIds },
            $or: [
              { tags: { $in: ['bazario', 'officiel'] } },
              { 'specifications.isBazarioProduct': true }
            ]
          },
          {
            $set: {
              featured: true,
              'specifications.bulkUpdatedBy': session.user.id,
              'specifications.bulkUpdatedAt': new Date()
            }
          }
        );
        break;

      case 'unfeature':
        result = await Product.updateMany(
          { 
            _id: { $in: objectIds },
            $or: [
              { tags: { $in: ['bazario', 'officiel'] } },
              { 'specifications.isBazarioProduct': true }
            ]
          },
          {
            $set: {
              featured: false,
              'specifications.bulkUpdatedBy': session.user.id,
              'specifications.bulkUpdatedAt': new Date()
            }
          }
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Action non supportée' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: `Action "${action}" effectuée avec succès`,
      result,
      success: true
    });

  } catch (error) {
    console.error('Bulk Action Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'action groupée' },
      { status: 500 }
    );
  }
}