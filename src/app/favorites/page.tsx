'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import ProductGrid from '@/components/product/ProductGrid';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/hooks/useCart';

// Mock data pour les favoris (remplacer par les vrais produits favoris)
const mockFavoriteProducts = [];

const FavoritesPage: React.FC = () => {
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();
  const { addItem } = useCart();

  const handleAddToCart = (productId: string) => {
    // Logique pour ajouter au panier
    console.log('Ajouter au panier:', productId);
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Aucun favori pour le moment
          </h1>
          <p className="text-gray-600 mb-8">
            Explorez nos créations et ajoutez vos coups de cœur à vos favoris
          </p>
          <Link href="/products">
            <Button size="lg">
              Découvrir nos produits
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mes Favoris
            </h1>
            <p className="text-gray-600">
              {favorites.length} produit{favorites.length > 1 ? 's' : ''} en favoris
            </p>
          </div>
          
          {favorites.length > 0 && (
            <Button
              variant="outline"
              onClick={clearFavorites}
              className="text-red-500 border-red-200 hover:bg-red-50"
            >
              Vider les favoris
            </Button>
          )}
        </motion.div>

        {/* <ProductGrid
          products={mockFavoriteProducts}
          onAddToCart={handleAddToCart}
          onToggleFavorite={toggleFavorite}
          favorites={favorites}
        /> */}
      </div>
    </div>
  );
};

export default FavoritesPage;