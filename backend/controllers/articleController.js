const db = require("../config/db");

exports.getArticles = (req, res) => {
  const { kategori } = req.query;

  let query = "SELECT * FROM articles";
  const values = [];

  if (kategori && kategori !== "Semua") {
    query += " WHERE kategori = ?";
    values.push(kategori);
  }

  query += " ORDER BY created_at DESC";

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Gagal mengambil artikel" });
    }

    res.json(result);
  });
};

exports.getArticleById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM articles WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil detail artikel" });

    if (result.length === 0) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }

    res.json(result[0]);
  });
};

exports.createArticle = (req, res) => {
  const { judul, kategori, isi } = req.body;

  if (!judul || !kategori || !isi) {
    return res.status(400).json({ message: "Judul, kategori, dan isi wajib diisi" });
  }

  const query = "INSERT INTO articles (judul, kategori, isi) VALUES (?, ?, ?)";

  db.query(query, [judul, kategori, isi], (err) => {
    if (err) return res.status(500).json({ message: "Gagal menambah artikel" });

    res.status(201).json({ message: "Artikel berhasil ditambahkan" });
  });
};

exports.updateArticle = (req, res) => {
  const { id } = req.params;
  const { judul, kategori, isi } = req.body;

  const query = "UPDATE articles SET judul = ?, kategori = ?, isi = ? WHERE id = ?";

  db.query(query, [judul, kategori, isi, id], (err) => {
    if (err) return res.status(500).json({ message: "Gagal mengubah artikel" });

    res.json({ message: "Artikel berhasil diperbarui" });
  });
};

exports.deleteArticle = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM articles WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Gagal menghapus artikel" });

    res.json({ message: "Artikel berhasil dihapus" });
  });
};