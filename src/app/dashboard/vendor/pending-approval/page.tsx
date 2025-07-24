'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
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
import { useUIStore } from '@/store/useUIStore';
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
  const { data: session } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { addNotification } = useUIStore();

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    
    try {
      // Simuler une vérification du statut
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ici, vous feriez un appel API pour vérifier le statut réel
      const response = await fetch('/api/user/vendor-status', {
        method: 'GET',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.isApproved) {
          addNotification({
            type: 'success',
            title: '🎉 Félicitations !',
            message: 'Votre compte vendeur a été approuvé !',
            duration: 6000,
          });
          // Rediriger vers le dashboard vendeur
          window.location.href = '/dashboard/vendor';
        } else {
          addNotification({
            type: 'info',
            title: 'Statut inchangé',
            message: 'Votre demande est toujours en cours d\'examen.',
          });
        }
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de vérifier le statut pour le moment.',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleContactSupport = () => {
    addNotification({
      type: 'info',
      title: 'Contact envoyé',
      message: 'Un email a été envoyé à notre équipe support.',
    });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

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
                    <Button
                      onClick={handleContactSupport}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Mail className="w-4 h-4 mr-3" />
                      Contacter le support
                    </Button>
                    
                    <Link href="/help/vendor-approval">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-3" />
                        FAQ sur l'approbation
                      </Button>
                    </Link>
                    
                    <Link href="/marketplace">
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

          {/* Conseils pendant l'attente */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-900">
                  💡 Préparez-vous pour le succès !
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-3">📚 Ressources utiles</h4>
                    <ul className="space-y-2 text-green-700 text-sm">
                      <li>• <Link href="/help/seller-guide" className="hover:underline">Guide du vendeur</Link></li>
                      <li>• <Link href="/help/product-photos" className="hover:underline">Conseils photo produits</Link></li>
                      <li>• <Link href="/help/pricing-strategy" className="hover:underline">Stratégies de prix</Link></li>
                      <li>• <Link href="/help/shipping" className="hover:underline">Gestion des livraisons</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-3">🎯 Prochaines étapes</h4>
                    <ul className="space-y-2 text-green-700 text-sm">
                      <li>• Préparez vos premières créations</li>
                      <li>• Réfléchissez à votre stratégie de marque</li>
                      <li>• Planifiez vos méthodes de livraison</li>
                      <li>• Rejoignez notre communauté Discord</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Témoignages de vendeurs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  🌟 Ce que disent nos artisans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 italic mb-3">
                      "L'équipe de Bazario m'a accompagnée dès le début. 
                      En 3 mois, j'ai déjà vendu plus de 50 créations !"
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        M
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Marie L.</p>
                        <p className="text-gray-600 text-sm">Céramiste</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 italic mb-3">
                      "Le processus d'approbation est rapide et l'interface 
                      vendeur est très intuitive. Je recommande !"
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        P
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Pierre M.</p>
                        <p className="text-gray-600 text-sm">Ébéniste</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
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
                <div className="flex justify-center space-x-4">
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