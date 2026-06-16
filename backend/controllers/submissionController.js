const db = require("../config/db");

function generateSubmissionCode() {
  return `MW-${Date.now()}`;
}

exports.createSubmission = (req, res) => {
  const {
    user_id,
    waste_type_id,
    location_id,
    jumlah,
    satuan,
    jadwal_penyerahan,
    catatan,
  } = req.body;

  const kode_penyerahan = generateSubmissionCode();

  const query = `
    INSERT INTO submissions
    (kode_penyerahan, user_id, waste_type_id, location_id, jumlah, satuan, jadwal_penyerahan, catatan)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      kode_penyerahan,
      user_id,
      waste_type_id,
      location_id,
      jumlah,
      satuan,
      jadwal_penyerahan,
      catatan || "-",
    ],
    (err) => {
      if (err) return res.status(500).json({ message: "Gagal membuat pengajuan" });

      res.status(201).json({
        message: "Pengajuan berhasil dibuat",
        kode_penyerahan,
      });
    }
  );
};

exports.getUserSubmissions = (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT
      s.id,
      s.kode_penyerahan,
      u.nama AS nama_user,
      w.nama_jenis,
      l.nama_lokasi,
      l.alamat,
      s.jumlah,
      s.satuan,
      s.jadwal_penyerahan,
      s.status,
      s.catatan,
      s.created_at
    FROM submissions s
    JOIN users u ON s.user_id = u.id
    JOIN waste_types w ON s.waste_type_id = w.id
    JOIN locations l ON s.location_id = l.id
    WHERE s.user_id = ?
    ORDER BY s.created_at DESC
  `;

  db.query(query, [user_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil riwayat" });

    res.json(result);
  });
};

exports.getSubmissionById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT
      s.id,
      s.kode_penyerahan,
      u.nama AS nama_user,
      w.nama_jenis,
      l.nama_lokasi,
      l.alamat,
      s.jumlah,
      s.satuan,
      s.jadwal_penyerahan,
      s.status,
      s.catatan,
      s.created_at
    FROM submissions s
    JOIN users u ON s.user_id = u.id
    JOIN waste_types w ON s.waste_type_id = w.id
    JOIN locations l ON s.location_id = l.id
    WHERE s.id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil detail penyerahan" });

    if (result.length === 0) {
      return res.status(404).json({ message: "Data penyerahan tidak ditemukan" });
    }

    res.json(result[0]);
  });
};