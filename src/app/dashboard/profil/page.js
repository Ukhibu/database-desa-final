// src/app/dashboard/profil/page.js
'use client';
import { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import Image from 'next/image';
import EditProfilModal from '@/components/EditProfilModal'; // Impor modal
import { EditIcon } from '@/components/Icons';

export default function ProfilPage() {
    const { userData } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!userData) {
        return <div className="dark:text-white">Memuat profil...</div>
    }

    return (
        <>
            <div className="dark:text-white">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Profil Saya</h1>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        <EditIcon /> Edit Profil
                    </button>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Foto Profil */}
                        <div className="flex-shrink-0">
                            <Image
                                src={userData.fotoProfil || `https://ui-avatars.com/api/?name=${userData.namaLengkap}&background=random&size=128`}
                                alt={`Foto profil ${userData.namaLengkap}`}
                                width={128}
                                height={128}
                                className="rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                                unoptimized // Diperlukan jika menggunakan link eksternal
                            />
                        </div>

                        {/* Detail Data */}
                        <div className="w-full text-gray-800 dark:text-gray-200">
                            <h2 className="text-2xl font-bold">{userData.namaLengkap}</h2>
                            <p className="text-md text-gray-500 dark:text-gray-400">{userData.jabatan} - Desa {userData.desa}</p>
                            
                            <div className="mt-4 border-t dark:border-gray-700 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">NIP</p>
                                    <p>{userData.nip || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                                    <p>{userData.email || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Lahir</p>
                                    <p>{userData.tanggalLahir || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nomor Telepon</p>
                                    <p>{userData.nomorTelepon || '-'}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Alamat</p>
                                    <p>{userData.alamat || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tampilkan modal jika isModalOpen bernilai true */}
            {isModalOpen && <EditProfilModal currentUserData={userData} onClose={() => setIsModalOpen(false)} />}
        </>
    );
}