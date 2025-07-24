'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Mail, 
  Phone, 
  User, 
  Store, 
  FileText,
  LogOut,
  RefreshCw,
  MessageSquare,
  Calendar,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

// Timeline des étapes d'approbation
const approvalSteps = [
  {
    id: 'submitted',
    title: 'Demande soumise',
    description: 'Votre demande a été reçue avec succès',
    icon: FileText,
    status: 'completed',
  },
  {
    id: 'review',
    title: 'En cours d\'examen',
    description: 'Notre équipe vérifie vos informations',
    icon: Clock,
    status: 'current',
  },
  {
    id: 'verification',
    title: 'Vérification des documents',
    description: 'Validation de votre identité et activité',
    icon: CheckCircle,
    status: 'pending',
  },
  {
    id: 'approved',
    title: 'Approbation finale',
    description: 'Activation de votre compte vendeur',
    icon: Award,
    status: 'pending',
  },
];

const PendingApprovalPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Debug: Afficher les informations de session
  useEffect(() => {
    console.log('🔍 PendingApproval - Session status:', status);
    console.log('🔍 PendingApproval - Session data:', session);
    
    if (status !== 'loading') {
      setPageLoaded(true);
    }

    // Vérifier si l'utilisateur est déjà approuvé
    if (session?.user?.vendorInfo?.isApproved) {
      console.log('✅ Vendor is approved, redirecting to dashboard');
      router.push('/dashboard/vendor');
    }
  }, [session, status, router]);

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    
    try {
      // Simuler une vérification du statut
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Recharger la session
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors du refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  // Afficher un loader pendant le chargement de la session
  if (status === 'loading' || !pageLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre statut...</p>
        </div>
      </div>
    );
  }

  // Vérifier si l'utilisateur est connecté
  if (status === 'unauthenticated' || !session) {
    router.push('/auth/signin');
    return null;
  }

  // Vérifier si l'utilisateur est un vendeur
  if (session.user.role !== 'vendor') {
    router.push('/dashboard/buyer');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Demande en cours d'examen
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Bonjour {session?.user?.name?.split(' ')[0]} ! 👋
            </p>
            <p className="text-gray-600">
              Votre demande pour devenir vendeur sur Bazario est actuellement examinée par notre équipe.
            </p>
          </motion.div>

          {/* Informations de debug (en mode développement) */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-yellow-800">Debug Info (Dev Mode)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-yellow-700 space-y-2">
                    <p><strong>User Role:</strong> {session.user.role}</p>
                    <p><strong>Is Verified:</strong> {session.user.isVerified ? 'Yes' : 'No'}</p>
                    <p><strong>Vendor Info:</strong> {JSON.stringify(session.user.vendorInfo || 'null')}</p>
                    <p><strong>Is Approved:</strong> {session.user.vendorInfo?.isApproved ? 'Yes' : 'No'}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Statut actuel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">
                        Statut : En cours d'examen
                      </h3>
                      <p className="text-blue-700">
                        Temps d'attente moyen : 2-3 jours ouvrables
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleRefreshStatus}
                    variant="outline"
                    loading={isRefreshing}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualiser
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Timeline du processus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Processus d'approbation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {approvalSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={step.id} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center
                            ${step.status === 'completed' ? 'bg-green-500' :
                              step.status === 'current' ? 'bg-orange-500' :
                              'bg-gray-300'}
                          `}>
                            <StepIcon className={`w-5 h-5 ${
                              step.status === 'pending' ? 'text-gray-600' : 'text-white'
                            }`} />
                          </div>
                          {index < approvalSteps.length - 1 && (
                            <div className={`w-0.5 h-12 mt-2 ${
                              step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center space-x-3 mb-1">
                            <h4 className="font-semibold text-gray-900">{step.title}</h4>
                            <Badge className={
                              step.status === 'completed' ? 'bg-green-100 text-green-800' :
                              step.status === 'current' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {step.status === 'completed' ? 'Terminé' :
                               step.status === 'current' ? 'En cours' :
                               'En attente'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Informations soumises */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informations soumises
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Nom complet</span>
                    <span className="font-medium">{session?.user?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium">{session?.user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Type de compte</span>
                    <Badge className="bg-orange-100 text-orange-800">
                      Vendeur
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Date de demande</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions possibles */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    En attendant l'approbation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Link href="/contact?subject=vendor-approval">
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="w-4 h-4 mr-3" />
                        Contacter le support
                      </Button>
                    </Link>
                    
                    <Link href="/help/vendor-approval">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-3" />
                        FAQ sur l'approbation
                      </Button>
                    </Link>
                    
                    <Link href="/products">
                      <Button variant="outline" className="w-full justify-start">
                        <Store className="w-4 h-4 mr-3" />
                        Explorer la marketplace
                      </Button>
                    </Link>
                    
                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      className="w-full justify-start text-gray-600"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Se déconnecter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Actions temporaires pour les tests en développement */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-yellow-800">Actions de test (Dev Mode)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        // Simuler l'approbation pour les tests
                        alert('En production, ceci serait géré par l\'admin.');
                      }}
                      className="w-full bg-green-500 hover:bg-green-600"
                    >
                      🧪 Simuler l'approbation (Dev)
                    </Button>
                    <p className="text-xs text-yellow-700">
                      Cette option n'est disponible qu'en mode développement pour les tests.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Footer avec contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Card className="bg-gray-900 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Une question ? Nous sommes là pour vous aider !
                </h3>
                <p className="text-gray-300 mb-4">
                  Notre équipe support est disponible du lundi au vendredi, 9h-18h
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                    <Mail className="w-4 h-4 mr-2" />
                    support@bazario.fr
                  </Button>
                  <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                    <Phone className="w-4 h-4 mr-2" />
                    01 23 45 67 89
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalPage;