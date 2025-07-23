'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    hover: { 
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const imageVariants = {
    hover: { scale: 1.1 }
  };

  return (
    <motion.div
    //   variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group"
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden">
          <motion.div
            variants={imageVariants}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Image
              src={product.images[0] || '/placeholder-product.jpg'}
              alt={product.title}
              fill
              className="object-cover"
            />
          </motion.div>
          
          {/* Overlay avec actions */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center space-x-2 transition-opacity"
          >
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onAddToCart?.(product._id)}
              className="opacity-90 hover:opacity-100"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
            <Button
              size="sm"
              variant={isFavorite ? "destructive" : "secondary"}
              onClick={() => onToggleFavorite?.(product._id)}
              className="opacity-90 hover:opacity-100 p-2"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </motion.div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product.featured && (
              <Badge variant="destructive" className="text-xs">
                Vedette
              </Badge>
            )}
            {product.inventory.stock <= product.inventory.lowStockAlert && (
              <Badge variant="outline" className="text-xs bg-white">
                Stock limité
              </Badge>
            )}
          </div>

          {/* Bouton favori permanent */}
          <button
            onClick={() => onToggleFavorite?.(product._id)}
            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
        </div>

        <CardContent className="flex-1 flex flex-col justify-between p-4">
          <div>
            <Link href={`/products/${product._id}`}>
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-primary-500 transition-colors">
                {product.title}
              </h3>
            </Link>
            
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {product.description}
            </p>

            {/* Vendeur */}
            <Link 
              href={`/artisans/${typeof product.vendor === 'string' ? product.vendor : product.vendor._id}`}
              className="text-xs text-primary-500 hover:underline mb-2 block"
            >
              Par {typeof product.vendor === 'string' ? 'Artisan' : product.vendor.firstName + ' ' + product.vendor.lastName}
            </Link>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= product.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.shipping.freeShipping && (
                <span className="text-xs text-green-600">Livraison gratuite</span>
              )}
            </div>
            
            <Button
              size="sm"
              onClick={() => onAddToCart?.(product._id)}
              disabled={product.status !== 'active' || product.inventory.stock === 0}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;