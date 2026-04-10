import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== 'Bearer 1234') { // Usamos el token estático simple por ahora
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const leads = await prisma.lead.findMany({
                orderBy: { createdAt: 'desc' },
                take: 50 // Limitamos a últimos 50
            });
            return res.status(200).json({ success: true, data: leads });
        } catch (e) {
            console.error('Admin API Fetch Error:', e);
            return res.status(500).json({ success: false, error: 'DB Fetch Error' });
        }
    }
    
    return res.status(405).json({ success: false, error: 'Method not allowed' });
}
