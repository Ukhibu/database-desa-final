// src/components/Sidebar.js
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { DashboardIcon, UsersIcon, ReportIcon, ProfileIcon, LogoutIcon } from './Icons';

export default function Sidebar() {
    const { userData } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };

    // Definisikan menu navigasi berdasarkan role pengguna
    const adminMenu = [
        { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
        { name: 'Manajemen Pengguna', href: '/dashboard/manajemen-pengguna', icon: UsersIcon },
        { name: 'Laporan Masuk', href: '/dashboard/laporan', icon: ReportIcon },
    ];

      const perangkatMenu = [
        { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
        { name: 'Profil Saya', href: '/dashboard/profil', icon: ProfileIcon },
        { name: 'Kirim Laporan', href: '/dashboard/kirim-laporan', icon: ReportIcon },
        { name: 'Riwayat Laporan', href: '/dashboard/riwayat-laporan', icon: ReportIcon },
    ];

    const navLinks = userData?.role === 'admin' ? adminMenu : perangkatMenu;

    return (
        <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
            <div className="h-16 flex items-center justify-center px-4 border-b border-gray-700">
                {/* Ganti dengan logo Anda */}
                <h1 className="text-xl font-bold">Database Desa</h1>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link key={link.name} href={link.href}>
                            <span className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                                isActive 
                                ? 'bg-gray-900 text-white' 
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}>
                                <link.icon className="mr-3 h-6 w-6" />
                                {link.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>
            <div className="px-2 py-4 border-t border-gray-700">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                    <LogoutIcon className="mr-3 h-6 w-6" />
                    Keluar
                </button>
            </div>
        </aside>
    );
}
