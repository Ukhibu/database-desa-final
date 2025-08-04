// src/app/dashboard/laporan/page.js
'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function LaporanMasukPage() {
    const [laporanList, setLaporanList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mengambil data laporan dan mengurutkannya berdasarkan tanggal terbaru
        const q = query(collection(db, "laporan"), orderBy("tanggalDibuat", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data(),
                // Mengubah timestamp Firebase menjadi objek Date JavaScript yang valid
                tanggalDibuat: doc.data().tanggalDibuat?.toDate() 
            }));
            setLaporanList(list);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="dark:text-white">
            <h1 className="text-3xl font-bold mb-6">Laporan Masuk</h1>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Pelapor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Isi Laporan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-4">Memuat laporan...</td></tr>
                            ) : laporanList.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-4 text-gray-500 dark:text-gray-400">Tidak ada laporan masuk.</td></tr>
                            ) : (
                                laporanList.map(l => (
                                    <tr key={l.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {l.tanggalDibuat ? l.tanggalDibuat.toLocaleString('id-ID') : 'Tidak ada tanggal'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium">{l.pelaporNama}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{l.pelaporDesa}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm max-w-md">
                                            {l.isiLaporan}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                l.status === 'Baru' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {l.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}