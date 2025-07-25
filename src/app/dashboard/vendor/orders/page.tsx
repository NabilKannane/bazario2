'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  MessageSquare,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

// Mock data pour les commandes
const mockOrders = [
  {
    id: 'ORD-001',
    orderNumber: 'CMD-20240115-001',
    customer: {
      name: 'Marie Dupont',
      email: 'marie.dupont@email.com',
      avatar: 'MD',
    },
    items: [
      {
        id: '1',
        name: 'Vase en céramique artisanal',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
        quantity: 1,
        price: 89.99,
      }
    ],
    totalAmount: 89.99,
    status: 'pending',
    paymentStatus: 'paid',
    createdAt: '2024-01-15T10:30:00Z',
    shippingAddress: {
      name: 'Marie Dupont',
      street: '123 rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
    },
    notes: 'Livraison rapide si possible, c\'est un cadeau !',
  },
  {
    id: 'ORD-002',
    orderNumber: 'CMD-20240114-002',
    customer: {
      name: 'Pierre Martin',
      email: 'pierre.martin@email.com',
      avatar: 'PM',
    },
    items: [
      {
        id: '2',
        name: 'Bol en grès émaillé',
        image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2',
        quantity: 2,
        price: 45.50,
      }
    ],
    totalAmount: 91.00,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2024-01-14T14:20:00Z',
    shippingAddress: {
      name: 'Pierre Martin',
      street: '456 avenue des Champs',
      city: 'Lyon',
      postalCode: '69001',
      country: 'France',
    },
    notes: '',
  },
  {
    id: 'ORD-003',
    orderNumber: 'CMD-20240113-003',
    customer: {
      name: 'Sophie Laurent',
      email: 'sophie.laurent@email.com',
      avatar: 'SL',
    },
    items: [
      {
        id: '3',
        name: 'Set de mugs personnalisés',
        image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2',
        quantity: 1,
        price: 120.00,
      }
    ],
    totalAmount: 120.00,
    status: 'shipped',
    paymentStatus: 'paid',
    createdAt: '2024-01-13T09:15:00Z',
    trackingNumber: 'FR1234567890',
    shippingAddress: {
      name: 'Sophie Laurent',
      street: '789 boulevard Saint-Germain',
      city: 'Marseille',
      postalCode: '13001',
      country: 'France',
    },
    notes: '',
  },
  {
    id: 'ORD-004',
    orderNumber: 'CMD-20240112-004',
    customer: {
      name: 'Jean Dubois',
      email: 'jean.dubois@email.com',
      avatar: 'JD',
    },
    items: [
      {
        id: '4',
        name: 'Assiettes décoratives',
        image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2',
        quantity: 4,
        price: 67.80,
      }
    ],
    totalAmount: 271.20,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2024-01-12T16:45:00Z',
    deliveredAt: '2024-01-16T11:30:00Z',
    shippingAddress: {
      name: 'Jean Dubois',
      street: '321 rue de Rivoli',
      city: 'Toulouse',
      postalCode: '31000',
      country: 'France',
    },
    notes: '',
  },
];

const VendorOrdersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock,
          text: 'En attente',
        };
      case 'confirmed':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: CheckCircle,
          text: 'Confirmée',
        };
      case 'shipped':
        return {
          color: 'bg-indigo-100 text-indigo-800',
          icon: Truck,
          text: 'Expédiée',
        };
      case 'delivered':
        return {
          color: 'bg-green-100 text-green-800',
          icon: Package,
          text: 'Livrée',
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle,
          text: 'Annulée',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: Package,
          text: status,
        };
    }
  };

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: mockOrders.length,
    pending: mockOrders.filter(o => o.status === 'pending').length,
    confirmed: mockOrders.filter(o => o.status === 'confirmed').length,
    shipped: mockOrders.filter(o => o.status === 'shipped').length,
    delivered: mockOrders.filter(o => o.status === 'delivered').length,
    cancelled: mockOrders.filter(o => o.status === 'cancelled').length,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Commandes</h1>
            <p className="text-gray-600 mt-1">
              Gérez et suivez vos commandes en temps réel
            </p>
          </div>
        </div>
      </motion.div>


 {/* Recherche et filtres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher par numéro, client ou produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        {[
          { key: 'all', label: 'Total', color: 'text-gray-600' },
          { key: 'pending', label: 'En attente', color: 'text-yellow-600' },
          { key: 'confirmed', label: 'Confirmées', color: 'text-blue-600' },
          { key: 'shipped', label: 'Expédiées', color: 'text-indigo-600' },
          { key: 'delivered', label: 'Livrées', color: 'text-green-600' },
          { key: 'cancelled', label: 'Annulées', color: 'text-red-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all ${
                statusFilter === stat.key ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:shadow-md'
              }`}
              onClick={() => setStatusFilter(stat.key)}
            >
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {statusCounts[stat.key as keyof typeof statusCounts]}
                </p>
                <p className={`text-sm ${stat.color}`}>{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

     

      {/* Liste des commandes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              Commandes ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune commande trouvée
                </h3>
                <p className="text-gray-600">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Modifiez vos critères de recherche'
                    : 'Vous n\'avez pas encore reçu de commandes'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="shadow-sm bg-gray-50 rounded-lg p-6 hover:bg-white transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          {/* Avatar client */}
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                            {order.customer.avatar}
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                {order.orderNumber}
                              </h3>
                              <Badge className={statusConfig.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.text}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{order.customer.name}</span>
                              <span>{formatDate(order.createdAt)}</span>
                              <span className="font-medium text-gray-900">
                                {formatPrice(order.totalAmount)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Link href={`/dashboard/vendor/orders/${order.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Produits commandés */}
                      <div className="space-y-2 mb-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{item.name}</p>
                              <div className="flex items-center space-x-3 text-sm text-gray-600">
                                <span>Qté: {item.quantity}</span>
                                <span>{formatPrice(item.price)} / unité</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Informations supplémentaires */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100 space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>📍 {order.shippingAddress.city}</span>
                          {order.trackingNumber && (
                            <span>📦 {order.trackingNumber}</span>
                          )}
                          {order.notes && (
                            <span className="flex items-center">
                              💬 <span className="ml-1 truncate max-w-xs">{order.notes}</span>
                            </span>
                          )}
                        </div>

                        {/* Actions rapides */}
                        <div className="flex items-center space-x-2">
                          {order.status === 'pending' && (
                            <Button size="sm" variant="outline">
                              ✅ Confirmer
                            </Button>
                          )}
                          {order.status === 'confirmed' && (
                            <Button size="sm" variant="outline">
                              📦 Expédier
                            </Button>
                          )}
                          {order.status === 'shipped' && order.trackingNumber && (
                            <Button size="sm" variant="outline">
                              🚚 Suivre
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VendorOrdersPage;