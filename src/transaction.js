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

app.post('/transaction', async (req, res) => {
    const { sender_id, receiver_id, amount } = req.body;

    // Validasi input
    if (!sender_id || !receiver_id || !amount || amount <= 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Sender ID, Receiver ID, and amount must be provided and amount must be greater than 0',
            data: null
        });
    }

    try {
        // Mulai transaksi
        await client.query('BEGIN');

        // Cek saldo pengirim
        const checkSenderSql = 'SELECT balance FROM balance WHERE user_id = $1';
        const senderResult = await client.query(checkSenderSql, [sender_id]);

        if (senderResult.rowCount === 0 || senderResult.rows[0].balance < amount) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                status: 'error',
                message: 'Insufficient balance or sender not found',
                data: null
            });
        }

        // Kurangi saldo pengirim
        const deductSql = 'UPDATE balance SET balance = balance - $1 WHERE user_id = $2';
        await client.query(deductSql, [amount, sender_id]);

        // Tambah saldo penerima
        const addSql = 'UPDATE balance SET balance = balance + $1 WHERE user_id = $2';
        await client.query(addSql, [amount, receiver_id]);

        // Commit transaksi
        await client.query('COMMIT');

        res.status(200).json({
            status: 'success',
            message: 'Transaction successful',
            data: {
                sender_id,
                receiver_id,
                amount,
            }
        });
    } catch (error) {
        // Jika terjadi kesalahan, rollback transaksi
        await client.query('ROLLBACK');
        return res.status(500).json({
            status: 'error',
            message: error.message,
            data: null
        });
    }
});


// Menjalankan server
app.listen(4000, () => {
    console.log('Server is running on http://localhost:1000');
});
