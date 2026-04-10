// api/lead_capture.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const data = req.body;
            
            // Validaciones básicas backend
            if (!data.name || !data.email || !data.phone || !data.location) {
                return res.status(400).json({ success: false, error: 'Faltan campos obligatorios' });
            }

            console.log('--- GUARDANDO LEAD EN NEON POSTGRES ---');
            
            // Guardar en la base de datos real
            const newLead = await prisma.lead.create({
              data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                province: data.location,
                userType: "Calculadora Web",
                monthlyKwh: data.results?.totalDailyKwh ? parseFloat(data.results.totalDailyKwh) * 30 : null,
                recommendedKw: data.results?.systemKwp ? parseFloat(data.results.systemKwp) : null,
              }
            });

            console.log('Lead registrado con ID:', newLead.id);
            console.log('----------------------');

            // TODO: (Opcional) Activar Resend aquí para avisarte por mail.

            return res.status(200).json({ success: true, message: 'Lead guardado con éxito.' });
        } catch (e) {
            console.error('Error procesando lead:', e);
            return res.status(500).json({ success: false, error: 'Error del servidor al procesar el Lead' });
        }
    }
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
