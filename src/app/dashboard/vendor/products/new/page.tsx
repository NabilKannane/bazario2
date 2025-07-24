'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import ProductForm from '@/components/forms/ProductForm';
import { useUIStore } from '@/store/useUIStore';
import Link from 'next/link';
import { ProductFormData } from '@/lib/validations';

const CreateProductPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const router = useRouter();
  const { addNotification } = useUIStore();

  const handleSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du produit');
      }

      const newProduct = await response.json();

      addNotification({
        type: 'success',
        title: 'Produit créé !',
        message: 'Votre produit a été créé avec succès.',
      });

      // Rediriger vers la liste des produits ou vers la page d'édition
      router.push(`/dashboard/vendor/products/${newProduct._id}/edit?created=true`);

    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Une erreur est survenue lors de la création du produit',
      });
    } finally {
      setIsLoading(false);
    }
  };

//   const handleSaveDraft = async (data: ProductFormData) => {
//     const draftData = { ...data, status: 'draft' };
//     await handleSubmit(draftData);
//   };

//   const handlePublish = async (data: ProductFormData) => {
//     const publishData = { ...data, status: 'active' };
//     await handleSubmit(publishData);
//   };

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
              <Link href="/dashboard/vendor/products">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux produits
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Créer un nouveau produit
            </h1>
            <p className="text-gray-600 mt-1">
              Ajoutez une nouvelle création à votre catalogue
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              disabled={isLoading}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Modifier' : 'Aperçu'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Conseils pour les nouveaux vendeurs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">💡</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Conseils pour créer un produit attractif
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Utilisez des photos de haute qualité avec un bon éclairage</li>
                  <li>• Rédigez une description détaillée qui raconte l'histoire de votre création</li>
                  <li>• Ajoutez des mots-clés pertinents pour améliorer la visibilité</li>
                  <li>• Indiquez clairement les dimensions et matériaux utilisés</li>
                  <li>• Fixez un prix juste en tenant compte du temps et des matériaux</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mode prévisualisation */}
      {previewMode ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Aperçu du produit</CardTitle>
              <p className="text-sm text-gray-600">
                Voici comment votre produit apparaîtra aux clients
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-4" />
                <p>L'aperçu sera affiché ici une fois le formulaire rempli</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        /* Formulaire de création */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProductForm
            onSubmit={handleSubmit}
            loading={isLoading}
          />

          {/* Actions personnalisées pour la création */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-600">
                  <p className="mb-1">💾 <strong>Brouillon :</strong> Sauvegarde sans publier</p>
                  <p>🚀 <strong>Publier :</strong> Rend le produit visible aux clients</p>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Cette fonction sera appelée depuis le ProductForm
                      // avec les données du formulaire
                    }}
                    disabled={isLoading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder en brouillon
                  </Button>
                  
                  <Button
                    onClick={() => {
                      // Cette fonction sera appelée depuis le ProductForm
                      // avec les données du formulaire
                    }}
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    🚀 Publier le produit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Aide et support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">
                Besoin d'aide ?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Notre équipe est là pour vous accompagner dans la création de vos produits
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/help/create-product">
                  <Button variant="outline" size="sm">
                    📚 Guide de création
                  </Button>
                </Link>
                <Link href="/contact?subject=aide-produit">
                  <Button variant="outline" size="sm">
                    💬 Contacter le support
                  </Button>
                </Link>
                <Link href="/dashboard/vendor/examples">
                  <Button variant="outline" size="sm">
                    ✨ Voir des exemples
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateProductPage;