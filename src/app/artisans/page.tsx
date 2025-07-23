'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MapPin, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// Mock data pour les artisans
const mockArtisans = [
  {
    _id: '1',
    firstName: 'Marie',
    lastName: 'Dubois',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b3bb',
    vendorInfo: {
      businessName: 'Atelier Céramique Marie',
      businessDescription: 'Créations uniques en céramique artisanale depuis 15 ans',
      specialties: ['Céramique', 'Poterie', 'Grès'],
      rating: 4.8,
      totalSales: 156,
    },
    profile: {
      address: {
        city: 'Lyon',
        state: 'Rhône-Alpes',
      },
    },
    productCount: 24,
    joinedYear: 2019,
  },
  {
    _id: '2',
    firstName: 'Pierre',
    lastName: 'Martin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    vendorInfo: {
      businessName: 'Menuiserie Martin',
      businessDescription: 'Mobilier en bois massif et objets décoratifs',
      specialties: ['Menuiserie', 'Ébénisterie', 'Sculpture'],
      rating: 4.9,
      totalSales: 89,
    },
    profile: {
      address: {
        city: 'Annecy',
        state: 'Haute-Savoie',
      },
    },
    productCount: 18,
    joinedYear: 2020,
  },
];

const ArtisansPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nos Artisans
          </h1>
          <p className="text-gray-600">
            Rencontrez les créateurs passionnés qui donnent vie à leurs œuvres
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockArtisans.map((artisan, index) => (
            <motion.div
              key={artisan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/artisans/${artisan._id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    {/* Photo et infos de base */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                          src={artisan.avatar}
                          alt={`${artisan.firstName} ${artisan.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {artisan.firstName} {artisan.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {artisan.vendorInfo.businessName}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {artisan.profile.address?.city}, {artisan.profile.address?.state}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {artisan.vendorInfo.businessDescription}
                    </p>

                    {/* Spécialités */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {artisan.vendorInfo.specialties.slice(0, 3).map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">{artisan.vendorInfo.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="w-4 h-4 text-orange-500 mr-1" />
                          <span>{artisan.vendorInfo.totalSales} ventes</span>
                        </div>
                      </div>
                      <div className="text-gray-500">
                        {artisan.productCount} produits
                      </div>
                    </div>

                    {/* Badge membre depuis */}
                    <div className="mt-4 pt-4 border-t">
                      <span className="text-xs text-gray-500">
                        Membre depuis {artisan.joinedYear}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Call-to-action pour devenir artisan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Vous êtes artisan ?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Rejoignez notre communauté d'artisans passionnés et partagez vos créations 
                avec des milliers d'amateurs d'art et d'artisanat.
              </p>
              <Link
                href="/auth/register?role=vendor"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors"
              >
                Rejoindre la communauté
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ArtisansPage;