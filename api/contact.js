import { Resend } from 'resend';

// Inicializar Resend con Fallback a la proporcionada si env var no existe.
const resend = new Resend(process.env.RESEND_API_KEY || 're_HKDpr5UF_8DyCUXy2fSKexqEHVBBfW6Yp');

export default async function handler(req, res) {
  // Solo permitir solicitudes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const data = req.body;

    // Honeypot check
    // Si botcheck tiene valor (está tildado u oculto), evitamos el envío pero damos falso positivo
    if (data.botcheck && data.botcheck === true) {
      return res.status(200).json({ success: true, message: 'Consulta enviada correctamente.' });
    }

    const nombre = data.Nombre?.trim();
    const email = data.Email?.trim();
    const telefono = data.Teléfono?.trim();
    const empresa = data.Empresa?.trim() || 'No especificada';
    const motivo = data.Motivo || 'No especificado';
    const mensaje = data.Mensaje?.trim();

    // Validaciones básicas backend
    if (!nombre || nombre.length < 3) {
      return res.status(400).json({ success: false, error: 'Nombre inválido.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Email inválido.' });
    }
    if (!telefono || telefono.length < 8) {
      return res.status(400).json({ success: false, error: 'Teléfono inválido.' });
    }
    if (!mensaje || mensaje.length < 20) {
      return res.status(400).json({ success: false, error: 'Mensaje muy corto.' });
    }

    // Construir el HTML
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #2ecc71; border-bottom: 2px solid #2ecc71; padding-bottom: 10px;">Nueva Consulta de Contacto</h2>
        <p>Has recibido un nuevo mensaje desde el sitio web de KPS Energy.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Nombre:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${nombre}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Teléfono:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${telefono}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Empresa:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${empresa}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Motivo:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${motivo}</td>
          </tr>
        </table>
        
        <h3 style="margin-top: 30px;">Mensaje:</h3>
        <div style="padding: 15px; background-color: #f9f9f9; border-left: 4px solid #2ecc71; white-space: pre-wrap;">
          ${mensaje}
        </div>
      </div>
    `;

    // Enviar el email usando Resend
    const result = await resend.emails.send({
      from: 'KPS Energy Web <no-reply@kpsenergy.com.ar>',
      to: 'info@kpsenergy.com.ar',
      subject: 'Nueva consulta desde la web de KPS Energy',
      replyTo: email,
      html: htmlContent
    });

    if (result.error) {
      console.error('Resend API Error:', result.error);
      return res.status(500).json({ success: false, error: 'Error enviando el correo electrónico.' });
    }

    return res.status(200).json({ success: true, message: 'Consulta enviada correctamente.' });
  } catch (error) {
    console.error('Error procesando formulario:', error);
    return res.status(500).json({ success: false, error: 'Hubo un error del servidor.' });
  }
}
