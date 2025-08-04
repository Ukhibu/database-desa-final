// src/app/dashboard/manajemen-pengguna/page.js
'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, doc, deleteDoc } from 'firebase/firestore';
import { PlusIcon, EditIcon, DeleteIcon } from '@/components/Icons';
import PerangkatFormModal from '@/components/PerangkatFormModal'; // Kita akan pakai modal yang sudah dibuat

export default function ManajemenPenggunaPage() {
    const [perangkatList, setPerangkatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPerangkat, setEditingPerangkat] = useState(null);

    // Mengambil data perangkat secara real-time
    useEffect(() => {
        const q = query(collection(db, "users"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPerangkatList(list.filter(p => p.role !== 'admin')); // Filter agar admin tidak muncul di daftar
            setLoading(false);
        });
        return () => unsubscribe();
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
        if (window.confirm(`Apakah Anda yakin ingin menghapus data ${nama}? Tindakan ini tidak dapat diurungkan.`)) {
            try {
                // Hapus dokumen dari Firestore
                await deleteDoc(doc(db, "users", id));
                // NOTE: Untuk keamanan, user di Firebase Auth tidak dihapus dari frontend.
                // Ini biasanya memerlukan backend/Cloud Function.
                alert('Data perangkat berhasil dihapus dari database.');
            } catch (error) {
                console.error("Error deleting document: ", error);
                alert('Gagal menghapus data perangkat.');
            }
        }
    };

    return (
        <div className="dark:text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
                <button onClick={handleAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    <PlusIcon /> Tambah Perangkat
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nama / Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Jabatan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Desa</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-4">Memuat data...</td></tr>
                            ) : (
                                perangkatList.map(p => (
                                    <tr key={p.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium">{p.namaLengkap}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{p.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{p.jabatan}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{p.desa}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                            <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title="Edit">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => handleDelete(p.id, p.namaLengkap)} className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" title="Hapus">
                                                <DeleteIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isModalOpen && <PerangkatFormModal editingPerangkat={editingPerangkat} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}