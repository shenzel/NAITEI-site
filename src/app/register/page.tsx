// src/app/register/page.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../page.module.css'; 

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // エラーメッセージをリセット

    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      // 登録成功したらログインページに移動
      router.push('/'); 
    } else {
      // エラーハンドリング
      const data = await res.json();
      setError(data.error || '登録に失敗しました。');
    }
  };

  return (
    <div className={styles.container}>
      <h2>アカウント登録</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">登録する</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Link href="/">すでにアカウントをお持ちですか？ ログイン</Link>
    </div>
  );
}