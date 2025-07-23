'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Plus, X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { productSchema } from '@/lib/validations';
import { useCategories } from '@/hooks/useCategories';
import { useUIStore } from '@/store/useUIStore';
import { Product } from '@/types';
import Image from 'next/image';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  loading = false,
}) => {
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const { categories } = useCategories();
  const { addNotification } = useUIStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    // resolver: zodResolver(productSchema),
    defaultValues: product || {
      status: 'draft',
      inventory: {
        stock: 0,
        isUnlimited: false,
        lowStockAlert: 5,
      },
      shipping: {
        weight: 0,
        freeShipping: false,
        shippingCost: 0,
        processingTime: '2-3 jours',
      },
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const { url } = await response.json();
      const newImages = [...images, url];
      setImages(newImages);
      setValue('images', newImages);

      addNotification({
        type: 'success',
        title: 'Image téléchargée',
        message: 'L\'image a été téléchargée avec succès',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Erreur lors du téléchargement de l\'image',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setValue('images', newImages);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const newTags = [...tags, newTag.trim()];
      setTags(newTags);
      setValue('tags', newTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit({
        ...data,
        images,
        tags,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Erreur lors de l\'enregistrement du produit',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Titre du produit"
            {...register('title')}
            error={errors.title?.message}
            placeholder="Ex: Vase en céramique artisanal"
          />

          <div>
            <label className="text-sm font-medium leading-none mb-2 block">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Décrivez votre produit en détail..."
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Prix (€)"
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              error={errors.price?.message}
            />

            <div>
              <label className="text-sm font-medium leading-none mb-2 block">
                Catégorie
              </label>
              <select
                {...register('category')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {/* {category.parent ? `${category.parent.name} > ` : ''}{category.name} */}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Images du produit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square group"
              >
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
            
            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
              {uploadingImage ? (
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Ajouter</span>
                </>
              )}
            </label>
          </div>
          {errors.images && (
            <p className="text-sm text-red-600">{errors.images.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-red-100"
                onClick={() => removeTag(tag)}
              >
                {tag} <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nouveau tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventaire */}
      <Card>
        <CardHeader>
          <CardTitle>Inventaire</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Stock"
              type="number"
              {...register('inventory.stock', { valueAsNumber: true })}
              error={errors.inventory?.stock?.message}
            />
            
            <Input
              label="SKU (optionnel)"
              {...register('inventory.sku')}
              placeholder="Généré automatiquement si vide"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('inventory.isUnlimited')}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <label className="text-sm">Stock illimité</label>
          </div>

          <Input
            label="Alerte stock faible"
            type="number"
            {...register('inventory.lowStockAlert', { valueAsNumber: true })}
          />
        </CardContent>
      </Card>

      {/* Livraison */}
      <Card>
        <CardHeader>
          <CardTitle>Livraison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Poids (kg)"
              type="number"
              step="0.1"
              {...register('shipping.weight', { valueAsNumber: true })}
              error={errors.shipping?.weight?.message}
            />
            
            <Input
              label="Coût de livraison (€)"
              type="number"
              step="0.01"
              {...register('shipping.shippingCost', { valueAsNumber: true })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('shipping.freeShipping')}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <label className="text-sm">Livraison gratuite</label>
          </div>

          <Input
            label="Délai de traitement"
            {...register('shipping.processingTime')}
            placeholder="Ex: 2-3 jours"
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          type="submit"
          loading={loading}
          disabled={images.length === 0}
        >
          {product ? 'Mettre à jour' : 'Créer le produit'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;