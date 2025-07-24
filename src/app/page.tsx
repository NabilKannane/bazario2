'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import ProductGrid from '@/components/product/ProductGrid';
import { Product } from '@/types';

// Mock data pour la démo
const featuredProducts = [
  {
    _id: '1',
    title: 'Vase en céramique artisanal',
    description: 'Magnifique vase fait main par un céramiste passionné',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    category: 'ceramique',
    vendor: {
      _id: 'vendor1',
      firstName: 'Marie',
      lastName: 'Dubois',
      email: 'marie.dubois@example.com',
      role: "vendor" as "vendor",
      isVerified: true,
      profile: {
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        bio: 'Artisan céramiste passionnée',
        location: 'Paris, France'
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    tags: ['céramique', 'décoration', 'fait-main'],
    specifications: {},
    inventory: { stock: 5, sku: 'VAR001', isUnlimited: false, lowStockAlert: 2 },
    shipping: { weight: 0.8, dimensions: { length: 20, width: 20, height: 25 }, freeShipping: true, shippingCost: 0, processingTime: '2-3 jours' },
    status: 'active' as const,
    featured: true,
    views: 234,
    rating: 4.8,
    reviewCount: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const HomePage: React.FC = () => {
  const handleAddToCart = (productId: string) => {
    console.log('Ajouter au panier:', productId);
  };

  const handleToggleFavorite = (productId: string) => {
    console.log('Toggle favori:', productId);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-200 to-gray-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-14">
              BAZARIO
            </h1>
            <p className="text-xl md:text-2xl mb-16 text-primary-100">
              La ou tradition et digital se rencontre
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Explorer les produits
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="hover:bg-white hover:text-primary-500">
                Devenir artisan
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

{/* Carousel Slogan Section */}

      {/* Valeurs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Bazario ?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: 'Qualité Premium',
                description: 'Chaque produit est soigneusement sélectionné et certifié par nos experts.',
              },
              {
                icon: Shield,
                title: 'Achat Sécurisé',
                description: 'Paiements protégés et garantie satisfait ou remboursé.',
              },
              {
                icon: Truck,
                title: 'Livraison Rapide',
                description: 'Expédition sous 24h et livraison gratuite dès 50€.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="text-center p-6 h-full">
                  <CardContent>
                    <feature.icon className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Produits en vedette */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Produits en Vedette
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection de créations exceptionnelles, 
              choisies pour leur originalité et leur qualité artisanale.
            </p>
          </motion.div>

          <ProductGrid 
            products={featuredProducts}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
          />

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg">
                Voir tous les produits
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;