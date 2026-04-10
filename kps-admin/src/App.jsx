import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [token, setToken] = useState('Bearer 1234'); // Bypass provisorio
  const [tab, setTab] = useState('leads'); // leads, devices, categories, products, config
  
  const [data, setData] = useState({ leads: [], devices: [], categories: [], products: [], parameters: [] });
  const [loading, setLoading] = useState(false);

  // States for modals
  const [modalType, setModalType] = useState(null); // 'device', 'category', 'product', 'parameter', 'seed'
  const [editItem, setEditItem] = useState(null);

  const fetchTab = async (type) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${type}`, { headers: { 'Authorization': token } });
      const json = await res.json();
      if(json.success) setData(prev => ({ ...prev, [type]: json.data }));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTab(tab);
  }, [tab, token]);

  const handleSave = async (e, endpoint, isUpdate) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    
    if(editItem && editItem.id) payload.id = editItem.id;
    
    try {
      setLoading(true);
      await fetch(`/api/admin/${endpoint}`, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Authorization': token, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setModalType(null);
      setEditItem(null);
      fetchTab(tab);
    } catch (e) {
      alert("Error guardando");
    }
  };

  const handleDelete = async (endpoint, id) => {
    if(!window.confirm("¿Seguro que deseas eliminar esto?")) return;
    try {
      setLoading(true);
      await fetch(`/api/admin/${endpoint}`, {
        method: 'DELETE',
        headers: { 'Authorization': token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchTab(tab);
    } catch(e) {
      alert("Error eliminando");
    }
  };

  const handleSeed = async () => {
    if(!window.confirm('¿Deseas poblar la base de datos con los equipos sugeridos por defecto?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST', headers: { 'Authorization': token }});
      if(res.ok) {
        alert("Seed completado con éxito");
        fetchTab('config');
      }
    } catch(e) {}
    setLoading(false);
  }

  const Modal = ({ children, title }) => (
    <div style={{position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex: 1000}}>
      <div style={{background: 'white', padding: '30px', borderRadius: '12px', width: '500px', maxHeight: '90vh', overflowY: 'auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom: '20px'}}>
          <h3 style={{color: 'var(--primary-green-dark)'}}>{title}</h3>
          <button onClick={() => {setModalType(null); setEditItem(null);}} style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer'}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="admin-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>KPS CRM Admin</h2>
        </div>
        <ul className="sidebar-menu">
          <li className={tab === 'leads' ? 'active' : ''} onClick={() => setTab('leads')}>Leads Comerciales</li>
          <li className={tab === 'devices' ? 'active' : ''} onClick={() => setTab('devices')}>Dispositivos (Calculadora)</li>
          <li className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')}>Categorías</li>
          <li className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>Inventario (Hardware)</li>
          <li className={tab === 'parameters' ? 'active' : ''} onClick={() => setTab('parameters')}>Config. Motor</li>
        </ul>
      </div>
      <div className="main-content">
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px"}}>
          <h2>{tab.toUpperCase()}</h2>
          {tab !== 'leads' && tab !== 'parameters' && (
             <button className="btn" style={{width: 'auto'}} onClick={() => {setEditItem(null); setModalType(tab);}}>+ Nuevo</button>
          )}
          {tab === 'parameters' && (
             <button className="btn" style={{width: 'auto', background: '#e67e22'}} onClick={handleSeed}>Inicializar Seed DB</button>
          )}
        </div>

        {loading && <p>Cargando información...</p>}

        {!loading && tab === 'leads' && (
          <table className="data-table">
            <thead>
              <tr><th>Fecha</th><th>Cliente</th><th>Contacto</th><th>Recomendación (kWp)</th></tr>
            </thead>
            <tbody>
              {data.leads.map(lead => (
                <tr key={lead.id}>
                  <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td style={{fontWeight: 600}}>{lead.name}</td>
                  <td>{lead.email}<br/><small>{lead.phone}</small></td>
                  <td style={{color: "var(--primary-green-dark)", fontWeight: "bold"}}>{lead.recommendedKw ? lead.recommendedKw + ' kWp' : 'No calculado'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && tab === 'categories' && (
          <table className="data-table">
            <thead><tr><th>#</th><th>Nombre</th><th>Orden</th><th>Acciones</th></tr></thead>
            <tbody>
              {data.categories.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td><td><b>{c.name}</b></td><td>{c.orderIndex}</td>
                  <td>
                    <button style={{marginRight: '10px'}} onClick={() => {setEditItem(c); setModalType('categories');}}>✏️</button>
                    <button onClick={() => handleDelete('categories', c.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && tab === 'devices' && (
          <table className="data-table">
            <thead><tr><th>Icono</th><th>Nombre</th><th>Categoría</th><th>Consumo (W)</th><th>Horas Base</th><th>Activo</th><th>Acciones</th></tr></thead>
            <tbody>
              {data.devices.map(d => (
                <tr key={d.id}>
                  <td><i className={`fas ${d.icon}`}></i></td>
                  <td><b>{d.name}</b><br/><small>{d.description}</small></td>
                  <td>{d.category?.name}</td>
                  <td>{d.defaultWatts} {d.unitType}</td>
                  <td>{d.defaultHoursDay} Hs</td>
                  <td>{d.isActive ? '✅' : '❌'}</td>
                  <td>
                    <button style={{marginRight: '10px'}} onClick={() => {setEditItem(d); setModalType('devices');}}>✏️</button>
                    <button onClick={() => handleDelete('devices', d.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && tab === 'products' && (
          <table className="data-table">
            <thead><tr><th>Tipo</th><th>Nombre</th><th>Capacidad</th><th>Precio</th><th>Acciones</th></tr></thead>
            <tbody>
              {data.products.map(p => (
                <tr key={p.id}>
                  <td><span className="badge">{p.type}</span></td>
                  <td><b>{p.name}</b><br/><small>{p.brand} {p.model}</small></td>
                  <td>{p.capacity}</td>
                  <td>${p.price}</td>
                  <td>
                    <button style={{marginRight: '10px'}} onClick={() => {setEditItem(p); setModalType('products');}}>✏️</button>
                    <button onClick={() => handleDelete('products', p.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && tab === 'parameters' && (
          <table className="data-table">
            <thead><tr><th>Llave Lógica</th><th>Valor</th><th>Descripción</th><th>Acciones</th></tr></thead>
            <tbody>
              {data.parameters.map(p => (
                <tr key={p.id}>
                  <td><b>{p.key}</b></td>
                  <td style={{color: 'var(--primary-green-dark)', fontWeight: 'bold'}}>{p.value}</td>
                  <td>{p.description}</td>
                  <td>
                     <button onClick={() => {setEditItem(p); setModalType('parameters');}}>✏️ Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalType === 'categories' && (
        <Modal title={editItem ? 'Editar Categoría' : 'Nueva Categoría'}>
          <form className="login-form" onSubmit={(e) => handleSave(e, 'categories', !!editItem)}>
            <input type="text" name="name" placeholder="Nombre (ej. Cocina)" defaultValue={editItem?.name} required />
            <input type="text" name="description" placeholder="Descripción breve" defaultValue={editItem?.description} />
            <input type="number" name="orderIndex" placeholder="Orden visual (1, 2, 3)" defaultValue={editItem?.orderIndex || 0} />
            <button className="btn" type="submit">Guardar Categoría</button>
          </form>
        </Modal>
      )}

      {modalType === 'devices' && (
        <Modal title={editItem ? 'Editar Dispositivo' : 'Nuevo Dispositivo'}>
          <form className="login-form" onSubmit={(e) => handleSave(e, 'devices', !!editItem)}>
            <input type="text" name="name" placeholder="Nombre Dispositivo" defaultValue={editItem?.name} required />
            <select name="categoryId" defaultValue={editItem?.categoryId} required style={{width: '100%', padding: '12px', marginBottom: '15px'}} onClick={() => !data.categories.length && fetchTab('categories')}>
               <option value="">-- Seleccionar Categoría --</option>
               {(data.categories.length > 0 ? data.categories : [{id: 1, name: 'Refrigeración'}, {id: 2, name: 'Lavado'}, {id:3, name: 'Cocina'}]).map(c => (
                 <option key={c.id} value={c.id}>{c.name}</option>
               ))}
            </select>
            <input type="text" name="icon" placeholder="Clase FontAwesome (ej: fa-tv)" defaultValue={editItem?.icon} required />
            <input type="number" step="0.1" name="defaultWatts" placeholder="Consumo en Watts" defaultValue={editItem?.defaultWatts} required />
            <input type="number" step="1" name="defaultHoursDay" placeholder="Horas base por día default" defaultValue={editItem?.defaultHoursDay} required />
            <input type="text" name="description" placeholder="Nota descriptiva (aprox)" defaultValue={editItem?.description} />
            <div style={{marginBottom: '15px', textAlign: 'left'}}>
              <label><input type="checkbox" name="isActive" value="true" defaultChecked={editItem ? editItem.isActive : true} /> Mostrar en la App</label>
            </div>
            <button className="btn" type="submit">Guardar Dispositivo</button>
          </form>
        </Modal>
      )}

      {modalType === 'products' && (
        <Modal title={editItem ? 'Editar Inventario' : 'Añadir Producto'}>
          <form className="login-form" onSubmit={(e) => handleSave(e, 'products', !!editItem)}>
            <select name="type" defaultValue={editItem?.type} required style={{width: '100%', padding: '12px', marginBottom: '15px'}}>
               <option value="panel">Panel Solar</option>
               <option value="battery">Banco Batería</option>
               <option value="inverter">Inversor</option>
               <option value="accessory">Accesorio Extra</option>
            </select>
            <input type="text" name="name" placeholder="Nombre Comercial" defaultValue={editItem?.name} required />
            <input type="text" name="brand" placeholder="Marca (ej. Pylontech)" defaultValue={editItem?.brand} />
            <input type="number" step="0.1" name="capacity" placeholder="Capacidad Técnica Básica (W o Kw)" defaultValue={editItem?.capacity} required />
            <input type="number" step="0.1" name="price" placeholder="Precio Base (AR$ o USD)" defaultValue={editItem?.price} />
            <div style={{marginBottom: '15px', textAlign: 'left'}}>
              <label><input type="checkbox" name="isActive" value="true" defaultChecked={editItem ? editItem.isActive : true} /> Disponible</label>
            </div>
            <button className="btn" type="submit">Guardar Producto</button>
          </form>
        </Modal>
      )}

      {modalType === 'parameters' && (
        <Modal title="Comportamiento del Algoritmo">
          <form className="login-form" onSubmit={(e) => handleSave(e, 'parameters', true)}>
            <input type="hidden" name="key" value={editItem?.key} />
            <input type="number" step="0.01" name="value" placeholder="Valor Numérico" defaultValue={editItem?.value} required />
            <input type="text" name="description" placeholder="Aclaración de variable" defaultValue={editItem?.description} />
            <button className="btn" type="submit">Hacer Efectivo en Calculadora</button>
          </form>
        </Modal>
      )}

    </div>
  );
}

export default App;
