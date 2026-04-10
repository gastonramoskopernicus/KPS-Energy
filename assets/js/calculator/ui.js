// ui.js
import { state, loadInitialData, getCartQuantity, addToCart, removeFromCart, setBackupHours, calculateTotals, performBackendCalculation } from './state.js';

export const initAndRender = async () => {
    const appEl = document.getElementById('calc-step-content');
    if (!appEl) return;

    appEl.innerHTML = `
        <div class="text-center" style="padding: 50px;">
            <i class="fas fa-circle-notch fa-spin" style="font-size: 3rem; color: var(--primary-green);"></i>
            <p style="margin-top:20px; font-weight:600;">Conectando con KPS Energy...</p>
        </div>
    `;

    await loadInitialData();
    renderStep1(appEl);
};

const renderStep1 = (appEl) => {
    appEl.innerHTML = `
        <div class="text-center" style="margin-bottom: 30px;">
            <span class="section-tag">Paso 1: Consumos</span>
            <h2 style="font-size: 1.8rem;">Seleccioná tus equipos</h2>
            <p style="color: var(--text-muted); font-size:0.9rem;">El algoritmo de KPS Energy dimensionará tu sistema solar ideal según esta lista y el inventario disponible.</p>
        </div>

        <div class="form-group" style="margin-bottom: 30px; background: var(--bg-light); padding: 20px; border-radius: 12px; border: 1px solid var(--divider);">
            <label style="font-weight: 700; display: block; margin-bottom: 12px; font-size:1.1rem;">
                <i class="fas fa-battery-full" style="color: var(--primary-green); margin-right:8px;"></i>Horas de Autonomía de Baterías
            </label>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px;">¿Cuánto tiempo estimás depender exclusivamente del backup de baterías frente a cortes de red?</p>
            <div style="display: flex; gap: 15px;">
                <button class="btn ${state.backupHours === 12 ? 'btn-primary' : 'btn-outline'} backup-btn" data-hours="12" style="flex: 1; padding: 10px;">Medio día (12 Horas)</button>
                <button class="btn ${state.backupHours === 24 ? 'btn-primary' : 'btn-outline'} backup-btn" data-hours="24" style="flex: 1; padding: 10px;">Día entero (24 Horas)</button>
            </div>
        </div>
        
        <h3 style="margin-bottom: 20px; font-weight: 700; font-size: 1.2rem; border-bottom: 1px solid var(--divider); padding-bottom: 10px;">Catálogo de Consumos</h3>
        <div class="device-grid" id="device-grid"></div>
        
        <div id="calc-sticky-footer-container"></div>
    `;

    renderDeviceGrid();
    renderStickyFooter();
    setupEventListenersStep1(appEl);
};

const renderDeviceGrid = () => {
    const gridEl = document.getElementById('device-grid');
    if (!gridEl) return;
    
    let html = '';
    // Agrupar visualmente o mostrar flat, flat por simplidicidad pero ordenado
    state.devices.forEach(device => {
        const qty = getCartQuantity(device.id);
        const isActive = qty > 0;
        const isOther = device.id === 'other';
        const wattsText = isOther ? 'Consumo a definir' : `${device.watts}W`;

        html += `
            <div class="device-card ${isActive ? 'active' : ''}">
                <div class="device-info">
                    <i class="fas ${device.icon} device-icon"></i>
                    <div>
                        <div class="device-name">${device.name}</div>
                        <div class="device-meta">${device.category} &bull; ${wattsText}</div>
                    </div>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn calc-minus" data-id="${device.id}"><i class="fas fa-minus"></i></button>
                    <span class="qty-display">${qty}</span>
                    <button class="qty-btn calc-plus" data-id="${device.id}"><i class="fas fa-plus"></i></button>
                </div>
            </div>
        `;
    });
    
    gridEl.innerHTML = html;
};

