'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const AuthErrorPage: React.FC = () => {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  const getErrorDetails = (error: string | null) => {
    switch (error) {
      case 'CredentialsSignin':
        return {
          title: 'Identifiants incorrects',
          message: 'L\'email ou le mot de passe que vous avez saisi est incorrect. Veuillez vérifier vos informations et réessayer.',
          suggestion: 'Vérifiez votre email et mot de passe'
        };
      case 'EmailCreateAccount':
        return {
          title: 'Impossible de créer le compte',
          message: 'Un compte avec cette adresse email existe peut-être déjà, ou il y a un problème avec votre adresse email.',
          suggestion: 'Essayez de vous connecter ou utilisez une autre adresse email'
        };
      case 'OAuthCreateAccount':
        return {
          title: 'Erreur de connexion sociale',
          message: 'Impossible de créer votre compte avec ce fournisseur de connexion sociale.',
          suggestion: 'Essayez de créer un compte avec votre email'
        };
      case 'EmailSignin':
        return {
          title: 'Erreur d\'envoi d\'email',
          message: 'Impossible d\'envoyer l\'email de connexion. Veuillez vérifier votre adresse email.',
          suggestion: 'Vérifiez votre adresse email et réessayez'
        };
      case 'CallbackRouteError':
        return {
          title: 'Erreur de connexion',
          message: 'Une erreur s\'est produite pendant le processus de connexion.',
          suggestion: 'Réessayez de vous connecter'
        };
      case 'OAuthCallbackError':
        return {
          title: 'Erreur de connexion sociale',
          message: 'Une erreur s\'est produite lors de la connexion avec votre compte social.',
          suggestion: 'Réessayez ou utilisez une autre méthode de connexion'
        };
      case 'SessionRequired':
        return {
          title: 'Connexion requise',
          message: 'Vous devez être connecté pour accéder à cette page.',
          suggestion: 'Connectez-vous pour continuer'
        };
      case 'AccessDenied':
        return {
          title: 'Accès refusé',
          message: 'Vous n\'avez pas les autorisations nécessaires pour accéder à cette ressource.',
          suggestion: 'Contactez l\'administrateur si vous pensez que c\'est une erreur'
        };
      case 'Verification':
        return {
          title: 'Erreur de vérification',
          message: 'Le lien de vérification a expiré ou n\'est pas valide.',
          suggestion: 'Demandez un nouveau lien de vérification'
        };
      default:
        return {
          title: 'Erreur d\'authentification',
          message: 'Une erreur inattendue s\'est produite lors de l\'authentification.',
          suggestion: 'Réessayez dans quelques instants'
        };
    }
  };

  const errorDetails = getErrorDetails(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <AlertCircle className="w-8 h-8 text-red-500" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {errorDetails.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center px-6 pb-6">
            <p className="text-gray-600 mb-2">
              {errorDetails.message}
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6">
              <p className="text-blue-700 text-sm font-medium">
                💡 {errorDetails.suggestion}
              </p>
            </div>
            
            <div className="space-y-3">
              <Button  className="w-full">
                <Link href="/auth/signin">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer la connexion
                </Link>
              </Button>
              
              <Button variant="outline"  className="w-full">
                <Link href="/auth/register">
                  Créer un nouveau compte
                </Link>
              </Button>
              
              <Button variant="ghost"  className="w-full">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
            </div>

            {/* Informations de contact */}
            <div className="mt-6 pt-4 border-t text-sm text-gray-500">
              <p>Besoin d'aide ?</p>
              <Link 
                href="/contact" 
                className="text-orange-600 hover:text-orange-500 font-medium"
              >
                Contactez notre support
              </Link>
            </div>

            {/* Détails techniques (en mode développement) */}
            {process.env.NODE_ENV === 'development' && error && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-left">
                <p className="text-xs text-gray-600 font-mono">
                  Erreur technique: {error}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthErrorPage;
