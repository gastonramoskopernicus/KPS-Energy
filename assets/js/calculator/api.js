// api.js
// Manejo de peticiones al Backend Serverless

export const fetchDevices = async () => {
    try {
        const response = await fetch('/api/calculator');
        const data = await response.json();
        if (data.success) {
            return data.data;
        }
        throw new Error('Error al parsear dispositivos en el servidor.');
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const runCalculation = async (cart, backupHours) => {
    try {
        const response = await fetch('/api/calculator', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart, backupHours })
        });
        const data = await response.json();
        if (data.success) {
            return data.results;
        }
        throw new Error(data.error || 'Error ejecutando cálculos.');
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const submitLead = async (leadData) => {
    try {
        const response = await fetch('/api/lead_capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData)
        });
        const data = await response.json();
        return data.success;
    } catch(e) {
        console.error(e);
        return false;
    }
};
