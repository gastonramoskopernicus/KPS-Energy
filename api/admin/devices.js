import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== 'Bearer 1234') return res.status(401).json({ error: 'Unauthorized' });

    try {
        if (req.method === 'GET') {
            const data = await prisma.device.findMany({ 
                include: { category: true }, 
                orderBy: [ { categoryId: 'asc' }, { orderIndex: 'asc' } ] 
            });
            return res.status(200).json({ success: true, data });
        }
        
        if (req.method === 'POST') {
            const { name, categoryId, defaultWatts, defaultHoursDay, icon, description, unitType, isActive, orderIndex } = req.body;
            const nuevo = await prisma.device.create({ 
                data: { name, categoryId: parseInt(categoryId), defaultWatts: parseFloat(defaultWatts), defaultHoursDay: parseFloat(defaultHoursDay), icon: icon || 'fa-plug', description, unitType, isActive: !!isActive, orderIndex: parseInt(orderIndex||0) } 
            });
            return res.status(200).json({ success: true, data: nuevo });
        }

        if (req.method === 'PUT') {
            const { id, name, categoryId, defaultWatts, defaultHoursDay, icon, description, unitType, isActive, orderIndex } = req.body;
            const actual = await prisma.device.update({ 
                where: { id: parseInt(id) }, 
                data: { name, categoryId: parseInt(categoryId), defaultWatts: parseFloat(defaultWatts), defaultHoursDay: parseFloat(defaultHoursDay), icon, description, unitType, isActive: !!isActive, orderIndex: parseInt(orderIndex||0) } 
            });
            return res.status(200).json({ success: true, data: actual });
        }

        if (req.method === 'DELETE') {
            const { id } = req.body;
            await prisma.device.delete({ where: { id: parseInt(id) } });
            return res.status(200).json({ success: true });
        }
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
}
