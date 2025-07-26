// src/pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcrypt';
import { kv } from '@/lib/kv'; 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // パスワードをハッシュ化
    const hashedPassword = await hash(password, 12);

    // Vercel KVにユーザー情報を保存（キーはemail）
    await kv.set(`user:${email}`, {
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
}