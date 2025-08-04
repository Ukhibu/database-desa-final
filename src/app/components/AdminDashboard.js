// src/components/AdminDashboard.js
'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, doc, deleteDoc } from 'firebase/firestore';
import { PlusIcon, EditIcon, DeleteIcon } from './Icons';
import PerangkatFormModal from './PerangkatFormModal';

export default function AdminDashboard({ currentUserData }) {
    const [activeTab, setActiveTab] = useState('perangkat');
    const [perangkatList, setPerangkatList] = useState([]);
    const [laporanList, setLaporanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPerangkat, setEditingPerangkat] = useState(null);

    useEffect(() => {
        const qPerangkat = query(collection(db, "users"));
        const unsubscribePerangkat = onSnapshot(qPerangkat, (snapshot) => {
            setPerangkatList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        const qLaporan = query(collection(db, "laporan"));
        const unsubscribeLaporan = onSnapshot(qLaporan, (snapshot) => {
            setLaporanList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribePerangkat();
            unsubscribeLaporan();
        };
    }, []);

    const handleAdd = () => {
        setEditingPerangkat(null);
        setIsModalOpen(true);
    };

    const handleEdit = (perangkat) => {
        setEditingPerangkat(perangkat);
        setIsModalOpen(true);
    };

    const handleDelete = async (id, nama) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus data ${nama}?`)) {
            try {
                await deleteDoc(doc(db, "users", id));
                alert('Data berhasil dihapus.');
            } catch (error) {
                console.error("Error deleting document: ", error);
                alert('Gagal menghapus data.');
            }
        }
    };

    return (
        <div className="dark:text-white">
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Selamat datang, {currentUserData.namaLengkap}</p>

            {/* Navigasi Tab */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('perangkat')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'perangkat' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>Manajemen Perangkat</button>
                    <button onClick={() => setActiveTab('laporan')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'laporan' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>Laporan Masuk</button>
                </nav>
            </div>

            {/* Konten Tab */}
            {activeTab === 'perangkat' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Data Perangkat Desa</h2>
                        <button onClick={handleAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"><PlusIcon /> Tambah Data</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nama / NIP</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Jabatan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Desa</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (<tr><td colSpan="4" className="text-center py-4">Memuat...</td></tr>) : (
                                    perangkatList.filter(p => p.role !== 'admin').map(p => (
                                        <tr key={p.id}>
                                            <td className="px-6 py-4"><div className="font-medium">{p.namaLengkap}</div><div className="text-sm text-gray-500 dark:text-gray-400">{p.nip}</div></td>
                                            <td className="px-6 py-4 text-sm">{p.jabatan}</td>
                                            <td className="px-6 py-4 text-sm">{p.desa}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"><EditIcon /></button>
                                                <button onClick={() => handleDelete(p.id, p.namaLengkap)} className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"><DeleteIcon /></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'laporan' && (
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Laporan Masuk</h2>
                    {/* Logika untuk menampilkan laporan akan ditambahkan di sini */}
                    <p>Fitur untuk menampilkan dan mengelola laporan akan segera hadir di sini.</p>
                 </div>
            )}

            {isModalOpen && <PerangkatFormModal editingPerangkat={editingPerangkat} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}
