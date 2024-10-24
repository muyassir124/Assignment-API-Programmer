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

// Endpoint untuk menguji API
app.get("/", (req, res) => {
    res.status(200).json({
        message: "oke km"
    });
});

// Endpoint untuk registrasi
app.post('/registration', (req, res) => {
    const { email, first_name, last_name, password } = req.body;

    const sql = 'INSERT INTO public.user (email, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING id';

    client.query(sql, [email, first_name, last_name, password], (err, result) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ id: result.rows[0].id, first_name, last_name, email });
    });
});


// Menjalankan server
app.listen(9000, () => {
    console.log('Server is running on http://localhost:1000');
});
