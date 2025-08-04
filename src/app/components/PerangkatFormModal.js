// src/components/PerangkatFormModal.js
'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

export default function PerangkatFormModal({ editingPerangkat, onClose }) {
    const [formData, setFormData] = useState({ email: '', password: '', namaLengkap: '', nip: '', jabatan: '', desa: '', role: 'perangkat' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const isEditing = !!editingPerangkat;

    const daftarDesa = ["Punggelan", "Jembangan", "Karangsari", "Kebutuh", "Kecepit", "Klagen", "Mlaya", "Petuguran", "Purwasana", "Sawal", "Sidarahayu", "Tanjunganom", "Tegalontar", "Tribana", "Wanadadi", "Bondolharjo", "Danakerta"];

    useEffect(() => {
        if (isEditing) {
            setFormData({ ...editingPerangkat, password: '' });
        } else {
            setFormData({ email: '', password: '', namaLengkap: '', nip: '', jabatan: '', desa: '', role: 'perangkat' });
        }
    }, [editingPerangkat, isEditing]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditing) {
                // Logika untuk mengedit data
                const userRef = doc(db, "users", editingPerangkat.id);
                const { email, password, role, ...updateData } = formData; // email, password, dan role tidak diupdate
                await updateDoc(userRef, updateData);
                alert('Data berhasil diperbarui!');
            } else {
                // Logika untuk menambah data baru
                if (!formData.password) {
                    setError('Password wajib diisi untuk pengguna baru.');
                    setLoading(false);
                    return;
                }
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;
                const { password, ...firestoreData } = formData;
                await setDoc(doc(db, "users", user.uid), firestoreData);
                alert('Perangkat baru berhasil ditambahkan!');
            }
            onClose();
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{isEditing ? 'Edit Data Perangkat' : 'Tambah Perangkat Baru'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} placeholder="Nama Lengkap" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                        <input name="nip" value={formData.nip} onChange={handleChange} placeholder="NIP" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                        {!isEditing && (
                            <>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email (untuk login)" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password Awal" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                            </>
                        )}
                        <input name="jabatan" value={formData.jabatan} onChange={handleChange} placeholder="Jabatan" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                        <select name="desa" value={formData.desa} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                            <option value="">Pilih Desa</option>
                            {daftarDesa.sort().map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400">Batal</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">{loading ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
