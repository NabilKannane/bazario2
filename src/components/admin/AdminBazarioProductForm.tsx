'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  X, 
  Plus, 
  Star,
  Package,
  Gift,
  Calendar,
  MapPin,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useUIStore } from '@/store/useUIStore';
import { useCategories } from '@/hooks/useCategories';

// Types spécifiques aux produits Bazario
interface BazarioProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  tags: string[];
  sku: string;
  stock: number;
  isUnlimited: boolean;
  featured: boolean;
  status: 'draft' | 'active' | 'inactive';
  type: 'coffret' | 'carte_cadeau' | 'experience' | 'service' | 'collection';
  validityPeriod?: string; // Pour les cartes cadeaux et expériences
  location?: string; // Pour les expériences
  inclusions?: string[]; // Pour les coffrets
  restrictions?: string[]; // Conditions particulières
}

// Catégories spéciales Bazario
const bazarioCategories = [
  { id: 'coffret', name: 'Coffrets Découverte', icon: Gift },
  { id: 'carte_cadeau', name: 'Cartes Cadeaux', icon: Gift },
  { id: 'experience', name: 'Expériences Artisanales', icon: Calendar },
  { id: 'service', name: 'Services Premium', icon: Star },
  { id: 'collection', name: 'Collections Spéciales', icon: Package },
];

interface AdminBazarioProductFormProps {
  productId?: string;
}

