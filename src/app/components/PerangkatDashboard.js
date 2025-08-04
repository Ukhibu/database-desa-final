// src/components/PerangkatDashboard.js
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export default function PerangkatDashboard() {
    const { user, userData } = useAuth();
    const [activeTab, setActiveTab] = useState('profil');
    const [riwayatLaporan, setRiwayatLaporan] = useState([]);
    const [isiLaporan, setIsiLaporan] = useState('');
    const [loadingLaporan, setLoadingLaporan] = useState(false);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "laporan"), where("pelaporUid", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setRiwayatLaporan(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [user]);

    const handleKirimLaporan = async (e) => {
        e.preventDefault();
        if (!isiLaporan.trim()) return;
        setLoadingLaporan(true);
        try {
            await addDoc(collection(db, "laporan"), {
                pelaporUid: user.uid,
                pelaporNama: userData.namaLengkap,
                pelaporDesa: userData.desa,
                isiLaporan: isiLaporan,
                tanggalDibuat: serverTimestamp(),
                status: 'Baru'
            });
            alert("Laporan berhasil dikirim!");
            setIsiLaporan('');
        } catch (error) {
            console.error("Error sending report:", error);
            alert("Gagal mengirim laporan.");
        } finally {
            setLoadingLaporan(false);
        }
    };

    return (
        <div className="dark:text-white">
            <h1 className="text-3xl font-bold">Dashboard Perangkat Desa</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Selamat datang, {userData.namaLengkap}</p>

            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('profil')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profil' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>Profil Saya</button>
                    <button onClick={() => setActiveTab('laporan')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'laporan' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>Kirim Laporan</button>
                    <button onClick={() => setActiveTab('riwayat')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'riwayat' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>Riwayat Laporan</button>
                </nav>
            </div>

            {activeTab === 'profil' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Detail Profil</h2>
                    <div className="space-y-2">
                        <p><strong>Nama:</strong> {userData.namaLengkap}</p>
                        <p><strong>NIP:</strong> {userData.nip}</p>
                        <p><strong>Jabatan:</strong> {userData.jabatan}</p>
                        <p><strong>Desa:</strong> {userData.desa}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                    </div>
                    {/* Tombol edit profil bisa ditambahkan di sini */}
                </div>
            )}

            {activeTab === 'laporan' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Form Laporan Baru</h2>
                    <form onSubmit={handleKirimLaporan} className="space-y-4">
                        <div>
                            <label htmlFor="laporan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Isi Laporan</label>
                            <textarea id="laporan" rows="5" value={isiLaporan} onChange={(e) => setIsiLaporan(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600" required></textarea>
                        </div>
                        <button type="submit" disabled={loadingLaporan} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400">{loadingLaporan ? 'Mengirim...' : 'Kirim Laporan'}</button>
                    </form>
                </div>
            )}

            {activeTab === 'riwayat' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Riwayat Laporan Anda</h2>
                    <div className="space-y-4">
                        {riwayatLaporan.length > 0 ? riwayatLaporan.map(l => (
                            <div key={l.id} className="border-b dark:border-gray-700 pb-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">{l.tanggalDibuat?.toDate().toLocaleString('id-ID')}</p>
                                <p>{l.isiLaporan}</p>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${l.status === 'Baru' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{l.status}</span>
                            </div>
                        )) : <p>Anda belum pernah mengirim laporan.</p>}
                    </div>
                </div>
            )}
        </div>
    );
}
