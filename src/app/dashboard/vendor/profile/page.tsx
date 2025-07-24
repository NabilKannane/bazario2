// src/app/dashboard/vendor/profile/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  MapPin, 
  Globe, 
  Instagram, 
  Facebook, 
  Twitter,
  Star,
  Award,
  Clock,
  Package,
  Edit,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';

// Schéma de validation pour le profil
const profileSchema = z.object({
  businessName: z.string().min(2, 'Le nom de l\'atelier doit contenir au moins 2 caractères'),
  businessDescription: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  specialties: z.array(z.string()).min(1, 'Au moins une spécialité est requise'),
  bio: z.string().optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  socialLinks: z.object({
    website: z.string().url().optional().or(z.literal('')),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
  }).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Mock data pour le profil
const mockProfile = {
  id: '1',
  firstName: 'Marie',
  lastName: 'Dubois',
  email: 'marie.dubois@email.com',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b3bb',
  businessName: 'Atelier Céramique Marie',
  businessDescription: 'Passionnée par l\'art de la céramique depuis plus de 15 ans, je crée des pièces uniques inspirées de la nature et des formes organiques. Chaque création est façonnée à la main avec amour et attention.',
  specialties: ['Céramique', 'Poterie', 'Grès', 'Émaillage'],
  bio: 'Artisan céramiste diplômée des Beaux-Arts de Lyon, j\'ai développé ma propre technique d\'émaillage qui donne à mes pièces leur caractère unique.',
  phone: '+33 6 12 34 56 78',
  address: {
    street: '123 rue des Artisans',
    city: 'Lyon',
    postalCode: '69001',
    country: 'France',
  },
  socialLinks: {
    website: 'https://atelier-marie-ceramique.fr',
    instagram: '@marie_ceramique',
    facebook: 'AtelierMarieCeramique',
    twitter: '',
  },
  stats: {
    rating: 4.8,
    totalSales: 156,
    totalProducts: 24,
    memberSince: '2019',
    reviewCount: 89,
  },
  gallery: [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2',
  ],
};

const VendorProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [profile, setProfile] = useState(mockProfile);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      businessName: profile.businessName,
      businessDescription: profile.businessDescription,
      specialties: profile.specialties,
      bio: profile.bio,
      phone: profile.phone,
      address: profile.address,
      socialLinks: profile.socialLinks,
    },
  });

  const specialties = watch('specialties') || [];

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Ici on enverrait les données à l'API
      console.log('Données du profil:', data);
      
      // Mise à jour du profil local (mock)
      setProfile(prev => ({
        ...prev,
        ...data,
        address: {
          ...prev.address,
          ...data.address,
        },
        socialLinks: {
          ...prev.socialLinks,
          ...data.socialLinks,
        },
      }));
      
      setIsEditing(false);
      
      // Notification de succès
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du profil');
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      const updatedSpecialties = [...specialties, newSpecialty.trim()];
      setValue('specialties', updatedSpecialties);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialtyToRemove: string) => {
    const updatedSpecialties = specialties.filter(s => s !== specialtyToRemove);
    setValue('specialties', updatedSpecialties);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Atelier</h1>
            <p className="text-gray-600 mt-1">
              Gérez votre profil public et vos informations artisan
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Modifier le profil
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
                <Button onClick={handleSubmit(onSubmit)}>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-8">
          {/* Informations générales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Photo de profil */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                      <Image
                        src={profile.avatar}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 p-1.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
                        <Camera className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <p className="text-gray-600">{profile.email}</p>
                  </div>
                </div>

                {/* Nom de l'atelier */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'atelier
                  </label>
                  {isEditing ? (
                    <Input
                      {...register('businessName')}
                      error={errors.businessName?.message}
                      placeholder="Nom de votre atelier"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.businessName}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description de l'atelier
                  </label>
                  {isEditing ? (
                    <textarea
                      {...register('businessDescription')}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Décrivez votre atelier, votre passion, votre savoir-faire..."
                    />
                  ) : (
                    <p className="text-gray-700">{profile.businessDescription}</p>
                  )}
                  {errors.businessDescription && (
                    <p className="text-red-600 text-sm mt-1">{errors.businessDescription.message}</p>
                  )}
                </div>

                {/* Bio personnelle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio personnelle
                  </label>
                  {isEditing ? (
                    <textarea
                      {...register('bio')}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Parlez de votre parcours, votre formation..."
                    />
                  ) : (
                    <p className="text-gray-700">{profile.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Spécialités */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Spécialités</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="secondary"
                      className={`${isEditing ? 'cursor-pointer hover:bg-red-100' : ''}`}
                      onClick={isEditing ? () => removeSpecialty(specialty) : undefined}
                    >
                      {specialty}
                      {isEditing && <X className="w-3 h-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      placeholder="Nouvelle spécialité"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                    />
                    <Button type="button" onClick={addSpecialty} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                {errors.specialties && (
                  <p className="text-red-600 text-sm mt-2">{errors.specialties.message}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact et adresse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Contact et adresse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  {isEditing ? (
                    <Input
                      {...register('phone')}
                      placeholder="+33 6 12 34 56 78"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone || 'Non renseigné'}</p>
                  )}
                </div>

                {/* Adresse */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rue
                    </label>
                    {isEditing ? (
                      <Input
                        {...register('address.street')}
                        placeholder="123 rue des Artisans"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.address?.street || 'Non renseigné'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    {isEditing ? (
                      <Input
                        {...register('address.city')}
                        placeholder="Lyon"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.address?.city || 'Non renseigné'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code postal
                    </label>
                    {isEditing ? (
                      <Input
                        {...register('address.postalCode')}
                        placeholder="69001"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.address?.postalCode || 'Non renseigné'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pays
                    </label>
                    {isEditing ? (
                      <Input
                        {...register('address.country')}
                        placeholder="France"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.address?.country || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Réseaux sociaux */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Réseaux sociaux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Site web */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Globe className="w-4 h-4 mr-2" />
                      Site web
                    </label>
                    {isEditing ? (
                      <Input
                        {...register('socialLinks.website')}
                        placeholder="https://mon-atelier.fr"
                      />
                    ) : (
                      profile.socialLinks?.website ? (
                        <a 
                          href={profile.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:text-orange-500"
                        >
                          {profile.socialLinks.website}
                        </a>
                      ) : (
                        <p className="text-gray-500">Non renseigné</p>
                      )
                    )}
                    {errors.socialLinks?.website && (
                      <p className="text-red-600 text-sm mt-1">{errors.socialLinks.website.message}</p>
                    )}
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                    </label>
                    {isEditing ? (
                      <Input
                        {...register('socialLinks.instagram')}
                        placeholder="@mon_atelier"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.socialLinks?.instagram || 'Non renseigné'}</p>
                    )}
                  </div>

                  {/* Facebook */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                    </label>
                    {isEditing ? (
                      <Input
                        {...register('socialLinks.facebook')}
                        placeholder="MonAtelier"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.socialLinks?.facebook || 'Non renseigné'}</p>
                    )}
                  </div>

                  {/* Twitter */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </label>
                    {isEditing ? (
                      <Input
                        {...register('socialLinks.twitter')}
                        placeholder="@mon_atelier"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.socialLinks?.twitter || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar droite */}
        <div className="space-y-6">
          {/* Statistiques */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="text-sm text-gray-600">Note moyenne</span>
                  </div>
                  <span className="font-semibold">{profile.stats.rating}/5</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Ventes totales</span>
                  </div>
                  <span className="font-semibold">{profile.stats.totalSales}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Produits</span>
                  </div>
                  <span className="font-semibold">{profile.stats.totalProducts}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-purple-500 mr-2" />
                    <span className="text-sm text-gray-600">Membre depuis</span>
                  </div>
                  <span className="font-semibold">{profile.stats.memberSince}</span>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{profile.stats.reviewCount}</p>
                    <p className="text-sm text-gray-600">avis clients</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Galerie d'images */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Galerie de l'atelier</CardTitle>
                  {isEditing && (
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {profile.gallery.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                      <Image
                        src={image}
                        alt={`Galerie ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {isEditing && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Montrez votre atelier, vos créations en cours, votre environnement de travail
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Aperçu public */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-orange-900 mb-2">
                  Aperçu public
                </h3>
                <p className="text-sm text-orange-800 mb-4">
                  Voir comment votre profil apparaît aux clients
                </p>
                <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                  Voir ma boutique
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfilePage;