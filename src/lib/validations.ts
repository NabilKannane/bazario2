import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
  role: z.enum(['buyer', 'vendor']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// Schéma pour les produits
export const productSchema = z.object({
  title: z.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(2000, 'La description ne peut pas dépasser 2000 caractères'),
  
  price: z.number()
    .positive('Le prix doit être positif')
    .min(0.01, 'Le prix minimum est de 0.01€'),
  
  category: z.string()
    .min(1, 'Veuillez sélectionner une catégorie'),
  
  images: z.array(z.string().url('URL d\'image invalide'))
    .min(1, 'Au moins une image est requise')
    .max(10, 'Maximum 10 images autorisées'),
  
  tags: z.array(z.string())
    .optional()
    .default([]),
  
//   specifications: z.record(z.any())
//     .optional()
//     .default({}),
  
  inventory: z.object({
    stock: z.number()
      .int('Le stock doit être un nombre entier')
      .min(0, 'Le stock ne peut pas être négatif'),
    
    sku: z.string()
      .optional(),
    
    isUnlimited: z.boolean()
      .optional()
      .default(false),
    
    lowStockAlert: z.number()
      .int('L\'alerte stock doit être un nombre entier')
      .min(0, 'L\'alerte stock ne peut pas être négative')
      .optional()
      .default(5),
  }),
  
  shipping: z.object({
    weight: z.number()
      .positive('Le poids doit être positif'),
    
    dimensions: z.object({
      length: z.number().positive('La longueur doit être positive'),
      width: z.number().positive('La largeur doit être positive'),
      height: z.number().positive('La hauteur doit être positive'),
    }).optional(),
    
    freeShipping: z.boolean()
      .optional()
      .default(false),
    
    shippingCost: z.number()
      .min(0, 'Le coût de livraison ne peut pas être négatif')
      .optional()
      .default(0),
    
    processingTime: z.string()
      .optional()
      .default('2-3 jours'),
  }),
  
  status: z.enum(['draft', 'active', 'inactive', 'sold_out'])
    .optional()
    .default('draft'),
  
  featured: z.boolean()
    .optional()
    .default(false),
});

// Type TypeScript dérivé du schéma
export type ProductFormData = z.infer<typeof productSchema>;

export const addressSchema = z.object({
  street: z.string().min(5, 'Adresse invalide'),
  city: z.string().min(2, 'Ville invalide'),
  state: z.string().min(2, 'État/Région invalide'),
  postalCode: z.string().min(4, 'Code postal invalide'),
  country: z.string().min(2, 'Pays invalide'),
});

export const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1, 'ID produit requis'),
    quantity: z.number().int().positive('La quantité doit être positive'),
  })).min(1, 'Au moins un article est requis'),
  
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  paymentMethod: z.string().min(1, 'Méthode de paiement requise'),
  notes: z.string().optional(),
});

// Schéma pour les catégories
export const categorySchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  
  slug: z.string()
    .min(2, 'Le slug doit contenir au moins 2 caractères')
    .regex(/^[a-z0-9-]+$/, 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'),
  
  description: z.string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional(),
  
  image: z.string().url('URL d\'image invalide').optional(),
  
  parent: z.string().optional(),
  
  isActive: z.boolean().default(true),
});

// Schéma pour les avis
export const reviewSchema = z.object({
  rating: z.number()
    .int('La note doit être un nombre entier')
    .min(1, 'La note minimum est 1')
    .max(5, 'La note maximum est 5'),
  
  comment: z.string()
    .min(10, 'Le commentaire doit contenir au moins 10 caractères')
    .max(1000, 'Le commentaire ne peut pas dépasser 1000 caractères'),
  
  images: z.array(z.string().url())
    .max(5, 'Maximum 5 images autorisées')
    .optional(),
});

// Schéma pour le profil utilisateur
export const userProfileSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  
  profile: z.object({
    phone: z.string().optional(),
    bio: z.string().max(500, 'La bio ne peut pas dépasser 500 caractères').optional(),
    address: addressSchema.optional(),
    socialLinks: z.object({
      website: z.string().url('URL invalide').optional(),
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      twitter: z.string().optional(),
    }).optional(),
  }).optional(),
});

// Schéma pour les informations vendeur
export const vendorInfoSchema = z.object({
  businessName: z.string()
    .min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères')
    .max(100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères'),
  
  businessDescription: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères'),
  
  specialties: z.array(z.string())
    .min(1, 'Au moins une spécialité est requise')
    .max(10, 'Maximum 10 spécialités autorisées'),
});

// Schéma pour la recherche de produits
export const productSearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z.enum(['newest', 'oldest', 'price-low', 'price-high', 'rating', 'popular']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// Schéma pour les filtres
export const filtersSchema = z.object({
  categories: z.array(z.string()).default([]),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  tags: z.array(z.string()).default([]),
  sortBy: z.string().default('newest'),
  inStock: z.boolean().optional(),
  freeShipping: z.boolean().optional(),
  featured: z.boolean().optional(),
});

// Export des types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type VendorInfoFormData = z.infer<typeof vendorInfoSchema>;
export type ProductSearchFormData = z.infer<typeof productSearchSchema>;
export type FiltersFormData = z.infer<typeof filtersSchema>;