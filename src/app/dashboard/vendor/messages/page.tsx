// src/app/dashboard/vendor/messages/page.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Send, 
  Paperclip, 
  MoreVertical,
  Star,
  Archive,
  Trash2,
  Clock,
  CheckCheck,
  Circle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

// Mock data pour les conversations
const mockConversations = [
  {
    id: '1',
    customer: {
      name: 'Marie Dupont',
      avatar: 'MD',
      email: 'marie.dupont@email.com',
    },
    lastMessage: {
      content: 'Bonjour, je suis intéressée par votre vase en céramique. Pouvez-vous me dire s\'il est disponible en bleu ?',
      timestamp: '2024-01-20T14:30:00Z',
      isFromCustomer: true,
    },
    unreadCount: 2,
    status: 'active',
    product: {
      name: 'Vase en céramique artisanal',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    },
  },
  {
    id: '2',
    customer: {
      name: 'Pierre Martin',
      avatar: 'PM',
      email: 'pierre.martin@email.com',
    },
    lastMessage: {
      content: 'Parfait, merci pour ces informations ! Je vais passer commande.',
      timestamp: '2024-01-20T10:15:00Z',
      isFromCustomer: true,
    },
    unreadCount: 0,
    status: 'active',
    product: {
      name: 'Bol en grès émaillé',
      image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2',
    },
  },
  {
    id: '3',
    customer: {
      name: 'Sophie Laurent',
      avatar: 'SL',
      email: 'sophie.laurent@email.com',
    },
    lastMessage: {
      content: 'Les mugs sont-ils disponibles pour une livraison avant le 25 ?',
      timestamp: '2024-01-19T16:45:00Z',
      isFromCustomer: true,
    },
    unreadCount: 1,
    status: 'pending',
    product: {
      name: 'Set de mugs personnalisés',
      image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2',
    },
  },
];

// Mock data pour les messages d'une conversation
const mockMessages = [
  {
    id: '1',
    content: 'Bonjour ! Je suis intéressée par votre magnifique vase en céramique que j\'ai vu sur votre boutique.',
    timestamp: '2024-01-20T13:00:00Z',
    isFromCustomer: true,
    status: 'read',
  },
  {
    id: '2',
    content: 'Bonjour Marie ! Merci pour votre intérêt. Ce vase est effectivement disponible. Avez-vous des questions spécifiques ?',
    timestamp: '2024-01-20T13:15:00Z',
    isFromCustomer: false,
    status: 'read',
  },
  {
    id: '3',
    content: 'Oui, j\'aimerais savoir s\'il est possible de l\'avoir dans une teinte plus bleue ? Et quels sont les délais de livraison ?',
    timestamp: '2024-01-20T13:30:00Z',
    isFromCustomer: true,
    status: 'read',
  },
  {
    id: '4',
    content: 'Absolument ! Je peux réaliser ce vase avec un émail bleu cobalt qui est magnifique. Le délai serait d\'environ 2 semaines car je le façonne spécialement pour vous.',
    timestamp: '2024-01-20T14:00:00Z',
    isFromCustomer: false,
    status: 'read',
  },
  {
    id: '5',
    content: 'Parfait ! Pouvez-vous me dire le prix pour cette version personnalisée ?',
    timestamp: '2024-01-20T14:30:00Z',
    isFromCustomer: true,
    status: 'delivered',
  },
];

const VendorMessagesPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newMessage, setNewMessage] = useState('');

  const filteredConversations = mockConversations.filter(conv => {
    const matchesSearch = 
      conv.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'unread' && conv.unreadCount > 0) ||
      (statusFilter === 'read' && conv.unreadCount === 0);
    
    return matchesSearch && matchesStatus;
  });

  const selectedConv = mockConversations.find(conv => conv.id === selectedConversation);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Ici on enverrait le message à l'API
      console.log('Envoi du message:', newMessage);
      setNewMessage('');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Circle className="w-3 h-3 text-gray-400" />;
      case 'delivered': return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read': return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">
              Communiquez avec vos clients
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Button variant="outline">
              <Archive className="w-4 h-4 mr-2" />
              Archiver
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
        {/* Liste des conversations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Badge className="bg-orange-100 text-orange-800">
                  {mockConversations.reduce((acc, conv) => acc + conv.unreadCount, 0)} non lus
                </Badge>
              </div>
              
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher une conversation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtres */}
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'Tous' },
                  { key: 'unread', label: 'Non lus' },
                  { key: 'read', label: 'Lus' },
                ].map((filter) => (
                  <Button
                    key={filter.key}
                    // variant={statusFilter === filter.key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(filter.key)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="space-y-1">
                {filteredConversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-4 cursor-pointer border-l-4 transition-colors hover:bg-gray-50",
                      selectedConversation === conversation.id
                        ? "bg-orange-50 border-l-orange-500"
                        : "border-l-transparent"
                    )}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                        {conversation.customer.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {conversation.customer.name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                          </div>
                        </div>

                        <p className={cn(
                          "text-sm truncate mb-2",
                          conversation.unreadCount > 0 ? "font-medium text-gray-900" : "text-gray-600"
                        )}>
                          {conversation.lastMessage.content}
                        </p>

                        {/* Produit concerné */}
                        <div className="flex items-center text-xs text-gray-500">
                          <div className="w-4 h-4 rounded overflow-hidden mr-2">
                            <img
                              src={conversation.product.image}
                              alt={conversation.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="truncate">{conversation.product.name}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Zone de conversation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          {selectedConv ? (
            <Card className="h-full flex flex-col">
              {/* Header de la conversation */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                      {selectedConv.customer.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedConv.customer.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedConv.customer.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Produit concerné */}
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded-lg overflow-hidden mr-3">
                    <img
                      src={selectedConv.product.image}
                      alt={selectedConv.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {selectedConv.product.name}
                    </p>
                    <p className="text-xs text-gray-600">Produit concerné</p>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {mockMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex",
                        message.isFromCustomer ? "justify-start" : "justify-end"
                      )}
                    >
                      <div className={cn(
                        "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                        message.isFromCustomer
                          ? "bg-gray-100 text-gray-900"
                          : "bg-orange-500 text-white"
                      )}>
                        <p className="text-sm">{message.content}</p>
                        <div className={cn(
                          "flex items-center justify-end mt-2 space-x-1",
                          message.isFromCustomer ? "text-gray-500" : "text-orange-100"
                        )}>
                          <span className="text-xs">
                            {formatTime(message.timestamp)}
                          </span>
                          {!message.isFromCustomer && getStatusIcon(message.status)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>

              {/* Zone de saisie */}
              <div className="border-t p-4">
                <div className="flex items-end space-x-3">
                  <Button variant="ghost" size="sm" className="mb-2">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Tapez votre message..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={3}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                  </div>
                  <Button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="mb-2"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
                </p>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Sélectionnez une conversation</p>
                <p className="text-sm">Choisissez une conversation pour commencer à échanger</p>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VendorMessagesPage;

