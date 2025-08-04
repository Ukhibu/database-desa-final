// src/app/dashboard/riwayat-laporan/page.js
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function RiwayatLaporanPage() {
    const { user } = useAuth();
    const [riwayatLaporan, setRiwayatLaporan] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "laporan"), where("pelaporUid", "==", user.uid), orderBy("tanggalDibuat", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data(),
                tanggalDibuat: doc.data().tanggalDibuat?.toDate()
            }));
            setRiwayatLaporan(list);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    return (
        <div className="dark:text-white">
            <h1 className="text-3xl font-bold mb-6">Riwayat Laporan Saya</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="space-y-4">
                    {loading ? (
                        <p>Memuat riwayat...</p>
                    ) : riwayatLaporan.length > 0 ? (
                        riwayatLaporan.map(l => (
                            <div key={l.id} className="border-b dark:border-gray-700 pb-3">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {l.tanggalDibuat ? l.tanggalDibuat.toLocaleString('id-ID') : 'Tidak ada tanggal'}
                                    </p>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        l.status === 'Baru' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                        {l.status}
                                    </span>
                                </div>
                                <p className="mt-1">{l.isiLaporan}</p>
                                {l.linkDokumen && (
                                    <a href={l.linkDokumen} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">Lihat Dokumen</a>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">Anda belum pernah mengirim laporan.</p>
                    )}
                </div>
            </div>
        </div>
    );
}