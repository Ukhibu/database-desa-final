// src/components/LoginPage.js
'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image'; // Menggunakan komponen Image dari Next.js untuk optimasi

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); 
    console.log("--- Tombol Masuk Diklik ---");
    setLoading(true);
    setError('');

    if (!email || !password) {
        console.error("Email atau Password kosong.");
        setError("Email dan Password harus diisi.");
        setLoading(false);
        return;
    }

    try {
      console.log("Mencoba login ke Firebase...");
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Firebase: Login BERHASIL. Menunggu redirect dari AuthContext...");
    } catch (err) {
      console.error("Firebase: Login GAGAL. Error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email atau password yang Anda masukkan salah.');
      } else {
        setError('Terjadi kesalahan saat mencoba login.');
      }
    } finally {
      console.log("--- Proses Login Selesai ---");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-200 p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        
        {/* Bagian Logo dan Judul */}
        <div className="flex flex-col items-center text-center">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Seal_of_Banjarnegara_Regency_%282022%29.svg/392px-Seal_of_Banjarnegara_Regency_%282022%29.svg.png"
            alt="Logo Kabupaten Banjarnegara"
            width={80}
            height={95}
            priority
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Aplikasi SIMPEKDES
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Kecamatan Punggelan
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Silakan login untuk melanjutkan
          </p>
        </div>
        
        {/* Form Login */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email-address" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input 
              id="email-address" 
              name="email" 
              type="email" 
              autoComplete="email" 
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              autoComplete="current-password" 
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center pt-2">{error}</p>}

          <div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}