// src/app/dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { UsersIcon, ReportIcon } from '@/components/Icons';

export default function DashboardPage() {
    const { userData } = useAuth();
    const [stats, setStats] = useState({ totalPerangkat: 0, totalLaporan: 0 });

    useEffect(() => {
        if (!userData) return;

        let unsubscribePerangkat;
        let unsubscribeLaporan;

        if (userData.role === 'admin') {
            // Admin: hitung semua perangkat & laporan
            const qPerangkat = query(collection(db, "users"), where("role", "==", "perangkat"));
            unsubscribePerangkat = onSnapshot(qPerangkat, (snapshot) => {
                setStats(prev => ({ ...prev, totalPerangkat: snapshot.size }));
            });

            const qLaporan = query(collection(db, "laporan"));
            unsubscribeLaporan = onSnapshot(qLaporan, (snapshot) => {
                setStats(prev => ({ ...prev, totalLaporan: snapshot.size }));
            });
        } else {
            // Perangkat: hitung laporannya sendiri
            const qLaporan = query(collection(db, "laporan"), where("pelaporUid", "==", userData.id));
            unsubscribeLaporan = onSnapshot(qLaporan, (snapshot) => {
                setStats(prev => ({ ...prev, totalLaporan: snapshot.size }));
            });
        }

        return () => {
            if (unsubscribePerangkat) unsubscribePerangkat();
            if (unsubscribeLaporan) unsubscribeLaporan();
        };
    }, [userData]);

    if (!userData) {
        return <div className="p-8 dark:text-white">Memuat data pengguna...</div>;
    }

    return (
        <div className="dark:text-white">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Selamat datang kembali, {userData.namaLengkap}</p>

            {/* Kartu Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userData.role === 'admin' && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                            <UsersIcon className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Perangkat Desa</p>
                            <p className="text-2xl font-bold">{stats.totalPerangkat}</p>
                        </div>
                    </div>
                )}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                        <ReportIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {userData.role === 'admin' ? 'Total Laporan Masuk' : 'Total Laporan Saya'}
                        </p>
                        <p className="text-2xl font-bold">{stats.totalLaporan}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}