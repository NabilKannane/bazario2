'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  Package, 
  Clock,
  MapPin,
  TrendingUp,
  Gift,
  User,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

// Mock data pour l'acheteur
const mockBuyerData = {
  profile: {
    name: 'Sophie Martin',
    email: 'sophie.martin@email.com',
    avatar: 'SM',
    memberSince: '2023',
    totalOrders: 12,
    totalSpent: 890.50,
    favoriteCategory: 'Céramique',
  },
  recentOrders: [
    {
      id: 'ORD-001',
      vendor: 'Atelier Marie',
      items: [{ name: 'Vase céramique', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96' }],
      total: 89.99,
      status: 'delivered',
      date: '2024-01-15',
    },
    {
      id: 'ORD-002', 
      vendor: 'Poterie Jean',
      items: [{ name: 'Set de bols', image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2' }],
      total: 125.00,
      status: 'shipped',
      date: '2024-01-10',
    },
  ],
  wishlist: [
    {
      id: '1',
      name: 'Sculpture moderne',
      vendor: 'Atelier Créatif',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Lampe artisanale', 
      vendor: 'Lumière & Co',
      price: 156.00,
      image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2',
      rating: 4.6,
    },
  ],
  recommendations: [
    {
      id: '1',
      name: 'Plateau en bois sculpté',
      vendor: 'Menuiserie Dupont',
      price: 78.50,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      rating: 4.9,
      badge: 'Nouveau',
    },
    {
      id: '2',
      name: 'Miroir décoratif',
      vendor: 'Atelier Reflets',
      price: 234.00,
      image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2',
      rating: 4.7,
      badge: 'Tendance',
    },
  ],
};

const BuyerDashboardPage: React.FC = () => {
  const { profile, recentOrders, wishlist, recommendations } = mockBuyerData;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'delivered': return { color: 'bg-green-100 text-green-800', text: 'Livré' };
      case 'shipped': return { color: 'bg-blue-100 text-blue-800', text: 'Expédié' };
      case 'processing': return { color: 'bg-yellow-100 text-yellow-800', text: 'En cours' };
      default: return { color: 'bg-gray-100 text-gray-800', text: status };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {profile.avatar}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Bonjour, {profile.name.split(' ')[0]} ! 👋
                </h1>
                <p className="text-gray-600">
                  Découvrez vos créations artisanales préférées
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <Button variant="outline">
                <User className="w-4 h-4 mr-2" />
                Mon Profil
              </Button>
              <Link href="/marketplace">
                <Button>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Explorer
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques utilisateur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { 
              title: 'Commandes', 
              value: profile.totalOrders.toString(), 
              icon: Package, 
              color: 'text-blue-600', 
              bgColor: 'bg-blue-100' 
            },
            { 
              title: 'Total dépensé', 
              value: formatPrice(profile.totalSpent), 
              icon: CreditCard, 
              color: 'text-green-600', 
              bgColor: 'bg-green-100' 
            },
            { 
              title: 'Favoris', 
              value: wishlist.length.toString(), 
              icon: Heart, 
              color: 'text-red-600', 
              bgColor: 'bg-red-100' 
            },
            { 
              title: 'Membre depuis', 
              value: profile.memberSince, 
              icon: Clock, 
              color: 'text-purple-600', 
              bgColor: 'bg-purple-100' 
            },
          ].map((stat, index) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Commandes récentes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Mes Commandes Récentes
                    </CardTitle>
                    <Link href="/dashboard/buyer/orders">
                      <Button variant="outline" size="sm">
                        Voir tout
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => {
                      const statusConfig = getStatusConfig(order.status);
                      return (
                        <div key={order.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-16 h-16 rounded-lg overflow-hidden">
                            <img
                              src={order.items[0].image}
                              alt={order.items[0].name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900">{order.id}</h4>
                              <Badge className={statusConfig.color}>
                                {statusConfig.text}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{order.vendor}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm text-gray-500">{order.date}</span>
                              <span className="font-semibold text-orange-600">
                                {formatPrice(order.total)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommandations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Recommandé pour vous
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendations.map((item) => (
                      <div key={item.id} className="group cursor-pointer">
                        <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          {item.badge && (
                            <Badge className="absolute top-2 right-2 bg-orange-500">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">{item.vendor}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-600">{item.rating}</span>
                          </div>
                          <span className="font-semibold text-orange-600">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Liste de souhaits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-lg">
                      <Heart className="w-5 h-5 mr-2" />
                      Ma Liste de Souhaits
                    </CardTitle>
                    <Link href="/dashboard/buyer/wishlist">
                      <Button variant="ghost" size="sm">
                        Voir tout
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {wishlist.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-600">{item.vendor}</p>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 mr-1" />
                              <span className="text-xs text-gray-600">{item.rating}</span>
                            </div>
                            <span className="text-sm font-semibold text-orange-600">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/marketplace">
                    <Button className="w-full justify-start" variant="outline">
                      <ShoppingBag className="w-4 h-4 mr-3" />
                      Explorer la marketplace
                    </Button>
                  </Link>
                  <Link href="/dashboard/buyer/orders">
                    <Button className="w-full justify-start" variant="outline">
                      <Package className="w-4 h-4 mr-3" />
                      Mes commandes
                    </Button>
                  </Link>
                  <Link href="/dashboard/buyer/wishlist">
                    <Button className="w-full justify-start" variant="outline">
                      <Heart className="w-4 h-4 mr-3" />
                      Ma liste de souhaits
                    </Button>
                  </Link>
                  <Link href="/dashboard/buyer/messages">
                    <Button className="w-full justify-start" variant="outline">
                      <Gift className="w-4 h-4 mr-3" />
                      Mes messages
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Catégorie préférée */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-orange-900 mb-2">
                    Votre catégorie préférée
                  </h3>
                  <p className="text-orange-800 font-medium mb-3">
                    {profile.favoriteCategory}
                  </p>
                  <Link href={`/marketplace?category=${profile.favoriteCategory.toLowerCase()}`}>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      Découvrir plus
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboardPage;
