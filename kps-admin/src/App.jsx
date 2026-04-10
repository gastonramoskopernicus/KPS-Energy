import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [token, setToken] = useState('Bearer 1234'); // Bypass provisorio
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const logout = () => {
    alert('Login deshabilitado temporalmente para pruebas.');
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetch('/api/admin/leads', {
        headers: {
          'Authorization': token
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLeads(data.data);
        } else {
          if(data.error === 'Unauthorized') logout();
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    }
  }, [token]);

  // Login forms removed

  return (
    <div className="admin-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>KPS Energy</h2>
        </div>
        <ul className="sidebar-menu">
          <li className="active">Leads & Cotizaciones</li>
          <li onClick={() => alert('Próximamente: CRUD de Inventario')}>Inventario (Paneles)</li>
          <li onClick={logout} style={{marginTop: "auto", borderTop: "1px solid var(--divider)"}}>Cerrar Sesión</li>
        </ul>
      </div>
      <div className="main-content">
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px"}}>
          <h2>Leads Comerciales</h2>
          <span style={{color: "var(--text-muted)"}}>{leads.length} Leads registrados</span>
        </div>

        {loading ? (
          <p>Cargando información desde la base de datos segura...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Contacto</th>
                <th>Origen</th>
                <th>Recomendación (kWp)</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: "center"}}>No hay leads todavía. ¡Probá la calculadora web!</td></tr>
              ) : (
                leads.map(lead => (
                  <tr key={lead.id}>
                    <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td style={{fontWeight: 600}}>{lead.name}</td>
                    <td>
                      <div>{lead.email}</div>
                      <div style={{fontSize: "0.85rem", color: "var(--text-muted)"}}>{lead.phone} • {lead.province}</div>
                    </td>
                    <td><span className="badge">{lead.userType}</span></td>
                    <td style={{color: "var(--primary-green-dark)", fontWeight: "bold"}}>{lead.recommendedKw ? lead.recommendedKw + ' kWp' : 'No calculado'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
