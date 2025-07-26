'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Store, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useUIStore } from '@/store/useUIStore';

interface DashboardStats {
  users: {
    totalUsers: number;
    totalBuyers: number;
    totalVendors: number;
    totalAdmins: number;
    verifiedUsers: number;
    pendingVendors: number;
    activeUsers: number;
  };
  products: {
    totalProducts: number;
    activeProducts: number;
    draftProducts: number;
    featuredProducts: number;
    totalViews: number;
  };
  orders: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    monthlyRevenue: number;
  };
  commission: number;
}

interface RecentUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  vendorInfo?: {
    isApproved?: boolean;
  };
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  buyer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: Array<{
    vendor: {
      firstName: string;
      lastName: string;
      vendorInfo?: {
        businessName: string;
      };
    };
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentUsers: RecentUser[];
  recentOrders: RecentOrder[];
}

const AdminPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useUIStore();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/dashboard');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du dashboard');
      }

      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (error: any) {
      console.error('Dashboard loading error:', error);
      setError(error.message);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de charger les données du dashboard',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': 
      case 'approved': 
      case 'completed': 
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending': 
        return 'bg-yellow-100 text-yellow-800';
      case 'processing': 
        return 'bg-blue-100 text-blue-800';
      case 'inactive': 
        return 'bg-gray-100 text-gray-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'completed': return 'Terminé';
      case 'delivered': return 'Livré';
      case 'processing': return 'En cours';
      case 'inactive': return 'Inactif';
      default: return status;
    }
  };

  const getUserStatus = (user: RecentUser) => {
    if (user.role === 'vendor') {
      return user.vendorInfo?.isApproved ? 'approved' : 'pending';
    }
    return user.isVerified ? 'active' : 'pending';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Erreur de chargement</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={loadDashboardData}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Admin
            </h1>
            <p className="text-gray-600 mt-1">
              Vue d'ensemble de votre plateforme Bazario
            </p>
          </div>
          <Button onClick={loadDashboardData} variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: 'Utilisateurs totaux',
            value: data.stats.users.totalUsers.toLocaleString(),
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            change: `${data.stats.users.activeUsers} actifs ce mois`,
            changeType: 'positive'
          },
          {
            title: 'Vendeurs actifs',
            value: `${data.stats.users.totalVendors}`,
            icon: Store,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            change: `${data.stats.users.pendingVendors} en attente`,
            changeType: 'neutral'
          },
          {
            title: 'Produits en ligne',
            value: data.stats.products.totalProducts.toLocaleString(),
            icon: Package,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            change: `${data.stats.products.activeProducts} actifs`,
            changeType: 'positive'
          },
          {
            title: 'Commission ce mois',
            value: formatPrice(data.stats.commission),
            icon: DollarSign,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            change: `CA: ${formatPrice(data.stats.orders.monthlyRevenue)}`,
            changeType: 'positive'
          }
        ].map((stat, index) => (
          <div key={stat.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-xs mt-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Alertes importantes */}
      {data.stats.users.pendingVendors > 0 && (
        <div className="mb-8 animate-slide-up">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-900">Actions requises</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-orange-800">
                    <Link href="/admin/vendors" className="hover:underline">
                      {data.stats.users.pendingVendors} vendeurs en attente d'approbation
                    </Link>
                    {data.stats.orders.pendingOrders > 0 && (
                      <>
                        <span>•</span>
                        <span>{data.stats.orders.pendingOrders} commandes en attente</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions rapides */}
      <div className="animate-slide-up mb-8" style={{ animationDelay: '400ms' }}>
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides d'administration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/admin/boutique">
                <div className="p-6 border-2 border-dashed border-stone-300 rounded-lg hover:border-stone-500 hover:bg-yellow-50 transition-colors cursor-pointer group">
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">Gérer Boutique Bazario</p>
                    <p className="text-sm text-gray-500 mt-1">Boutique Admin</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/vendors">
                <div className="p-6 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer">
                  <div className="text-center">
                    <Store className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">Gérer les vendeurs</p>
                    <p className="text-sm text-gray-500 mt-1">{data.stats.users.pendingVendors} en attente</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/users">
                <div className="p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="text-center">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">Gérer les utilisateurs</p>
                    <p className="text-sm text-gray-500 mt-1">{data.stats.users.totalUsers} utilisateurs</p>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Nouveaux utilisateurs */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Nouveaux utilisateurs</CardTitle>
                <Link href="/admin/users">
                  <Button variant="outline" size="sm">
                    Voir tout
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentUsers.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    Aucun nouvel utilisateur récemment
                  </p>
                ) : (
                  data.recentUsers.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                        <Badge className={getStatusColor(getUserStatus(user))}>
                          {getStatusText(getUserStatus(user))}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commandes récentes */}
        <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Commandes récentes</CardTitle>
                <Link href="/admin/orders">
                  <Button variant="outline" size="sm">
                    Voir tout
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentOrders.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    Aucune commande récente
                  </p>
                ) : (
                  data.recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-gray-900">{order.orderNumber}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {order.buyer.firstName} {order.buyer.lastName} → {
                            order.items[0]?.vendor?.vendorInfo?.businessName || 
                            `${order.items[0]?.vendor?.firstName} ${order.items[0]?.vendor?.lastName}`
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Commission: {formatPrice(order.totalAmount * 0.1)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;