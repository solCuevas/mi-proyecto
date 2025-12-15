const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UserRepository = require('../repositories/userRepository');
const { JWT_SECRET, EMAIL_USER, EMAIL_PASS, CLIENT_URL } = process.env;

// Función para generar un token de recuperación de contraseña
const generateResetToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

// Enviar correo con el enlace de restablecimiento de contraseña
const sendResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Recuperación de Contraseña',
    text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
  };

  await transporter.sendMail(mailOptions);
};

// Recuperar contraseña (Genera el token y lo envía por correo)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Generar el token
    const token = generateResetToken(user._id);

    // Enviar el correo con el enlace para restablecer la contraseña
    await sendResetEmail(email, token);

    res.status(200).json({ message: 'Te hemos enviado un enlace para restablecer tu contraseña' });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar el correo', error });
  }
};

// Restablecer contraseña con el token
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserRepository.findUserById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar que la nueva contraseña no sea la misma que la actual
    if (user.isValidPassword(newPassword)) {
      return res.status(400).json({ message: 'La nueva contraseña no puede ser la misma que la anterior' });
    }

    // Actualizar la contraseña
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al restablecer la contraseña', error });
  }
};
