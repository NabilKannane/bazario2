'use client';

import React from 'react';
import { 
  Users, 
  Store, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

// Mock data pour le dashboard admin
const mockStats = {
  totalUsers: 1247,
  totalVendors: 156,
  pendingVendors: 8,
  totalProducts: 892,
  totalOrders: 1568,
  monthlyRevenue: 25480.50,
  commission: 2548.05,
  activeUsers: 328,
};

const mockRecentUsers = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    role: 'vendor',
    status: 'pending',
    joinedAt: '2024-01-20',
  },
  {
    id: '2',
    name: 'Pierre Martin',
    email: 'pierre.martin@email.com',
    role: 'buyer',
    status: 'active',
    joinedAt: '2024-01-19',
  },
  {
    id: '3',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@email.com',
    role: 'vendor',
    status: 'approved',
    joinedAt: '2024-01-18',
  },
];

const mockRecentOrders = [
  {
    id: 'ORD-001',
    customer: 'Jean Dupont',
    vendor: 'Atelier Marie',
    amount: 89.99,
    status: 'completed',
    date: '2024-01-20',
  },
  {
    id: 'ORD-002',
    customer: 'Anne Bernard',
    vendor: 'Poterie Jean',
    amount: 156.00,
    status: 'processing',
    date: '2024-01-20',
  },
  {
    id: 'ORD-003',
    customer: 'Paul Durand',
    vendor: 'Menuiserie Paul',
    amount: 234.50,
    status: 'pending',
    date: '2024-01-19',
  },
];

const AdminPage: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': 
      case 'approved': 
      case 'completed': 
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
      case 'processing': return 'En cours';
      case 'inactive': return 'Inactif';
      default: return status;
    }
  };

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
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: 'Utilisateurs totaux',
            value: mockStats.totalUsers.toLocaleString(),
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            change: '+12 cette semaine',
            changeType: 'positive'
          },
          {
            title: 'Vendeurs actifs',
            value: `${mockStats.totalVendors}`,
            icon: Store,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            change: `${mockStats.pendingVendors} en attente`,
            changeType: 'neutral'
          },
          {
            title: 'Produits en ligne',
            value: mockStats.totalProducts.toLocaleString(),
            icon: Package,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            change: '+45 ce mois',
            changeType: 'positive'
          },
          {
            title: 'Commission ce mois',
            value: `€${mockStats.commission.toFixed(2)}`,
            icon: DollarSign,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            change: '+18% vs mois dernier',
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
      <div className="mb-8 animate-slide-up">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-900">Actions requises</h3>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-orange-800">
                  <Link href="/admin/vendors" className="hover:underline">
                    {mockStats.pendingVendors} vendeurs en attente d'approbation
                  </Link>
                  <span>•</span>
                  <Link href="/admin/reports" className="hover:underline">
                    3 signalements en cours
                  </Link>
                  <span>•</span>
                  <Link href="/admin/products" className="hover:underline">
                    12 produits à valider
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Actions rapides */}
      <div className="animate-slide-up mb-8" style={{ animationDelay: '400ms' }}>
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides d'administration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

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
                    <p className="text-sm text-gray-500 mt-1">{mockStats.pendingVendors} en attente</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/users">
                <div className="p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="text-center">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">Gérer les utilisateurs</p>
                    <p className="text-sm text-gray-500 mt-1">{mockStats.totalUsers} utilisateurs</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/analytics">
                <div className="p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">Analytics avancées</p>
                    <p className="text-sm text-gray-500 mt-1">Rapports détaillés</p>
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
                {mockRecentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">Inscrit le {new Date(user.joinedAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                      <Badge className={getStatusColor(user.status)}>
                        {getStatusText(user.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
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
                {mockRecentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{order.customer} → {order.vendor}</p>
                      <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">€{order.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Commission: €{(order.amount * 0.1).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


    </div>
  );
};

export default AdminPage;