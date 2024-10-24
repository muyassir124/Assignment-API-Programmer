import express from "express";
import pg from "pg";

const { Client } = pg;

const app = express();

// Middleware untuk menguraikan JSON
app.use(express.json());

// Inisialisasi client PostgreSQL
const client = new Client({
    host: 'localhost',
    user: 'postgres', // Ganti dengan username Anda
    password: 'ayas124', // Ganti dengan password Anda
    database: 'postgres', // Ganti dengan nama database Anda
    port: 5432,
});

// Menghubungkan ke database
client.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the PostgreSQL database.');
    }
});


app.use(express.json()); // Middleware untuk parsing JSON

// Endpoint untuk menambahkan saldo
app.get('/balance/:user_id', (req, res) => {
    const userId = req.params.user_id;

    // Cek saldo pengguna
    const sql = 'SELECT * FROM balance WHERE user_id = $1';
    client.query(sql, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: err.message,
                data: null
            });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No balance record found for this user',
                data: null
            });
        }

        // Jika saldo ditemukan, kembalikan data
        const balance = result.rows[0];
        res.status(200).json({
            status: 'success',
            message: 'Balance retrieved successfully',
            data: {
                user_id: balance.user_id,
                balance: balance.balance,
                updated_at: balance.updated_at
            }
        });
    });
});


// Menjalankan server
app.listen(2000, () => {
    console.log('Server is running on http://localhost:1000');
});
