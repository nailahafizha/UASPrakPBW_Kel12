const db = require("../config/db");

exports.getLocations = (req, res) => {
  const query = `
    SELECT 
      l.id,
      l.nama_lokasi,
      l.alamat,
      l.telepon,
      l.hari_operasional,
      l.jam_buka,
      l.jam_tutup,
      l.batas_hari,
      GROUP_CONCAT(w.nama_jenis SEPARATOR ', ') AS jenis_limbah
    FROM locations l
    LEFT JOIN location_waste_types lw ON l.id = lw.location_id
    LEFT JOIN waste_types w ON lw.waste_type_id = w.id
    GROUP BY l.id
    ORDER BY l.id DESC
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil lokasi" });

    res.json(result);
  });
};

exports.getLocationById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM locations WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil detail lokasi" });

    if (result.length === 0) {
      return res.status(404).json({ message: "Lokasi tidak ditemukan" });
    }

    res.json(result[0]);
  });
};

exports.createLocation = (req, res) => {
  const {
    nama_lokasi,
    alamat,
    telepon,
    hari_operasional,
    jam_buka,
    jam_tutup,
    batas_hari,
    waste_type_ids,
  } = req.body;

  const query = `
    INSERT INTO locations 
    (nama_lokasi, alamat, telepon, hari_operasional, jam_buka, jam_tutup, batas_hari)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [nama_lokasi, alamat, telepon, hari_operasional, jam_buka, jam_tutup, batas_hari],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal menambah lokasi" });

      const locationId = result.insertId;

      if (!Array.isArray(waste_type_ids) || waste_type_ids.length === 0) {
        return res.status(201).json({ message: "Lokasi berhasil ditambahkan" });
      }

      const values = waste_type_ids.map(wasteTypeId => [locationId, wasteTypeId]);

      db.query(
        "INSERT INTO location_waste_types (location_id, waste_type_id) VALUES ?",
        [values],
        (err) => {
          if (err) return res.status(500).json({ message: "Lokasi tersimpan, tapi jenis limbah gagal disimpan" });

          res.status(201).json({ message: "Lokasi berhasil ditambahkan" });
        }
      );
    }
  );
};

exports.updateLocation = (req, res) => {
  const { id } = req.params;
  const {
    nama_lokasi,
    alamat,
    telepon,
    hari_operasional,
    jam_buka,
    jam_tutup,
    batas_hari,
    waste_type_ids,
  } = req.body;

  const query = `
    UPDATE locations
    SET nama_lokasi = ?, alamat = ?, telepon = ?, hari_operasional = ?, jam_buka = ?, jam_tutup = ?, batas_hari = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [nama_lokasi, alamat, telepon, hari_operasional, jam_buka, jam_tutup, batas_hari, id],
    (err) => {
      if (err) return res.status(500).json({ message: "Gagal memperbarui lokasi" });

      db.query("DELETE FROM location_waste_types WHERE location_id = ?", [id], (err) => {
        if (err) return res.status(500).json({ message: "Gagal memperbarui jenis limbah lokasi" });

        if (!Array.isArray(waste_type_ids) || waste_type_ids.length === 0) {
          return res.json({ message: "Lokasi berhasil diperbarui" });
        }

        const values = waste_type_ids.map(wasteTypeId => [id, wasteTypeId]);

        db.query(
          "INSERT INTO location_waste_types (location_id, waste_type_id) VALUES ?",
          [values],
          (err) => {
            if (err) return res.status(500).json({ message: "Gagal menyimpan jenis limbah lokasi" });

            res.json({ message: "Lokasi berhasil diperbarui" });
          }
        );
      });
    }
  );
};

exports.deleteLocation = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM locations WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Gagal menghapus lokasi" });

    res.json({ message: "Lokasi berhasil dihapus" });
  });
};