const AdminBazarioProductForm: React.FC<AdminBazarioProductFormProps> = ({ productId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newInclusion, setNewInclusion] = useState('');
  const [newRestriction, setNewRestriction] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loadingProduct, setLoadingProduct] = useState(!!productId);

  const { addNotification } = useUIStore();
  const { categories } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<BazarioProductFormData>({
    defaultValues: {
      status: 'draft',
      type: 'coffret',
      isUnlimited: false,
      featured: false,
      stock: 0,
    }
  });

  const selectedType = watch('type');
  const isUnlimited = watch('isUnlimited');

  // Charger le produit existant si productId est fourni
  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoadingProduct(true);
      const response = await fetch(`/api/admin/bazario-products/${productId}`);
      
      if (!response.ok) {
        throw new Error('Produit non trouvé');
      }

      const productData = await response.json();
      setProduct(productData);
      
      // Remplir le formulaire avec les données existantes
      reset({
        title: productData.title,
        description: productData.description,
        price: productData.price,
        category: productData.category._id || productData.category,
        sku: productData.inventory.sku,
        stock: productData.inventory.stock,
        isUnlimited: productData.inventory.isUnlimited,
        featured: productData.featured,
        status: productData.status,
        type: productData.specifications?.productType || 'coffret',
        validityPeriod: productData.specifications?.validityPeriod,
        location: productData.specifications?.location,
      });

      setImages(productData.images || []);
      setTags(productData.tags || []);
      setInclusions(productData.specifications?.inclusions || []);
      setRestrictions(productData.specifications?.restrictions || []);

    } catch (error) {
      console.error('Error loading product:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de charger le produit',
      });
      router.push('/admin/boutique');
    } finally {
      setLoadingProduct(false);
    }
  };

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

  const addInclusion = () => {
    if (newInclusion.trim() && !inclusions.includes(newInclusion.trim())) {
      setInclusions(prev => [...prev, newInclusion.trim()]);
      setNewInclusion('');
    }
  };

  const removeInclusion = (inclusionToRemove: string) => {
    setInclusions(prev => prev.filter(inclusion => inclusion !== inclusionToRemove));
  };

  const addRestriction = () => {
    if (newRestriction.trim() && !restrictions.includes(newRestriction.trim())) {
      setRestrictions(prev => [...prev, newRestriction.trim()]);
      setNewRestriction('');
    }
  };

  const removeRestriction = (restrictionToRemove: string) => {
    setRestrictions(prev => prev.filter(restriction => restriction !== restrictionToRemove));
  };

  const onSubmit = async (data: BazarioProductFormData) => {
    if (images.length === 0) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Au moins une image est requise',
      });
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        ...data,
        images,
        tags,
        inclusions,
        restrictions,
      };

      const url = productId 
        ? `/api/admin/bazario-products/${productId}` 
        : '/api/admin/bazario-products';
      
      const method = productId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }

      const savedProduct = await response.json();
      
      addNotification({
        type: 'success',
        title: productId ? 'Produit mis à jour' : 'Produit créé',
        message: productId 
          ? 'Le produit a été mis à jour avec succès' 
          : 'Le produit a été créé avec succès',
      });
      
      // Redirection après succès
      router.push('/admin/boutique');
    } catch (error: any) {
      console.error('Error saving product:', error);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Erreur lors de la sauvegarde du produit',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSKU = () => {
    const prefix = 'BAZ';
    const type = selectedType?.toUpperCase().slice(0, 3) || 'PRD';
    const timestamp = Date.now().toString().slice(-6);
    const newSku = `${prefix}-${type}-${timestamp}`;
    setValue('sku', newSku);
  };

  if (loadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Chargement du produit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <Link href="/admin/boutique">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à la boutique
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {productId ? 'Modifier le produit Bazario' : 'Nouveau produit Bazario'}
            </h1>
            <p className="text-gray-600 mt-1">
              {productId 
                ? 'Modifiez ce produit exclusif de la boutique officielle Bazario'
                : 'Créez un produit exclusif pour la boutique officielle Bazario'
              }
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={generateSKU} type="button">
              Générer SKU
            </Button>
            <Button variant="outline" type="button">
              <Eye className="w-4 h-4 mr-2" />
              Aperçu
            </Button>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Informations de base */}
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
              {/* Type de produit */}
              <div>
                <label className="text-sm font-medium leading-none mb-3 block">
                  Type de produit Bazario
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {bazarioCategories.map((category) => (
                    <motion.label
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all
                        ${selectedType === category.id 
                          ? 'border-orange-500 bg-orange-50 text-orange-700' 
                          : 'border-gray-300 hover:border-gray-400 bg-white'}
                      `}
                    >
                      <input
                        type="radio"
                        value={category.id}
                        {...register('type', { required: 'Type requis' })}
                        className="sr-only"
                      />
                      <category.icon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium text-center">{category.name}</span>
                    </motion.label>
                  ))}
                </div>
                {errors.type && (
                  <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Titre du produit"
                  {...register('title', { required: 'Le titre est requis' })}
                  error={errors.title?.message}
                  placeholder="Ex: Coffret Découverte Artisans du Maroc"
                />

                <Input
                  label="SKU"
                  {...register('sku', { required: 'Le SKU est requis' })}
                  error={errors.sku?.message}
                  placeholder="BAZ-COF-123456"
                />
              </div>

              <div>
                <label className="text-sm font-medium leading-none mb-2 block">
                  Description
                </label>
                <textarea
                  {...register('description', { required: 'La description est requise' })}
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Décrivez votre produit Bazario en détail..."
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Prix (€)"
                  type="number"
                  step="0.01"
                  {...register('price', { 
                    required: 'Le prix est requis',
                    valueAsNumber: true,
                    min: { value: 0.01, message: 'Le prix doit être positif' }
                  })}
                  error={errors.price?.message}
                />

                <div>
                  <label className="text-sm font-medium leading-none mb-2 block">
                    Catégorie
                  </label>
                  <select
                    {...register('category', { required: 'La catégorie est requise' })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                  )}
                </div>
              </div>

              {/* Champs spécifiques selon le type */}
              {(selectedType === 'carte_cadeau' || selectedType === 'experience') && (
                <Input
                  label="Période de validité"
                  {...register('validityPeriod')}
                  placeholder="Ex: 12 mois"
                />
              )}

              {selectedType === 'experience' && (
                <Input
                  label="Lieu"
                  {...register('location')}
                  placeholder="Ex: Marrakech, Maroc"
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
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
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
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
                
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors">
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
              <p className="text-sm text-gray-500">
                Ajoutez jusqu'à 10 images de haute qualité pour votre produit Bazario
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Tags et mots-clés</CardTitle>
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
        </motion.div>

        {/* Inclusions et restrictions pour les coffrets */}
        {/* {(selectedType === 'coffret' || selectedType === 'experience') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedType === 'coffret' ? 'Contenu du coffret' : 'Détails de l\'expérience'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Inclusions */}
                {/* <div>
                  <label className="text-sm font-medium leading-none mb-2 block">
                    {selectedType === 'coffret' ? 'Inclusions' : 'Ce qui est inclus'}
                  </label>
                  <div className="space-y-2 mb-4">
                    {inclusions.map((inclusion, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{inclusion}</span>
                        <button
                          type="button"
                          onClick={() => removeInclusion(inclusion)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newInclusion}
                      onChange={(e) => setNewInclusion(e.target.value)}
                      placeholder="Nouvelle inclusion"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclusion())}
                    />
                    <Button type="button" onClick={addInclusion} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Restrictions */}
                {/* <div>
                  <label className="text-sm font-medium leading-none mb-2 block">
                    Restrictions et conditions
                  </label>
                  <div className="space-y-2 mb-4">
                    {restrictions.map((restriction, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{restriction}</span>
                        <button
                          type="button"
                          onClick={() => removeRestriction(restriction)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newRestriction}
                      onChange={(e) => setNewRestriction(e.target.value)}
                      placeholder="Nouvelle restriction"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRestriction())}
                    />
                    <Button type="button" onClick={addRestriction} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )} */} 
        
        {/* Inventaire et statut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Inventaire et publication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      {...register('isUnlimited')}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <label className="text-sm font-medium">Stock illimité</label>
                  </div>
                  
                  {!isUnlimited && (
                    <Input
                      label="Quantité en stock"
                      type="number"
                      {...register('stock', { 
                        valueAsNumber: true,
                        min: { value: 0, message: 'Le stock ne peut être négatif' }
                      })}
                      error={errors.stock?.message}
                    />
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium leading-none mb-2 block">
                    Statut de publication
                  </label>
                  <select
                    {...register('status')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <label className="text-sm font-medium">Produit en vedette</label>
                <span className="text-xs text-gray-500">(Apparaîtra en première page)</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end space-x-4 pb-8"
        >
          <Link href="/admin/boutique">
            <Button variant="outline" type="button">
              Annuler
            </Button>
          </Link>
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading || images.length === 0}
            className="bg-gradient-to-r from-orange-500 to-red-500"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading 
              ? 'Sauvegarde...' 
              : (productId ? 'Mettre à jour' : 'Créer le produit')
            }
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default AdminBazarioProductForm;