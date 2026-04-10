// API backend para KPS Energy - Calculadora Solar

const INITIAL_DATA = {
    settings: {
        horaSolarPico: 4.5, // HSP Argentina promedio
        eficienciaSistema: 0.8, // Pérdidas
        voltajeBateria: 48,
    },
    inventory: {
        panels: [
            { id: 'p1', name: 'Panel Solar 550W', power: 550, price: 150000, width: 1.13, height: 2.27 },
        ],
        batteries: [
            { id: 'b1', name: 'Batería Litio 48V 100Ah (4.8kWh)', capacityKwh: 4.8, price: 1800000 }
        ]
    },
    devices: [
        { id: 'ref_heladera', name: 'Heladera', category: 'Refrigeración', watts: 150, defaultHours: 24, icon: 'fa-cube' },
        { id: 'ref_freezer', name: 'Freezer', category: 'Refrigeración', watts: 200, defaultHours: 24, icon: 'fa-icicles' },
        
        { id: 'lav_lava', name: 'Lavarropas', category: 'Lavado', watts: 500, defaultHours: 1, icon: 'fa-jug-detergent' },
        
        { id: 'coc_micro', name: 'Microondas', category: 'Cocina', watts: 800, defaultHours: 0.5, icon: 'fa-fire-burner' },
        { id: 'coc_horno', name: 'Horno Eléctrico', category: 'Cocina', watts: 2000, defaultHours: 1, icon: 'fa-temperature-high' },
        
        { id: 'cli_aire', name: 'Aire Acondicionado', category: 'Climatización', watts: 1200, defaultHours: 6, icon: 'fa-snowflake' },
        { id: 'cli_venti', name: 'Ventilador', category: 'Climatización', watts: 60, defaultHours: 8, icon: 'fa-fan' },
        
        { id: 'ilu_led', name: 'Luces LED', category: 'Iluminación', watts: 15, defaultHours: 6, icon: 'fa-lightbulb' },
        
        { id: 'bom_agua', name: 'Bomba de agua', category: 'Bombeo', watts: 750, defaultHours: 1, icon: 'fa-water' },
        
        { id: 'mov_auto', name: 'Cargador Auto Eléctrico', category: 'Movilidad eléctrica', watts: 7000, defaultHours: 4, icon: 'fa-car-battery' },
        
        { id: 'tec_tv', name: 'TV', category: 'Tecnología', watts: 100, defaultHours: 4, icon: 'fa-tv' },
        { id: 'tec_note', name: 'Notebook', category: 'Tecnología', watts: 60, defaultHours: 6, icon: 'fa-laptop' },
        { id: 'tec_router', name: 'Router WiFi', category: 'Tecnología', watts: 15, defaultHours: 24, icon: 'fa-wifi' },
        
        { id: 'seg_cam', name: 'Cámaras', category: 'Seguridad', watts: 20, defaultHours: 24, icon: 'fa-video' },
        
        { id: 'other', name: 'Otros (A definir)', category: 'Otros', watts: 0, defaultHours: 0, icon: 'fa-plug' }
    ]
};

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Enviar datos iniciales
        return res.status(200).json({ success: true, data: INITIAL_DATA.devices });
    }

    if (req.method === 'POST') {
        // Run Calculation Logic
        const { cart, backupHours } = req.body;
        
        if (!cart || Object.keys(cart).length === 0) {
            return res.status(400).json({ success: false, error: 'Calculadora vacía.' });
        }

        let totalWatts = 0;
        let totalWhPerDay = 0;
        
        // Summatory
        Object.keys(cart).forEach(deviceId => {
            const qty = cart[deviceId];
            const baseDevice = INITIAL_DATA.devices.find(d => d.id === deviceId);
            
            if (baseDevice) {
                totalWatts += baseDevice.watts * qty;
                totalWhPerDay += (baseDevice.watts * baseDevice.defaultHours * qty);
            }
        });

        // Backend Rules:
        const { horaSolarPico, eficienciaSistema } = INITIAL_DATA.settings;
        
        // 1. Energía Diaria con Factor Pérdida
        const energiaRequeridaDiariaWh = totalWhPerDay / eficienciaSistema;
        
        // 2. Potencia de paneles necesaria
        // potencia panales = EnergiaRequerida / HSP
        const potenciaPanelesW = energiaRequeridaDiariaWh / horaSolarPico;
        
        // 3. Estimar Paneles Exactos
        const panelType = INITIAL_DATA.inventory.panels[0]; 
        const cantPaneles = Math.ceil(potenciaPanelesW / panelType.power);
        const areaPorPanel = panelType.width * panelType.height;
        const totalSuperficie = cantPaneles * areaPorPanel;
        
        // 4. Estimar Baterías
        // Capacidad Banco = (Energia Diaria * backupHours / 24)
        // Ejemplo si consumimos 10kwh al día, un backup de 12hs necesitaria 5kwh
        const energiaBackupRequeridaWh = energiaRequeridaDiariaWh * (backupHours / 24);
        const bateriaType = INITIAL_DATA.inventory.batteries[0];
        const cantBaterias = Math.ceil(energiaBackupRequeridaWh / (bateriaType.capacityKwh * 1000));
        
        // 5. Costo Estimado Preliminar
        const baseCost = (cantPaneles * panelType.price) + (cantBaterias * bateriaType.price);
        // Add 30% margin for inverter, cables and struct
        const totalEstimatedCents = baseCost * 1.30; 

        return res.status(200).json({
            success: true,
            results: {
                totalWatts,
                totalDailyKwh: (totalWhPerDay / 1000).toFixed(1),
                systemKwp: (cantPaneles * panelType.power / 1000).toFixed(1),
                panels: {
                    count: cantPaneles || 0,
                    powerItem: panelType.power,
                    surfaceM2: totalSuperficie.toFixed(1)
                },
                batteries: {
                    count: cantBaterias || 0,
                    capacityTotal: (cantBaterias * bateriaType.capacityKwh).toFixed(1)
                },
                estimatedCostUsd: (totalEstimatedCents / 1000).toFixed(0) // Mocking USD conversion safely visually
            }
        });
    }

    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
