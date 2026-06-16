const db = require("../config/db");

exports.register = (req, res) => {
  const { nama, email, nomor_hp, password } = req.body;

  if (!nama || !email || !nomor_hp || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  const checkEmail =
    "SELECT email FROM users WHERE email = ? UNION SELECT email FROM admins WHERE email = ?";

  db.query(checkEmail, [email, email], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengecek email" });

    if (result.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const query =
      "INSERT INTO users (nama, email, nomor_hp, password) VALUES (?, ?, ?, ?)";

    db.query(query, [nama, email, nomor_hp, password], (err) => {
      if (err) return res.status(500).json({ message: "Gagal registrasi" });

      res.status(201).json({ message: "Registrasi berhasil" });
    });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const query =
    "SELECT id, nama, email, nomor_hp FROM users WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal login" });

    if (result.length === 0) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    res.json({
      message: "Login berhasil",
      user: result[0],
    });
  });
};

exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;

  const query =
    "SELECT id, nama, email FROM admins WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal login admin" });

    if (result.length === 0) {
      return res.status(401).json({ message: "Email atau password admin salah" });
    }

    res.json({
      message: "Login admin berhasil",
      admin: result[0],
    });
  });
};

exports.updateProfile = (req, res) => {
  const { id } = req.params;
  const { nama, email, nomor_hp } = req.body;

  if (!nama || !email || !nomor_hp) {
    return res.status(400).json({
      message: "Nama, email, dan nomor HP wajib diisi"
    });
  }

  const checkEmailQuery = `
    SELECT id FROM users
    WHERE email = ? AND id != ?
  `;

  db.query(checkEmailQuery, [email, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengecek email"
      });
    }

    if (result.length > 0) {
      return res.status(400).json({
        message: "Email sudah digunakan akun lain"
      });
    }

    const updateQuery = `
      UPDATE users
      SET nama = ?, email = ?, nomor_hp = ?
      WHERE id = ?
    `;

    db.query(updateQuery, [nama, email, nomor_hp, id], (err) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal memperbarui profil"
        });
      }

      res.json({
        message: "Profil berhasil diperbarui",
        user: {
          id: Number(id),
          nama,
          email,
          nomor_hp
        }
      });
    });
  });
};

exports.changePassword = (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Semua field password wajib diisi"
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      message: "Password baru minimal 8 karakter"
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "Konfirmasi password tidak sama"
    });
  }

  db.query(
    "SELECT password FROM users WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal mengecek user"
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "User tidak ditemukan"
        });
      }

      if (result[0].password !== oldPassword) {
        return res.status(400).json({
          message: "Password lama tidak sesuai"
        });
      }

      db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [newPassword, id],
        (err) => {
          if (err) {
            return res.status(500).json({
              message: "Gagal mengganti password"
            });
          }

          res.json({
            message: "Password berhasil diganti"
          });
        }
      );
    }
  );
};
