'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle, UserCheck, Store } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/validations';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'buyer',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la création du compte');
      }

      setSuccess(true);
      
      // Redirection vers la page de connexion après 2 secondes
      setTimeout(() => {
        router.push('/auth/signin?message=account-created');
      }, 2000);

    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Page de succès
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="shadow-xl">
            <CardContent className="text-center py-12 px-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-green-500" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Compte créé avec succès !
              </h2>
              
              <p className="text-gray-600 mb-6">
                Bienvenue sur Bazario ! Votre compte a été créé avec succès. 
                Vous allez être redirigé vers la page de connexion.
              </p>
              
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin h-6 w-6 text-orange-500" />
                <span className="ml-2 text-sm text-gray-500">Redirection...</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="shadow-xl bg-white ">
          <CardHeader className="text-center rounded-t-lg">
            <Link href="/" className="text-3xl font-bold text-orange-500 mb-4 block">
              Bazario
            </Link>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Créer un compte
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Rejoignez notre communauté d'artisans et d'amateurs d'art
            </p>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Message d'erreur */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-center"
              >
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Sélection du rôle */}
              <div>
                <label className="text-sm font-medium leading-none mb-3 block">
                  Je souhaite
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${selectedRole === 'buyer' 
                        ? 'border-orange-500 bg-orange-50 text-orange-700' 
                        : 'border-gray-300 hover:border-gray-400 bg-white'}
                    `}
                  >
                    <input
                      type="radio"
                      value="buyer"
                      {...register('role')}
                      className="sr-only"
                    />
                    <UserCheck className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Acheter</span>
                    <span className="text-xs text-gray-500 mt-1">Découvrir et acheter</span>
                  </motion.label>
                  
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${selectedRole === 'vendor' 
                        ? 'border-orange-500 bg-orange-50 text-orange-700' 
                        : 'border-gray-300 hover:border-gray-400 bg-white'}
                    `}
                  >
                    <input
                      type="radio"
                      value="vendor"
                      {...register('role')}
                      className="sr-only"
                    />
                    <Store className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Vendre</span>
                    <span className="text-xs text-gray-500 mt-1">Créer et vendre</span>
                  </motion.label>
                </div>
              </div>

              {/* Informations personnelles */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  placeholder="Jean"
                  disabled={isLoading}
                />
                <Input
                  label="Nom"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  placeholder="Dupont"
                  disabled={isLoading}
                />
              </div>

              <Input
                label="Adresse email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="jean@dupont.com"
                disabled={isLoading}
              />

              <div className="relative">
                <Input
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  error={errors.password?.message}
                  placeholder="Au moins 6 caractères"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirmer le mot de passe"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                  placeholder="Répétez votre mot de passe"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Conditions d'utilisation */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 mt-1"
                />
                <label className="ml-2 text-sm text-gray-600">
                  J'accepte les{' '}
                  <Link href="/terms" className="text-orange-600 hover:text-orange-500 font-medium">
                    conditions d'utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link href="/privacy" className="text-orange-600 hover:text-orange-500 font-medium">
                    politique de confidentialité
                  </Link>
                </label>
              </div>

              {/* Newsletter */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <label className="ml-2 text-sm text-gray-600">
                  Je souhaite recevoir les actualités et offres spéciales par email
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? 'Création du compte...' : 'Créer mon compte'}
              </Button>
            </form>

            {/* Avantages selon le rôle */}
            {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                {selectedRole === 'vendor' ? 'Avantages vendeur :' : 'Avantages acheteur :'}
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {selectedRole === 'vendor' ? (
                  <>
                    <li>• Créez votre boutique personnalisée</li>
                    <li>• Gestion simplifiée des commandes</li>
                    <li>• Statistiques de vente détaillées</li>
                    <li>• Support dédié aux artisans</li>
                  </>
                ) : (
                  <>
                    <li>• Accès à des créations uniques</li>
                    <li>• Favoris et recommandations</li>
                    <li>• Support client réactif</li>
                    <li>• Livraison sécurisée</li>
                  </>
                )}
              </ul>
            </div> */}

            {/* Lien vers connexion */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link
                  href="/auth/signin"
                  className="font-medium text-orange-600 hover:text-orange-500"
                >
                  Se connecter
                </Link>
              </p>
            </div>

            {/* Lien retour */}
            <div className="mt-4 text-center">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;