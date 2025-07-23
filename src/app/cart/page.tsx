'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, itemCount, totalPrice, shippingCost, clearCart } = useCart();

  const tax = totalPrice * 0.2;
  const finalTotal = totalPrice + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Votre panier est vide
          </h1>
          <p className="text-gray-600 mb-8">
            Découvrez nos créations artisanales uniques
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
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mon Panier
          </h1>
          <p className="text-gray-600">
            {itemCount} article{itemCount > 1 ? 's' : ''} dans votre panier
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles du panier */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.product._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-4 pb-6 border-b last:border-b-0"
                    >
                      {/* Image produit */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0] || '/placeholder-product.jpg'}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Infos produit */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product._id}`}
                          className="text-lg font-medium text-gray-900 hover:text-orange-500 transition-colors"
                        >
                          {item.product.title}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          Par {typeof item.product.vendor === 'string' 
                            ? 'Artisan' 
                            : `${item.product.vendor.firstName} ${item.product.vendor.lastName}`}
                        </p>
                        <p className="text-lg font-bold text-gray-900 mt-2">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      {/* Contrôles quantité */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Supprimer */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.product._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* Actions panier */}
                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="text-red-500 border-red-200 hover:bg-red-50"
                  >
                    Vider le panier
                  </Button>
                  <Link href="/products">
                    <Button variant="outline">
                      Continuer mes achats
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résumé commande */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Résumé de la commande
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total ({itemCount} articles)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Livraison</span>
                    <span>
                      {shippingCost === 0 ? 'Gratuite' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>TVA (20%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout" className="block mt-6">
                  <Button className="w-full" size="lg">
                    Passer la commande
                  </Button>
                </Link>

                {/* Avantages */}
                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Livraison sécurisée
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Retour gratuit sous 30 jours
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Support client 7j/7
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
