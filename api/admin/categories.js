import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== 'Bearer 1234') return res.status(401).json({ error: 'Unauthorized' });

    try {
        if (req.method === 'GET') {
            const data = await prisma.category.findMany({ orderBy: { orderIndex: 'asc' } });
            return res.status(200).json({ success: true, data });
        }
        
        if (req.method === 'POST') {
            const { name, description, orderIndex } = req.body;
            const nuevo = await prisma.category.create({ data: { name, description, orderIndex: parseInt(orderIndex||0) } });
            return res.status(200).json({ success: true, data: nuevo });
        }

        if (req.method === 'PUT') {
            const { id, name, description, orderIndex } = req.body;
            const actual = await prisma.category.update({ where: { id: parseInt(id) }, data: { name, description, orderIndex: parseInt(orderIndex||0) } });
            return res.status(200).json({ success: true, data: actual });
        }

        if (req.method === 'DELETE') {
            const { id } = req.body;
            await prisma.category.delete({ where: { id: parseInt(id) } });
            return res.status(200).json({ success: true });
        }
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
}
