// src/components/LogoutButton.tsx
'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '14px',
        padding: '6px 12px',
        backgroundColor: '#ccc',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      ログアウト
    </button>
  );
}
