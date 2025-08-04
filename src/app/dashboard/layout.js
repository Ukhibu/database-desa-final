// src/app/dashboard/layout.js
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Jika proses pengecekan auth sudah selesai DAN tidak ada user,
        // maka "usir" pengguna ke halaman login.
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]); // Efek ini berjalan setiap kali status user atau loading berubah

    // Selama proses loading, atau jika user tidak ada (dan kita sedang menunggu di-redirect),
    // tampilkan pesan loading yang jelas. Ini mencegah halaman "berkedip".
    if (loading || !user) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-gray-900">
                <p className="text-lg dark:text-white">Memverifikasi sesi Anda...</p>
            </div>
        );
    }

    // Jika loading selesai dan user ADA, barulah tampilkan layout dashboard yang sebenarnya.
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}