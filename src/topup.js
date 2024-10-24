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

// Endpoint untuk top-up saldo
app.post('/topup', (req, res) => {
    const { user_id, amount } = req.body;

    if (!user_id || !amount || amount <= 0) {
        return res.status(400).json({
            status: '102',
            message: 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
            data: null
        });
    }

    // Cek apakah pengguna ada
    const checkUserSql = 'SELECT * FROM "user" WHERE id = $1';
    client.query(checkUserSql, [user_id], (err, userResult) => {
        if (err || userResult.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                data: null
            });
        }

        // Cek saldo pengguna
        const checkBalanceSql = 'SELECT * FROM balance WHERE user_id = $1';
        client.query(checkBalanceSql, [user_id], (err, balanceResult) => {
            if (err || balanceResult.rowCount === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No balance record exists for this user',
                    data: null
                });
            }

            // Update saldo
            const updateSql = 'UPDATE balance SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *';
            client.query(updateSql, [amount, user_id], (err, updateResult) => {
                if (err) {
                    return res.status(400).json({
                        status: 'error',
                        message: err.message,
                        data: null
                    });
                }

                res.status(200).json({
                    status: '00',
                    message: 'Top up balance berhasil',
                    data: updateResult.rows[0]
                });
            });
        });
    });
});


// Menjalankan server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:1000');
});
