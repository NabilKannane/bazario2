'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';

const ProductsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    categories: [],
    tags: [],
    sortBy: 'newest',
    priceMin: undefined,
    priceMax: undefined,
  });

  const { products, loading, pagination } = useProducts(filters);
  const { addItem } = useCart();
  const { toggleFavorite, favorites } = useFavorites();

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      addItem(product, 1);
    }
  };

  const filterOptions = {
    categories: [
      { _id: '1', name: 'Céramique', count: 25 },
      { _id: '2', name: 'Textile', count: 18 },
      { _id: '3', name: 'Bois', count: 32 },
      { _id: '4', name: 'Métal', count: 15 },
    ],
    priceRange: { min: 10, max: 500 },
    tags: ['fait-main', 'écologique', 'moderne', 'traditionnel', 'unique'],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nos Produits Artisanaux
          </h1>
          <p className="text-gray-600">
            Découvrez {pagination?.total || 0} créations uniques faites avec passion
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtres */}
          <div className="lg:w-1/4">
            {/* <ProductFilters
              options={filterOptions}
              filters={filters}
              onFiltersChange={setFilters}
            /> */}
          </div>

          {/* Grille de produits */}
          <div className="lg:w-3/4">
            <ProductGrid
              products={products}
              loading={loading}
              onAddToCart={handleAddToCart}
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
            />

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        page === pagination.current
                          ? 'bg-orange-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border'
                      }`}
                    //   onClick={() => setFilters({ ...filters, page })}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;