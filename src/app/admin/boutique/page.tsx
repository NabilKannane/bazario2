'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreVertical,
  Copy,
  Store
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

// Mock data pour les produits de la boutique Bazario
const mockBazarioProducts = [
  {
    id: '1',
    title: 'Coffret Découverte Artisans du Maroc',
    description: 'Une sélection de produits artisanaux marocains authentiques',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    category: 'Coffrets',
    stock: 25,
    status: 'active',
    featured: true,
    sales: 156,
    views: 1250,
    rating: 4.8,
    reviewCount: 42,
    createdAt: '2024-01-15',
    sku: 'BAZ-COFFRET-001',
    type: 'bazario'
  },
  {
    id: '2',
    title: 'Carte Cadeau Bazario 50€',
    description: 'Carte cadeau valable sur tous les produits de la marketplace',
    price: 50.00,
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772'],
    category: 'Cartes Cadeaux',
    stock: 999,
    status: 'active',
    featured: false,
    sales: 89,
    views: 650,
    rating: 5.0,
    reviewCount: 23,
    createdAt: '2024-01-10',
    sku: 'BAZ-GIFT-50',
    type: 'bazario'
  },
  {
    id: '3',
    title: 'Pack Artisan Premium',
    description: 'Sélection premium des meilleures créations artisanales',
    price: 149.99,
    images: ['https://images.unsplash.com/photo-1610701596061-2ecf227e85b2'],
    category: 'Coffrets',
    stock: 12,
    status: 'active',
    featured: true,
    sales: 34,
    views: 890,
    rating: 4.9,
    reviewCount: 18,
    createdAt: '2024-01-08',
    sku: 'BAZ-PREMIUM-001',
    type: 'bazario'
  },
  {
    id: '4',
    title: 'Atelier Poterie - Bon d\'expérience',
    description: 'Bon pour un atelier de poterie avec un artisan partenaire',
    price: 85.00,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    category: 'Expériences',
    stock: 5,
    status: 'draft',
    featured: false,
    sales: 12,
    views: 234,
    rating: 4.7,
    reviewCount: 8,
    createdAt: '2024-01-05',
    sku: 'BAZ-EXP-POT-001',
    type: 'bazario'
  }
];

// Statistiques de la boutique Bazario
const mockBazarioStats = {
  totalProducts: 4,
  activeProducts: 3,
  totalSales: 291,
  totalRevenue: 15420.50,
  averageRating: 4.85,
  totalViews: 3024,
  featuredProducts: 2,
  draftProducts: 1
};

const AdminBoutiquePage: React.FC = () => {
  const [products, setProducts] = useState(mockBazarioProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'draft': return 'Brouillon';
      case 'inactive': return 'Inactif';
      default: return status;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedProducts.length === 0) return;
    
    switch (action) {
      case 'activate':
        setProducts(prev => prev.map(p => 
          selectedProducts.includes(p.id) ? { ...p, status: 'active' } : p
        ));
        break;
      case 'deactivate':
        setProducts(prev => prev.map(p => 
          selectedProducts.includes(p.id) ? { ...p, status: 'inactive' } : p
        ));
        break;
      case 'delete':
        if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProducts.length} produit(s) ?`)) {
          setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
        }
        break;
    }
    setSelectedProducts([]);
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
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Boutique Bazario
              </h1>
              <p className="text-gray-600 mt-1">
                Gérez les produits officiels de la marketplace Bazario
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Voir la boutique
            </Button>
            <Link href="/admin/boutique/products/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau produit
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            title: 'Total Produits', 
            value: mockBazarioStats.totalProducts, 
            icon: Package, 
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            change: '+2 ce mois'
          },
          { 
            title: 'Produits Actifs', 
            value: mockBazarioStats.activeProducts, 
            icon: CheckCircle, 
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            change: '75% actifs'
          },
          { 
            title: 'Ventes Totales', 
            value: mockBazarioStats.totalSales, 
            icon: ShoppingCart, 
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            change: '+15% ce mois'
          },
          { 
            title: 'Revenus', 
            value: `${formatPrice(mockBazarioStats.totalRevenue)}`, 
            icon: TrendingUp, 
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            change: '+22% ce mois'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.change}</p>
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

      {/* Filtres et recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Recherche */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher par nom, catégorie ou SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filtre par statut */}
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="draft">Brouillons</option>
                  <option value="inactive">Inactifs</option>
                </select>
              </div>

              {/* Actions groupées */}
              {selectedProducts.length > 0 && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkAction('activate')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activer ({selectedProducts.length})
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistiques rapides des filtres */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: products.length, color: 'text-gray-600' },
          { label: 'Actifs', value: products.filter(p => p.status === 'active').length, color: 'text-green-600' },
          { label: 'Brouillons', value: products.filter(p => p.status === 'draft').length, color: 'text-yellow-600' },
          { label: 'En vedette', value: products.filter(p => p.featured).length, color: 'text-orange-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.color}`}>{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Liste des produits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Produits Bazario ({filteredProducts.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-600">Tout sélectionner</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Modifiez vos critères de recherche'
                    : 'Commencez par créer votre premier produit Bazario'
                  }
                </p>
                {(!searchQuery && statusFilter === 'all') && (
                  <Link href="/admin/boutique/products/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un produit
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />

                    {/* Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Informations produit */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {product.title}
                        </h3>
                        {product.featured && (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            Vedette
                          </Badge>
                        )}
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          Bazario
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{product.category}</span>
                        <span>{formatPrice(product.price)}</span>
                        <span className={product.stock <= 10 ? 'text-red-600' : 'text-green-600'}>
                          Stock: {product.stock}
                        </span>
                        <span className="text-xs text-gray-500">SKU: {product.sku}</span>
                      </div>
                    </div>

                    {/* Statistiques */}
                    <div className="hidden sm:flex flex-col items-center text-center px-4">
                      <p className="text-sm font-medium text-gray-900">{product.sales}</p>
                      <p className="text-xs text-gray-500">ventes</p>
                    </div>

                    <div className="hidden sm:flex flex-col items-center text-center px-4">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">({product.reviewCount})</p>
                    </div>

                    <div className="hidden sm:flex flex-col items-center text-center px-4">
                      <p className="text-sm font-medium text-gray-900">{product.views}</p>
                      <p className="text-xs text-gray-500">vues</p>
                    </div>

                    {/* Statut */}
                    <div className="flex flex-col items-center">
                      <Badge className={getStatusColor(product.status)}>
                        {getStatusText(product.status)}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/boutique/products/${product.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/boutique/products/${product.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions rapides en bas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Boutique Officielle Bazario
                </h3>
                <p className="text-sm text-gray-600">
                  Gérez les produits exclusifs de la marketplace : coffrets, cartes cadeaux, expériences...
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <Button variant="outline" onClick={() => window.print()}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Imprimer rapport
                </Button>
                <Link href="/admin/boutique/products/new">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau produit
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminBoutiquePage;