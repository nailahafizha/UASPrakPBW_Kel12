const db = require("../config/db");

exports.getDashboardStats = (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM users) AS total_user,
      (SELECT COUNT(*) FROM submissions) AS total_pengajuan,
      (SELECT COUNT(*) FROM submissions WHERE status = 'Selesai') AS total_selesai,
      (SELECT COUNT(*) FROM locations) AS total_lokasi
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil statistik dashboard" });

    res.json(result[0]);
  });
};

exports.getAllSubmissions = (req, res) => {
  const { status } = req.query;

  let query = `
    SELECT
      s.id,
      s.kode_penyerahan,
      u.nama AS nama_user,
      w.nama_jenis,
      l.nama_lokasi,
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
  `;

  const values = [];

  if (status && status !== "Semua") {
    query += " WHERE s.status = ?";
    values.push(status);
  }

  query += " ORDER BY s.created_at DESC";

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data penyerahan" });

    res.json(result);
  });
};

exports.updateSubmissionStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatus = [
    "Menunggu Penyerahan",
    "Diterima Lokasi",
    "Selesai",
    "Dibatalkan",
  ];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Status tidak valid" });
  }

  const query = "UPDATE submissions SET status = ? WHERE id = ?";

  db.query(query, [status, id], (err) => {
    if (err) return res.status(500).json({ message: "Gagal memperbarui status" });

    res.json({ message: "Status berhasil diperbarui" });
  });
};