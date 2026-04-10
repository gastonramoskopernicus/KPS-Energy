// state.js
import { fetchDevices, runCalculation } from './api.js';

export const state = {
    isReady: false,
    backupHours: 12,
    devices: [],
    cart: {},
    calculationResults: null
};

export const loadInitialData = async () => {
    const apiDevices = await fetchDevices();
    if(apiDevices && apiDevices.length > 0) {
        state.devices = apiDevices;
    }
    state.isReady = true;
};

export const getCartQuantity = (deviceId) => state.cart[deviceId] || 0;

export const addToCart = (deviceId) => {
    state.cart[deviceId] = getCartQuantity(deviceId) + 1;
};

export const removeFromCart = (deviceId) => {
    if (state.cart[deviceId] > 0) {
        state.cart[deviceId]--;
        if(state.cart[deviceId] === 0) {
            delete state.cart[deviceId];
        }
    }
};

export const setBackupHours = (hours) => {
    state.backupHours = hours;
};

export const calculateTotals = () => {
    let totalWatts = 0;
    let totalItems = 0;
    
    state.devices.forEach(device => {
        const qty = getCartQuantity(device.id);
        if (qty > 0) {
            totalItems += qty;
            totalWatts += device.watts * qty;
        }
    });
    
    return { totalWatts, totalItems };
};

export const performBackendCalculation = async () => {
    const res = await runCalculation(state.cart, state.backupHours);
    if (res) {
        state.calculationResults = res;
        return true;
    }
    return false;
};
