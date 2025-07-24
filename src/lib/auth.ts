// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          console.log('🔐 Attempting to authorize with credentials:', credentials?.email);
          
          if (!credentials?.email || !credentials?.password) {
            console.log('❌ Missing credentials');
            return null;
          }

          await dbConnect();
          console.log('✅ Database connected');
          
          const user = await User.findOne({ email: credentials.email }).select('+password');
          
          if (!user) {
            console.log('❌ User not found:', credentials.email);
            return null;
          }

          console.log('👤 User found:', { 
            id: user._id, 
            email: user.email, 
            role: user.role,
            isVerified: user.isVerified
          });

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            console.log('❌ Invalid password for:', credentials.email);
            return null;
          }

          console.log('✅ Password valid, creating session for:', credentials.email);

          // Retourner l'utilisateur avec toutes les propriétés nécessaires
          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            avatar: user.avatar,
            isVerified: user.isVerified,
            vendorInfo: user.vendorInfo,
            profile: user.profile,
          };
        } catch (error) {
          console.error('❌ Auth error:', error);
          return null;
        }
      }
    }),
    
    // Google provider seulement si les variables d'environnement sont présentes
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET 
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          async profile(profile) {
            await dbConnect();
            
            // Vérifier si l'utilisateur existe déjà
            let user = await User.findOne({ email: profile.email });
            
            if (!user) {
              // Créer un nouvel utilisateur
              user = await User.create({
                email: profile.email,
                firstName: profile.given_name || profile.name?.split(' ')[0] || '',
                lastName: profile.family_name || profile.name?.split(' ').slice(1).join(' ') || '',
                avatar: profile.picture,
                isVerified: true, // Google accounts are pre-verified
                role: 'buyer', // Default role
                password: 'google-oauth-user' // Placeholder password for OAuth users
              });
            }
            
            return {
              id: user._id.toString(),
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              avatar: user.avatar,
              isVerified: user.isVerified,
              vendorInfo: user.vendorInfo,
              profile: user.profile,
            };
          }
        })]
      : []
    )
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
    updateAge: 24 * 60 * 60, // 24 heures
  },
  
  callbacks: {
    async jwt({ token, user, trigger, session, account }) {
      console.log('🎫 JWT Callback - Token:', token.sub, 'User:', user?.email);
      
      if (user) {
        // Première connexion
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.vendorInfo = (user as any).vendorInfo;
        token.profile = (user as any).profile;
      }
      
      // Mettre à jour le token si nécessaire
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }
      
      return token;
    },
    
    async session({ session, token }) {
      console.log('🎪 Session Callback - Token sub:', token.sub, 'Session user:', session.user?.email);
      
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.vendorInfo = token.vendorInfo as any;
        session.user.profile = token.profile as any;
      }
      
      console.log('📤 Final session:', {
        id: session.user?.id,
        email: session.user?.email,
        role: session.user?.role,
        isVerified: session.user?.isVerified
      });
      
      return session;
    },
    
    async signIn({ user, account, profile }) {
      console.log('🚪 SignIn callback:', {
        user: user?.email,
        account: account?.provider,
        role: user?.role
      });
      
      // Vérifications supplémentaires si nécessaire
      if (account?.provider === 'credentials') {
        // L'utilisateur a été vérifié dans authorize()
        return true;
      }
      
      if (account?.provider === 'google') {
        // Vérifier que l'utilisateur Google a bien été créé/trouvé
        return !!user;
      }
      
      return true;
    },
    
    async redirect({ url, baseUrl }) {
      console.log('🔄 Redirect callback:', { url, baseUrl });
      
      // Permettre les redirections relatives
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Permettre les redirections vers la même origine
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      
      return baseUrl;
    },
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log('📝 SignIn event:', {
        user: user?.email,
        account: account?.provider,
        isNewUser,
        role: user?.role
      });
    },
    async session({ session, token }) {
      console.log('📋 Session event:', {
        user: session.user?.email,
        role: session.user?.role
      });
    },
  },
  
  // Configuration JWT personnalisée si nécessaire
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};