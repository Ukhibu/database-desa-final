// src/app/dashboard/kirim-laporan/page.js
'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function KirimLaporanPage() {
    const { user, userData } = useAuth();
    const [isiLaporan, setIsiLaporan] = useState('');
    const [linkDokumen, setLinkDokumen] = useState('');
    const [loading, setLoading] = useState(false);

    const handleKirimLaporan = async (e) => {
        e.preventDefault();
        if (!isiLaporan.trim()) {
            alert("Isi laporan tidak boleh kosong.");
            return;
        }
        setLoading(true);
        try {
            await addDoc(collection(db, "laporan"), {
                pelaporUid: user.uid,
                pelaporNama: userData.namaLengkap,
                pelaporDesa: userData.desa,
                isiLaporan: isiLaporan,
                linkDokumen: linkDokumen,
                tanggalDibuat: serverTimestamp(),
                status: 'Baru'
            });
            alert("Laporan berhasil dikirim!");
            setIsiLaporan('');
            setLinkDokumen('');
        } catch (error) {
            console.error("Error sending report:", error);
            alert("Gagal mengirim laporan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dark:text-white">
            <h1 className="text-3xl font-bold mb-6">Kirim Laporan Baru</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                <form onSubmit={handleKirimLaporan} className="space-y-4">
                    <div>
                        <label htmlFor="laporan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Isi Laporan</label>
                        <textarea id="laporan" rows="5" value={isiLaporan} onChange={(e) => setIsiLaporan(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600" required></textarea>
                    </div>
                    <div>
                        <label htmlFor="linkDokumen" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Link Dokumen Pendukung (Opsional)</label>
                        <input type="url" id="linkDokumen" value={linkDokumen} onChange={(e) => setLinkDokumen(e.target.value)} placeholder="https://docs.google.com/..." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                        {loading ? 'Mengirim...' : 'Kirim Laporan'}
                    </button>
                </form>
            </div>
        </div>
    );
}