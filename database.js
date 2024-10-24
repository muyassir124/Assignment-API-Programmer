const { Client } = require('pg');
    

// Konfigurasi koneksi
const client = new Client({
    user: 'postgres',     // Ganti dengan username PostgreSQL Anda
    host: 'localhost',     // Ganti dengan host jika diperlukan
    database: 'postgres',    // Ganti dengan nama database Anda
    password: 'ayas124',   // Ganti dengan password PostgreSQL Anda
    port: 5432,            // Port PostgreSQL (default 5432)
});

// Membuat koneksi
client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');
        // Tambahkan query di sini
    })
    .catch(err => {
        console.error('Connection error', err.stack);
    });

// Jangan lupa untuk menutup koneksi setelah selesai
// client.end();
