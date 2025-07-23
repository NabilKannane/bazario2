'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface FilterOptions {
  categories: Array<{ _id: string; name: string; count: number }>;
  priceRange: { min: number; max: number };
  tags: string[];
}

interface ActiveFilters {
  categories: string[];
  priceMin?: number;
  priceMax?: number;
  tags: string[];
  sortBy: string;
}

interface ProductFiltersProps {
  options: FilterOptions;
  filters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
  className?: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  options,
  filters,
  onFiltersChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (key: keyof ActiveFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    updateFilters('categories', newCategories);
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    updateFilters('tags', newTags);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      tags: [],
      sortBy: 'newest',
    });
  };

  const activeFiltersCount = filters.categories.length + filters.tags.length + 
    (filters.priceMin ? 1 : 0) + (filters.priceMax ? 1 : 0);

  return (
    <div className={className}>
      {/* Header mobile */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
            {activeFiltersCount > 0 && (
              <Badge className="ml-2">{activeFiltersCount}</Badge>
            )}
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <X className="w-4 h-4" />
          </motion.div>
        </Button>
      </div>

      {/* Filtres */}
      <motion.div
        initial={false}
        animate={{
          height: isOpen || window.innerWidth >= 1024 ? 'auto' : 0,
          opacity: isOpen || window.innerWidth >= 1024 ? 1 : 0,
        }}
        className="overflow-hidden lg:opacity-100 lg:h-auto"
      >
        <div className="space-y-6 bg-white lg:bg-transparent p-4 lg:p-0 rounded-lg border lg:border-0">
          {/* Tri */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Trier par</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters('sortBy', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
              <option value="price-low">Prix croissant</option>
              <option value="price-high">Prix décroissant</option>
              <option value="rating">Mieux notés</option>
              <option value="popular">Plus populaires</option>
            </select>
          </div>

          {/* Prix */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Prix</h3>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.priceMin || ''}
                onChange={(e) => updateFilters('priceMin', e.target.value ? Number(e.target.value) : undefined)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.priceMax || ''}
                onChange={(e) => updateFilters('priceMax', e.target.value ? Number(e.target.value) : undefined)}
                className="flex-1"
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Fourchette: {options.priceRange.min}€ - {options.priceRange.max}€
            </div>
          </div>

          {/* Catégories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Catégories</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {options.categories.map((category) => (
                <label
                  key={category._id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category._id)}
                    onChange={() => toggleCategory(category._id)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 flex-1">{category.name}</span>
                  <span className="text-xs text-gray-500">({category.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {options.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary-100"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          {activeFiltersCount > 0 && (
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="w-full"
              >
                Effacer tous les filtres
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductFilters;
