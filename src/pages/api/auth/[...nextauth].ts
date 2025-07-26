// src/pages/api/auth/[...nextauth].ts

import NextAuth,{User} from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'; 
import { compare } from 'bcrypt'; 
import { kv } from '@/lib/kv'; 
import {JWT} from 'next-auth/jwt';

export const authOptions = {
  //認証プロバイダーの設定
  providers: [ 
    GithubProvider({
      clientId:process.env.GITHUB_ID!,
      clientSecret:process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await kv.get<{email: string, password: string}>(`user:${credentials.email}`);
        if (!user) {
          return null;
        }
        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }
        return {
          id: user.email,
          email: user.email,
        };
      },
    }),

  ], 

  callbacks: {
    //JWTが作成/更新されたときに呼ばれる
    jwt({ token, user}: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token}: {session:any, token:JWT}) {
      if(session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);