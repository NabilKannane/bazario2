'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Mail,
  User,
  Store,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useUIStore } from '@/store/useUIStore';

// Types
interface PendingVendor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  vendorInfo?: {
    businessName?: string;
    businessDescription?: string;
    specialties?: string[];
    isApproved: boolean;
  };
  profile?: {
    phone?: string;
    address?: any;
  };
}

const AdminVendorManagement: React.FC = () => {
  const [pendingVendors, setPendingVendors] = useState<PendingVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { addNotification } = useUIStore();

  // Charger les vendeurs en attente
  useEffect(() => {
    fetchPendingVendors();
  }, []);

  const fetchPendingVendors = async () => {
    try {
      const response = await fetch('/api/admin/pending-vendors');
      if (response.ok) {
        const data = await response.json();
        setPendingVendors(data.vendors || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Approuver un vendeur
  const approveVendor = async (vendorId: string) => {
    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/approve`, {
        method: 'POST',
      });

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Vendeur approuvé',
          message: 'Le vendeur a été approuvé avec succès',
        });
        
        // Mettre à jour la liste
        setPendingVendors(prev => 
          prev.filter(vendor => vendor._id !== vendorId)
        );
      } else {
        throw new Error('Erreur lors de l\'approbation');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible d\'approuver le vendeur',
      });
    }
  };

  // Rejeter un vendeur
  const rejectVendor = async (vendorId: string) => {
    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/reject`, {
        method: 'POST',
      });

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Vendeur rejeté',
          message: 'La demande a été rejetée',
        });
        
        setPendingVendors(prev => 
          prev.filter(vendor => vendor._id !== vendorId)
        );
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de rejeter la demande',
      });
    }
  };

  const filteredVendors = pendingVendors.filter(vendor =>
    vendor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.vendorInfo?.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestion des Vendeurs
        </h1>
        <p className="text-gray-600">
          Approuvez ou rejetez les demandes de nouveaux vendeurs
        </p>
      </motion.div>

      {/* Recherche et statistiques */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher par nom, email ou entreprise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {pendingVendors.length}
            </div>
            <div className="text-sm text-gray-600">En attente</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des vendeurs en attente */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes en attente ({filteredVendors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune demande en attente
              </h3>
              <p className="text-gray-600">
                Toutes les demandes de vendeurs ont été traitées
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVendors.map((vendor) => (
                <motion.div
                  key={vendor._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        {vendor.firstName.charAt(0)}{vendor.lastName.charAt(0)}
                      </div>

                      {/* Informations */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {vendor.firstName} {vendor.lastName}
                          </h3>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Clock className="w-3 h-3 mr-1" />
                            En attente
                          </Badge>
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            {vendor.email}
                          </div>
                          {vendor.vendorInfo?.businessName && (
                            <div className="flex items-center">
                              <Store className="w-4 h-4 mr-2" />
                              {vendor.vendorInfo.businessName}
                            </div>
                          )}
                          {vendor.profile?.phone && (
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              {vendor.profile.phone}
                            </div>
                          )}
                        </div>

                        {/* Description de l'entreprise */}
                        {vendor.vendorInfo?.businessDescription && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-700">
                              {vendor.vendorInfo.businessDescription}
                            </p>
                          </div>
                        )}

                        {/* Spécialités */}
                        {vendor.vendorInfo?.specialties && vendor.vendorInfo.specialties.length > 0 && (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {vendor.vendorInfo.specialties.map((specialty) => (
                                <Badge key={specialty} variant="secondary" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Date de demande */}
                        <div className="mt-3 text-xs text-gray-500">
                          Demande soumise le {new Date(vendor.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Ouvrir modal de détails
                          console.log('Voir détails:', vendor._id);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Détails
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => rejectVendor(vendor._id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rejeter
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={() => approveVendor(vendor._id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approuver
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVendorManagement;