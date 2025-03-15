import express from "express";
import pool from "../db.js"; // Import MySQL connection pool

const router = express.Router();

//get request for Books
router.get("/", async (req, res) => {
  try {
    const [books] = await pool.query("SELECT * FROM books");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE BOOK BY ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [book] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);

    if (book.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(book[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//insert data into table books
router.post("/", async (req, res) => {
  try {
    const { title, desc, cover, price } = req.body;

    if (!title || !desc || !cover || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [result] = await pool.query(
      "INSERT INTO books (`title`,`desc`,`cover`,`price`) VALUES (?,?,?,?) ",
      [title, desc, cover, price]
    );
    res.status(201).json({ id: result.insertId, title, author, isbn });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete data from table books
router.delete("/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const [existingBook] = await pool.query(
      "SELECT * FROM books WHERE id = ?",
      [bookId]
    );
    if (existingBook.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    await pool.query("DELETE FROM books WHERE id = ?", [bookId]);

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, desc, cover, price } = req.body;
    if (!title || !desc || !cover || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [existingBook] = await pool.query(
      "SELECT * FROM books WHERE id = ?",
      [bookId]
    );
    if (existingBook.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    await pool.query(
      "UPDATE books SET `title`= ?, `desc`= ?, `cover`= ?, `price`= ? WHERE id = ?",
      [title, desc, cover, price, bookId]
    );
    res.status(200).json("Book has been updated successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
