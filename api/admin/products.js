import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== 'Bearer 1234') return res.status(401).json({ error: 'Unauthorized' });

    try {
        if (req.method === 'GET') {
            const data = await prisma.product.findMany({ orderBy: { id: 'asc' } });
            return res.status(200).json({ success: true, data });
        }
        
        if (req.method === 'POST') {
            const { type, name, capacity, brand, model, dimensions, surfaceM2, efficiency, price, isActive } = req.body;
            const nuevo = await prisma.product.create({ 
                data: { type, name, capacity: parseFloat(capacity), brand, model, dimensions, surfaceM2: surfaceM2 ? parseFloat(surfaceM2) : null, efficiency: efficiency ? parseFloat(efficiency) : null, price: price ? parseFloat(price) : null, isActive: !!isActive } 
            });
            return res.status(200).json({ success: true, data: nuevo });
        }

        if (req.method === 'PUT') {
            const { id, type, name, capacity, brand, model, dimensions, surfaceM2, efficiency, price, isActive } = req.body;
            const actual = await prisma.product.update({ 
                where: { id: parseInt(id) }, 
                data: { type, name, capacity: parseFloat(capacity), brand, model, dimensions, surfaceM2: surfaceM2 ? parseFloat(surfaceM2) : null, efficiency: efficiency ? parseFloat(efficiency) : null, price: price ? parseFloat(price) : null, isActive: !!isActive } 
            });
            return res.status(200).json({ success: true, data: actual });
        }

        if (req.method === 'DELETE') {
            const { id } = req.body;
            await prisma.product.delete({ where: { id: parseInt(id) } });
            return res.status(200).json({ success: true });
        }
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
}
