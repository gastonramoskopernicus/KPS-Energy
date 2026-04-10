import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
    { name: 'Refrigeración', orderIndex: 1 },
    { name: 'Lavado', orderIndex: 2 },
    { name: 'Cocina', orderIndex: 3 },
    { name: 'Climatización', orderIndex: 4 },
    { name: 'Iluminación', orderIndex: 5 },
    { name: 'Bombeo', orderIndex: 6 },
    { name: 'Movilidad eléctrica', orderIndex: 7 },
    { name: 'Tecnología', orderIndex: 8 },
    { name: 'Seguridad', orderIndex: 9 },
    { name: 'Otros', orderIndex: 10 }
];

const DEVICES_MOCK = [
    { name: 'Heladera', categoryName: 'Refrigeración', defaultWatts: 150, defaultHoursDay: 24, icon: 'fa-cube' },
    { name: 'Freezer', categoryName: 'Refrigeración', defaultWatts: 200, defaultHoursDay: 24, icon: 'fa-icicles' },
    { name: 'Lavarropas', categoryName: 'Lavado', defaultWatts: 500, defaultHoursDay: 1, icon: 'fa-jug-detergent' },
    { name: 'Microondas', categoryName: 'Cocina', defaultWatts: 800, defaultHoursDay: 0.5, icon: 'fa-fire-burner' },
    { name: 'Aire Acondicionado', categoryName: 'Climatización', defaultWatts: 1200, defaultHoursDay: 6, icon: 'fa-snowflake' },
    { name: 'Luces LED', categoryName: 'Iluminación', defaultWatts: 15, defaultHoursDay: 6, icon: 'fa-lightbulb' },
    { name: 'Bomba de agua', categoryName: 'Bombeo', defaultWatts: 750, defaultHoursDay: 1, icon: 'fa-water' },
    { name: 'Cargador Auto Eléctrico', categoryName: 'Movilidad eléctrica', defaultWatts: 7000, defaultHoursDay: 4, icon: 'fa-car-battery' },
    { name: 'TV', categoryName: 'Tecnología', defaultWatts: 100, defaultHoursDay: 4, icon: 'fa-tv' },
    { name: 'Notebook', categoryName: 'Tecnología', defaultWatts: 60, defaultHoursDay: 6, icon: 'fa-laptop' },
    { name: 'Router WiFi', categoryName: 'Tecnología', defaultWatts: 15, defaultHoursDay: 24, icon: 'fa-wifi' },
    { name: 'Cámaras', categoryName: 'Seguridad', defaultWatts: 20, defaultHoursDay: 24, icon: 'fa-video' },
    { name: 'Otros (A definir)', categoryName: 'Otros', defaultWatts: 0, defaultHoursDay: 0, icon: 'fa-plug' }
];

const PRODUCTS_MOCK = [
    { type: 'panel', name: 'Panel Solar 550W Monocristalino', capacity: 550, brand: 'Generico', surfaceM2: 2.5, price: 150000 },
    { type: 'battery', name: 'Batería Litio 48V 100Ah', capacity: 4.8, brand: 'Pylontech', price: 1800000 }
];

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo no permitido. Usa POST.' });
    
    // Auth Token Protection for Admin Seed
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== 'Bearer 1234') {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        console.log('Iniciando Seeding de base de datos...');
        
        // 1. Params
        await prisma.parameter.upsert({ where: { key: 'horaSolarPico' }, update: {}, create: { key: 'horaSolarPico', value: 4.5, description: 'Horas de Sol Pico en Argentina' } });
        await prisma.parameter.upsert({ where: { key: 'eficienciaSistema' }, update: {}, create: { key: 'eficienciaSistema', value: 0.8, description: 'Eficiencia global descontando cableado' } });
        await prisma.parameter.upsert({ where: { key: 'margenEstructural' }, update: {}, create: { key: 'margenEstructural', value: 1.30, description: 'Muliplicador para precio preliminar (+30%)' } });

        // 2. Categories
        for (const cat of CATEGORIES) {
            const existing = await prisma.category.findFirst({ where: { name: cat.name } });
            if (!existing) {
                await prisma.category.create({ data: cat });
            }
        }

        // 3. Devices
        const allCats = await prisma.category.findMany();
        for (const dev of DEVICES_MOCK) {
            const existing = await prisma.device.findFirst({ where: { name: dev.name } });
            if (!existing) {
                const parentCat = allCats.find(c => c.name === dev.categoryName);
                if (parentCat) {
                    await prisma.device.create({
                        data: {
                            name: dev.name,
                            categoryId: parentCat.id,
                            defaultWatts: dev.defaultWatts,
                            defaultHoursDay: dev.defaultHoursDay,
                            icon: dev.icon,
                            isActive: true
                        }
                    });
                }
            }
        }

        // 4. Products
        for (const p of PRODUCTS_MOCK) {
            const existing = await prisma.product.findFirst({ where: { name: p.name } });
            if(!existing) {
                await prisma.product.create({ data: p });
            }
        }

        return res.status(200).json({ success: true, message: 'Base de Datos inicializada correctamente con datos semilla.' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, error: e.message });
    }
}
