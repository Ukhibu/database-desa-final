// src/components/EditProfilModal.js
'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function EditProfilModal({ currentUserData, onClose }) {
    // Inisialisasi form dengan data pengguna saat ini
    const [formData, setFormData] = useState({
        namaLengkap: '',
        alamat: '',
        nomorTelepon: '',
        tanggalLahir: '',
        fotoProfil: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUserData) {
            setFormData({
                namaLengkap: currentUserData.namaLengkap || '',
                alamat: currentUserData.alamat || '',
                nomorTelepon: currentUserData.nomorTelepon || '',
                tanggalLahir: currentUserData.tanggalLahir || '',
                fotoProfil: currentUserData.fotoProfil || ''
            });
        }
    }, [currentUserData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userRef = doc(db, "users", currentUserData.id);
            await updateDoc(userRef, formData);
            alert('Profil berhasil diperbarui!');
            onClose(); // Tutup modal setelah berhasil
        } catch (error) {
            console.error("Error updating profile:", error);
            alert('Gagal memperbarui profil.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Edit Profil Saya</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                        <input name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Lahir</label>
                        <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nomor Telepon</label>
                        <input name="nomorTelepon" value={formData.nomorTelepon} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alamat</label>
                        <textarea name="alamat" rows="3" value={formData.alamat} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Link Foto Profil (Google Drive)</label>
                        <input name="fotoProfil" value={formData.fotoProfil} onChange={handleChange} placeholder="https://..." className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400">Batal</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}