const renderStickyFooter = () => {
    const isStep2 = state.calculationResults !== null;
    if (isStep2) return; // Hide standard footer if we moved on

    let footerEl = document.getElementById('calc-sticky-footer');
    const appContainer = document.getElementById('calc-sticky-footer-container');
    
    if (!footerEl) {
        footerEl = document.createElement('div');
        footerEl.id = 'calc-sticky-footer';
        footerEl.className = 'calc-sticky-footer';
        if(appContainer) appContainer.appendChild(footerEl);
    }
    
    const totals = calculateTotals();
    const hasItems = totals.totalItems > 0;
    const btnState = hasItems ? '' : 'disabled style="opacity: 0.5; cursor: not-allowed;"';
    
    let resultText = "Calculando...";
    if(!hasItems) {
        resultText = "Agregá consumos al carrito";
    } else {
        resultText = "Dimensionamiento listo";
    }

    footerEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 20px;">
            <div style="background: rgba(46, 204, 113, 0.2); width: 45px; height: 45px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--primary-green-dark); font-size: 1.2rem;">
                <i class="fas fa-bolt"></i>
            </div>
            <div>
                <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-main); margin-bottom: 2px;">
                    ${totals.totalItems} Equipo${totals.totalItems !== 1 ? 's' : ''} <span style="color: var(--text-muted); font-weight: 400; font-size: 0.85rem; margin-left: 5px;">(~${totals.totalWatts}W totales)</span>
                </div>
                <div style="font-size: 0.85rem; color: var(--primary-green-dark); font-weight: 600;">
                    ${resultText}
                </div>
            </div>
        </div>
        <div class="footer-action">
            <button class="btn btn-primary" id="calc-continue-btn" ${btnState}>Calcular Sistema <i class="fas fa-magic" style="margin-left: 5px;"></i></button>
        </div>
    `;
};

const renderStep2 = (appEl) => {
    const res = state.calculationResults;
    if (!res) return;

    // Eliminar sticky footer viejo
    const footerContainer = document.getElementById('calc-sticky-footer-container');
    if (footerContainer) footerContainer.innerHTML = '';

    appEl.innerHTML = `
        <div style="text-align:center; margin-bottom: 30px;">
            <span class="section-tag">Paso 2: Solución KPS Energy</span>
            <h2 style="font-size: 2rem; color: var(--text-main);">Tu Sistema Ideal Recomendado</h2>
            <p style="color: var(--text-muted);">Basado en tus selecciones de consumo interactivo.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 40px;">
            <div style="background: var(--bg-light); border: 1px solid var(--primary-green); padding: 30px; border-radius: 12px; text-align: center;">
                <i class="fas fa-solar-panel" style="font-size: 2.5rem; color: var(--primary-green); margin-bottom:15px;"></i>
                <h3 style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 5px;">Potencia Panel Solar</h3>
                <p style="font-size: 2.2rem; font-weight: 800; color: var(--text-main); margin-bottom: 5px;">${res.panels.count} <span style="font-size:1rem; font-weight:400;">Paneles de ${res.panels.powerItem}W</span></p>
                <p style="font-size: 0.85rem; background: var(--bg-white); border: 1px solid var(--divider); padding: 5px 10px; border-radius: 20px; display:inline-block;">Requiere <strong>${res.panels.surfaceM2}m²</strong> de techo libre</p>
            </div>

            <div style="background: var(--bg-light); border: 1px solid var(--primary-green); padding: 30px; border-radius: 12px; text-align: center;">
                <i class="fas fa-car-battery" style="font-size: 2.5rem; color: var(--primary-green); margin-bottom:15px;"></i>
                <h3 style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 5px;">Almacenamiento (Baterías)</h3>
                <p style="font-size: 2.2rem; font-weight: 800; color: var(--text-main); margin-bottom: 5px;">${res.batteries.count} <span style="font-size:1rem; font-weight:400;">packs Litio 48V</span></p>
                <p style="font-size: 0.85rem; background: var(--bg-white); border: 1px solid var(--divider); padding: 5px 10px; border-radius: 20px; display:inline-block;">Total de almacenamiento: <strong>${res.batteries.capacityTotal} kWh</strong></p>
            </div>
        </div>

        <div style="background: var(--bg-white); border: 1px solid var(--divider); padding: 25px; border-radius: 12px; margin-bottom: 30px;">
            <h4 style="font-size: 1.2rem; margin-bottom: 15px;">Resumen Energético del Algoritmo</h4>
            <ul style="list-style:none; line-height: 2;">
                <li><i class="fas fa-check" style="color:var(--primary-green); margin-right: 10px;"></i><strong>Total Máximo de Watts en simultáneo:</strong> ${res.totalWatts} W</li>
                <li><i class="fas fa-check" style="color:var(--primary-green); margin-right: 10px;"></i><strong>Consumo estimado diario:</strong> ${res.totalDailyKwh} kWh / día</li>
                <li><i class="fas fa-check" style="color:var(--primary-green); margin-right: 10px;"></i><strong>Inversor / Capacidad Instalada Recomendada:</strong> Sistema de ${res.systemKwp} kWp</li>
            </ul>
        </div>

        <div style="text-align:center; padding: 20px; background: rgba(0,0,0,0.02); border-radius: 8px; margin-bottom: 40px;">
            <p style="font-size: 1.5rem; font-weight: 700; margin-bottom: 10px;">Costo estimado: USD ${res.estimatedCostUsd}</p>
            <p style="font-size: 0.8rem; color: var(--text-muted); max-width: 600px; margin: 0 auto;">
                <strong>Aviso Comercial:</strong> Esta es una estimación preliminar automática. El costo real puede variar drásticamente según la complejidad de la instalación en tu techo, tipo de inversor definitivo, protecciones térmicas de tablero, y costos operativos.
            </p>
        </div>

        <div class="text-center" id="step2-actions">
            <button class="btn btn-outline" id="calc-restart-btn" style="margin-right: 15px;">Volver a modificar</button>
            <button class="btn btn-primary" id="calc-show-form-btn">Contactar a un especialista sin costo</button>
        </div>

        <div id="lead-form-container" style="display:none; margin-top: 40px; background: var(--bg-light); border: 1px solid var(--divider); padding: 30px; border-radius: 12px; text-align: left;">
            <h4 style="font-size: 1.3rem; margin-bottom: 20px;">Completá tus datos para recibir la propuesta base</h4>
            <form id="solar-lead-form" style="display:grid; gap: 20px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="form-group">
                        <label style="display:block; margin-bottom: 5px; font-weight:600;">Nombre y Apellido *</label>
                        <input type="text" id="lead-name" required style="width:100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                    </div>
                    <div class="form-group">
                        <label style="display:block; margin-bottom: 5px; font-weight:600;">Teléfono *</label>
                        <input type="text" id="lead-phone" required style="width:100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="form-group">
                        <label style="display:block; margin-bottom: 5px; font-weight:600;">Email *</label>
                        <input type="email" id="lead-email" required style="width:100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                    </div>
                    <div class="form-group">
                        <label style="display:block; margin-bottom: 5px; font-weight:600;">Ubicación / Provincia *</label>
                        <input type="text" id="lead-location" required style="width:100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                    </div>
                </div>
                <div class="form-group">
                    <label style="display:block; margin-bottom: 5px; font-weight:600;">Comentarios adicionales</label>
                    <textarea id="lead-comments" rows="3" style="width:100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; resize:vertical;"></textarea>
                </div>
                <button type="submit" class="btn btn-primary" id="lead-submit-btn" style="padding: 15px; font-size: 1.1rem; width: 100%;">Solicitar asesoramiento</button>
            </form>
        </div>

        <div id="lead-success-container" style="display:none; margin-top: 40px; text-align: center; padding: 40px; background: var(--primary-green-light); border-radius: 12px;">
            <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--primary-green-dark); margin-bottom: 20px;"></i>
            <h4 style="font-size: 1.5rem; margin-bottom: 10px; color: var(--primary-green-dark);">¡Tu solicitud fue enviada!</h4>
            <p style="color: var(--text-main);">Un especialista revisará la estimación exacta para tu ubicación y se comunicará a la brevedad.</p>
        </div>
    `;

    // Event listeners del Paso 2
    document.getElementById('calc-restart-btn').addEventListener('click', () => {
        state.calculationResults = null;
        renderStep1(appEl);
    });

    document.getElementById('calc-show-form-btn').addEventListener('click', () => {
        document.getElementById('step2-actions').style.display = 'none';
        document.getElementById('lead-form-container').style.display = 'block';
    });

    document.getElementById('solar-lead-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('lead-submit-btn');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        const { submitLead } = await import('./api.js'); // dynamic import or rely on closure
        
        const leadData = {
            name: document.getElementById('lead-name').value,
            phone: document.getElementById('lead-phone').value,
            email: document.getElementById('lead-email').value,
            location: document.getElementById('lead-location').value,
            comments: document.getElementById('lead-comments').value,
            results: state.calculationResults,
            cart: state.cart
        };

        const success = await submitLead(leadData);
        if (success) {
            document.getElementById('lead-form-container').style.display = 'none';
            document.getElementById('lead-success-container').style.display = 'block';
        } else {
            alert('Hubo un error al enviar tu solicitud. Inténtalo de nuevo más tarde.');
            submitBtn.innerHTML = 'Solicitar asesoramiento';
            submitBtn.disabled = false;
        }
    });
};

const setupEventListenersStep1 = (appEl) => {
    appEl.addEventListener('click', async (e) => {
        if(state.calculationResults !== null) return; // already step 2

        const plusBtn = e.target.closest('.calc-plus');
        if (plusBtn) {
            addToCart(plusBtn.dataset.id);
            updateUI();
        }
        
        const minusBtn = e.target.closest('.calc-minus');
        if (minusBtn) {
            removeFromCart(minusBtn.dataset.id);
            updateUI();
        }
        
        const backupBtn = e.target.closest('.backup-btn');
        if (backupBtn) {
            setBackupHours(parseInt(backupBtn.dataset.hours, 10));
            renderStep1(appEl);
        }

        const continueBtn = e.target.closest('#calc-continue-btn');
        if (continueBtn && !continueBtn.disabled) {
            // Visual feedback
            const originalText = continueBtn.innerHTML;
            continueBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            continueBtn.disabled = true;

            const success = await performBackendCalculation();
            
            if (success) {
                renderStep2(appEl);
            } else {
                alert('No se pudo procesar la cotización. Asegurate de que la API de Vercel está activa.');
                continueBtn.innerHTML = originalText;
                continueBtn.disabled = false;
            }
        }
    });
};

const updateUI = () => {
    renderDeviceGrid();
    renderStickyFooter();
};
