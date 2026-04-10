import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== 'Bearer 1234') return res.status(401).json({ error: 'Unauthorized' });

    try {
        if (req.method === 'GET') {
            const data = await prisma.parameter.findMany();
            return res.status(200).json({ success: true, data });
        }

        if (req.method === 'PUT') {
            const { key, value, description } = req.body;
            const actual = await prisma.parameter.upsert({ 
                where: { key: key }, 
                update: { value: parseFloat(value), description }, 
                create: { key, value: parseFloat(value), description } 
            });
            return res.status(200).json({ success: true, data: actual });
        }
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
}
