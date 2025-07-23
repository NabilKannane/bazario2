'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const forgotPasswordSchema = z.object({
  email: z.string().email('Adresse email invalide'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const result = await response.json();
        setError(result.error || 'Une erreur est survenue');
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
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
                Email envoyé !
              </h2>
              
              <p className="text-gray-600 mb-6">
                Nous avons envoyé un lien de réinitialisation à{' '}
                <span className="font-medium text-gray-900">
                  {getValues('email')}
                </span>
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 text-left">
                <h3 className="font-medium text-blue-900 mb-2">Étapes suivantes :</h3>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Vérifiez votre boîte de réception</li>
                  <li>2. Cliquez sur le lien dans l'email</li>
                  <li>3. Créez votre nouveau mot de passe</li>
                </ol>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                Vous ne voyez pas l'email ? Vérifiez vos spams ou{' '}
                <button
                  onClick={() => setSuccess(false)}
                  className="text-orange-600 hover:text-orange-500 font-medium"
                >
                  réessayez
                </button>
              </p>
              
              <Link href="/auth/signin">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à la connexion
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4">
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
              className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="w-8 h-8 text-orange-500" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Mot de passe oublié ?
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Saisissez votre email pour recevoir un lien de réinitialisation
            </p>
          </CardHeader>
          
          <CardContent className="p-6">
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
              <Input
                label="Adresse email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="votre@email.com"
                disabled={isLoading}
              />

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <Link
                href="/auth/signin"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Retour à la connexion
              </Link>
              
              <div className="text-sm text-gray-500">
                Pas encore de compte ?{' '}
                <Link
                  href="/auth/register"
                  className="font-medium text-orange-600 hover:text-orange-500"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;