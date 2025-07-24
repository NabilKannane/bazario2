// src/app/dashboard/vendor/shop/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  Settings, 
  Palette, 
  Globe, 
  Clock,
  Star,
  Package,
  TrendingUp,
  Users,
  Eye,
  Edit,
  Save,
  Upload,
  Camera
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useSession } from 'next-auth/react';

const ShopManagementPage: React.FC = () => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [shopData, setShopData] = useState({
    businessName: 'Atelier Céramique Marie',
    description: 'Créations uniques en céramique artisanale depuis 15 ans',
    banner: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    logo: 'https://images.unsplash.com/photo-1494790108755-2616b612b3bb',
    specialties: ['Céramique', 'Poterie', 'Grès'],
    openingHours: {
      monday: '9:00-18:00',
      tuesday: '9:00-18:00',
      wednesday: '9:00-18:00',
      thursday: '9:00-18:00',
      friday: '9:00-18:00',
      saturday: '10:00-16:00',
      sunday: 'Fermé'
    },
    socialLinks: {
      website: 'https://atelier-marie-ceramique.fr',
      instagram: '@marie_ceramique',
      facebook: 'AtelierMarieCeramique'
    },
    policies: {
      returnPolicy: '30 jours de retour gratuit',
      shippingPolicy: 'Livraison sous 3-5 jours ouvrés',
      customOrderPolicy: 'Commandes personnalisées acceptées'
    }
  });

  const [stats] = useState({
    totalProducts: 24,
    activeProducts: 20,
    totalViews: 1234,
    totalFavorites: 89,
    rating: 4.8,
    totalSales: 156,
    monthlyRevenue: 2450.00
  });

  const handleSave = async () => {
    try {
      const response = await fetch('/api/vendor/shop', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shopData),
      });

      if (response.ok) {
        setIsEditing(false);
        // Notification de succès
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Ma Boutique</h1>
            <p className="text-gray-600 mt-1">
              Gérez l'apparence et les paramètres de votre boutique
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Aperçu public
            </Button>
            {isEditing ? (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Statistiques de la boutique */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            title: 'Produits actifs', 
            value: `${stats.activeProducts}/${stats.totalProducts}`, 
            icon: Package, 
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
          },
          { 
            title: 'Vues totales', 
            value: stats.totalViews.toLocaleString(), 
            icon: Eye, 
            color: 'text-green-600',
            bgColor: 'bg-green-100'
          },
          { 
            title: 'Note moyenne', 
            value: `${stats.rating}/5`, 
            icon: Star, 
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
          },
          { 
            title: 'Revenus du mois', 
            value: `${stats.monthlyRevenue.toFixed(2)}€`, 
            icon: TrendingUp, 
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
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
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-8">
          {/* Apparence de la boutique */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Apparence de la boutique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bannière */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bannière de la boutique
                  </label>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={shopData.banner}
                      alt="Bannière"
                      className="w-full h-full object-cover"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Button variant="secondary">
                          <Camera className="w-4 h-4 mr-2" />
                          Changer la bannière
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo de l'atelier
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                      <img
                        src={shopData.logo}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                      {isEditing && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <Upload className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Changer le logo
                      </Button>
                    )}
                  </div>
                </div>

                {/* Nom et description */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la boutique
                    </label>
                    {isEditing ? (
                      <Input
                        value={shopData.businessName}
                        onChange={(e) => setShopData(prev => ({
                          ...prev,
                          businessName: e.target.value
                        }))}
                        placeholder="Nom de votre atelier"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{shopData.businessName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    {isEditing ? (
                      <textarea
                        value={shopData.description}
                        onChange={(e) => setShopData(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Décrivez votre atelier et votre savoir-faire..."
                      />
                    ) : (
                      <p className="text-gray-700">{shopData.description}</p>
                    )}
                  </div>
                </div>

                {/* Spécialités */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spécialités
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {shopData.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                        {isEditing && (
                          <button className="ml-1 text-gray-500 hover:text-red-500">×</button>
                        )}
                      </Badge>
                    ))}
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        + Ajouter
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Informations et liens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Réseaux sociaux */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Réseaux sociaux</h4>
                  {Object.entries(shopData.socialLinks).map(([platform, value]) => (
                    <div key={platform}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {platform}
                      </label>
                      {isEditing ? (
                        <Input
                          value={value}
                          onChange={(e) => setShopData(prev => ({
                            ...prev,
                            socialLinks: {
                              ...prev.socialLinks,
                              [platform]: e.target.value
                            }
                          }))}
                          placeholder={`Votre ${platform}`}
                        />
                      ) : (
                        <p className="text-gray-700">{value || 'Non renseigné'}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Politiques de la boutique */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Politiques de la boutique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(shopData.policies).map(([policy, value]) => (
                  <div key={policy}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {policy === 'returnPolicy' && 'Politique de retour'}
                      {policy === 'shippingPolicy' && 'Politique de livraison'}
                      {policy === 'customOrderPolicy' && 'Commandes personnalisées'}
                    </label>
                    {isEditing ? (
                      <textarea
                        value={value}
                        onChange={(e) => setShopData(prev => ({
                          ...prev,
                          policies: {
                            ...prev.policies,
                            [policy]: e.target.value
                          }
                        }))}
                        rows={2}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-700">{value}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Horaires d'ouverture */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="w-5 h-5 mr-2" />
                  Horaires d'ouverture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(shopData.openingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {day === 'monday' && 'Lundi'}
                        {day === 'tuesday' && 'Mardi'}
                        {day === 'wednesday' && 'Mercredi'}
                        {day === 'thursday' && 'Jeudi'}
                        {day === 'friday' && 'Vendredi'}
                        {day === 'saturday' && 'Samedi'}
                        {day === 'sunday' && 'Dimanche'}
                      </span>
                      {isEditing ? (
                        <Input
                          value={hours}
                          onChange={(e) => setShopData(prev => ({
                            ...prev,
                            openingHours: {
                              ...prev.openingHours,
                              [day]: e.target.value
                            }
                          }))}
                          className="w-24 text-xs"
                          placeholder="9:00-18:00"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{hours}</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Aperçu des performances */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Performances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ventes totales</span>
                    <span className="font-semibold">{stats.totalSales}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Favoris</span>
                    <span className="font-semibold">{stats.totalFavorites}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Note moyenne</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-semibold">{stats.rating}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions rapides */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Package className="w-4 h-4 mr-3" />
                  Ajouter un produit
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-3" />
                  Voir les avis clients
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-3" />
                  Analytics détaillées
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Store className="w-4 h-4 mr-3" />
                  Aperçu public
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ShopManagementPage;