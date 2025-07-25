'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Heart,
  AlertTriangle,
  Plus,
  Filter,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useVendorAuth } from '@/hooks/useAuth';
import Link from 'next/link';

// Mock data pour le dashboard
const mockStats = {
  totalProducts: 24,
  totalSales: 156,
  totalRevenue: 4580.50,
  monthlyRevenue: 890.30,
  totalViews: 2847,
  totalFavorites: 89,
  pendingOrders: 3,
  lowStockProducts: 2,
};

const mockRecentOrders = [
  {
    id: 'ORD-001',
    productName: 'Vase en céramique artisanal',
    customerName: 'Marie Dupont',
    amount: 89.99,
    status: 'pending',
    date: '2024-01-15',
    quantity: 1,
  },
  {
    id: 'ORD-002',
    productName: 'Bol en grès émaillé',
    customerName: 'Pierre Martin',
    amount: 45.50,
    status: 'confirmed',
    date: '2024-01-14',
    quantity: 2,
  },
  {
    id: 'ORD-003',
    productName: 'Set de mugs personnalisés',
    customerName: 'Sophie Laurent',
    amount: 120.00,
    status: 'shipped',
    date: '2024-01-13',
    quantity: 1,
  },
];

const mockTopProducts = [
  {
    id: '1',
    name: 'Vase en céramique artisanal',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    sales: 23,
    revenue: 2070.77,
    views: 456,
    stock: 5,
  },
  {
    id: '2',
    name: 'Bol en grès émaillé',
    image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2',
    sales: 18,
    revenue: 819.00,
    views: 324,
    stock: 12,
  },
  {
    id: '3',
    name: 'Set de mugs personnalisés',
    image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2',
    sales: 15,
    revenue: 1800.00,
    views: 234,
    stock: 2,
  },
];

const VendorDashboard: React.FC = () => {
  const { user, isLoading } = useVendorAuth();
  const [timeRange, setTimeRange] = useState('30d');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bonjour, {user?.name?.split(' ')[0]} ! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Voici un aperçu de votre activité récente
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">3 derniers mois</option>
                <option value="1y">Année en cours</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Action rapide */}
         <div className="bg-white mb-8"> 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/dashboard/vendor/products/new">
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors cursor-pointer group">
                    <div className="text-center">
                      <Plus className="w-8 h-8 text-gray-400 group-hover:text-orange-500 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">Ajouter un produit</p>
                      <p className="text-sm text-gray-500 mt-1">Créer une nouvelle création</p>
                    </div>
                  </div>
                </Link>

                <Link href="/dashboard/vendor/orders">
                  <div className="p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                    <div className="text-center">
                      <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">Gérer les commandes</p>
                      <p className="text-sm text-gray-500 mt-1">{mockStats.pendingOrders} en attente</p>
                    </div>
                  </div>
                </Link>

                {/* <Link href="/dashboard/vendor/analytics">
                  <div className="p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                    <div className="text-center">
                      <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">Voir les stats</p>
                      <p className="text-sm text-gray-500 mt-1">Analyser les performances</p>
                    </div>
                  </div>
                </Link> */}

                <Link href="/dashboard/vendor/profile">
                  <div className="p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">Mon profil</p>
                      <p className="text-sm text-gray-500 mt-1">Gérer mon atelier</p>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        </div> 

        {/* Alertes */}
        {/* {(mockStats.pendingOrders > 0 || mockStats.lowStockProducts > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-900">Actions requises</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-orange-800">
                      {mockStats.pendingOrders > 0 && (
                        <Link href="/dashboard/vendor/orders" className="hover:underline">
                          {mockStats.pendingOrders} commande{mockStats.pendingOrders > 1 ? 's' : ''} en attente
                        </Link>
                      )}
                      {mockStats.lowStockProducts > 0 && (
                        <Link href="/dashboard/vendor/products" className="hover:underline">
                          {mockStats.lowStockProducts} produit{mockStats.lowStockProducts > 1 ? 's' : ''} en rupture de stock
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )} */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Commandes récentes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className='bg-white '>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Commandes récentes</CardTitle>
                  <Link href="/dashboard/vendor/orders">
                    <Button variant="outline" size="sm">
                      Voir tout
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">{order.productName}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                          <span>{order.customerName}</span>
                          <span>Qté: {order.quantity}</span>
                          <span>{new Date(order.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-gray-900">{order.amount.toFixed(2)}€</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Produits les plus vendus */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className='bg-white'>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Produits populaires</CardTitle>
                  <Link href="/dashboard/vendor/analytics">
                    <Button variant="outline" size="sm">
                      Analytics
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTopProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span>{product.sales} ventes</span>
                          <span>{product.views} vues</span>
                          <span className={product.stock <= 5 ? 'text-red-600' : 'text-green-600'}>
                            Stock: {product.stock}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{product.revenue.toFixed(2)}€</p>
                        <p className="text-sm text-gray-600">#{index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>


      </div>
    </div>
  );
};

export default VendorDashboard;