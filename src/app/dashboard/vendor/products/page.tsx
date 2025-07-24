'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Copy,
  AlertTriangle,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

// Mock data pour les produits
const mockProducts = [
  {
    id: '1',
    title: 'Vase en céramique artisanal',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    price: 89.99,
    stock: 5,
    status: 'active',
    sales: 23,
    views: 456,
    category: 'Céramique',
    createdAt: '2024-01-10',
    featured: true,
  },
  {
    id: '2',
    title: 'Bol en grès émaillé',
    image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2',
    price: 45.50,
    stock: 0,
    status: 'active',
    sales: 18,
    views: 324,
    category: 'Céramique',
    createdAt: '2024-01-08',
    featured: false,
  },
  {
    id: '3',
    title: 'Set de mugs personnalisés',
    image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2',
    price: 120.00,
    stock: 12,
    status: 'draft',
    sales: 15,
    views: 234,
    category: 'Céramique',
    createdAt: '2024-01-05',
    featured: false,
  },
  {
    id: '4',
    title: 'Assiettes décoratives',
    image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2',
    price: 67.80,
    stock: 8,
    status: 'inactive',
    sales: 9,
    views: 187,
    category: 'Céramique',
    createdAt: '2024-01-03',
    featured: false,
  },
];

const VendorProductsPage: React.FC = () => {
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

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Produits</h1>
            <p className="text-gray-600 mt-1">
              Gérez votre catalogue de créations artisanales
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/dashboard/vendor/products/new">
              <Button size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau produit
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Filtres et recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
                    placeholder="Rechercher par nom ou catégorie..."
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
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier ({selectedProducts.length})
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total produits', value: mockProducts.length, color: 'text-blue-600' },
          { label: 'Produits actifs', value: mockProducts.filter(p => p.status === 'active').length, color: 'text-green-600' },
          { label: 'Brouillons', value: mockProducts.filter(p => p.status === 'draft').length, color: 'text-yellow-600' },
          { label: 'Stock faible', value: mockProducts.filter(p => p.stock <= 5 && p.stock > 0).length, color: 'text-red-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.color}`}>{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Liste des produits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Catalogue ({filteredProducts.length} produits)
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
                    : 'Commencez par créer votre premier produit'
                  }
                </p>
                {(!searchQuery && statusFilter === 'all') && (
                  <Link href="/dashboard/vendor/products/new">
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
                        src={product.image}
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
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{product.category}</span>
                        <span>{formatPrice(product.price)}</span>
                        <span className={product.stock <= 5 ? 'text-red-600' : 'text-green-600'}>
                          Stock: {product.stock}
                          {product.stock === 0 && ' (Épuisé)'}
                          {product.stock <= 5 && product.stock > 0 && (
                            <AlertTriangle className="w-3 h-3 inline ml-1" />
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Statistiques */}
                    <div className="hidden sm:flex flex-col items-center text-center px-4">
                      <p className="text-sm font-medium text-gray-900">{product.sales}</p>
                      <p className="text-xs text-gray-500">ventes</p>
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
                      <Link href={`/products/${product.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/vendor/products/${product.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VendorProductsPage;