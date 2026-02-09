import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products");
  res.json(result.rows);
});

app.post("/products", async (req, res) => {
  const { name, sku, type, size, price, quantity, warehouse_id } = req.body;

  const result = await pool.query(
    `INSERT INTO products 
     (name, sku, type, size, price, quantity, warehouse_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [name, sku, type, size, price, quantity, warehouse_id],
  );

  res.json(result.rows[0]);
});

app.listen(3001, () => {
  console.log("API running on port 3001");
});
