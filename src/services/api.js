const API_URL = '/fotos-pacientes-app/api';

export const uploadPhoto = async (sesionId, tipo, file) => {
    const formData = new FormData();
    formData.append('sesion_id', sesionId);
    formData.append('tipo', tipo);
    formData.append('foto', file);

    const response = await fetch(`${API_URL}/fotos.php`, {
        method: 'POST',
        body: formData
    });

    return response.json();
};

export const getPhotos = async (sesionId) => {
    const response = await fetch(`${API_URL}/fotos.php?sesion_id=${sesionId}`);
    return response.json();
};

export const deletePhoto = async (id) => {
    const response = await fetch(`${API_URL}/fotos.php`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${id}`
    });

    return response.json();
}; 

// --- Pacientes ---
export const getPatients = async () => {
  const response = await fetch('/fotos-pacientes-app/api/pacientes.php');
  return response.json();
};

export const createPatient = async (data) => {
  const response = await fetch('/fotos-pacientes-app/api/pacientes.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updatePatient = async (id, data) => {
  const response = await fetch('/fotos-pacientes-app/api/pacientes.php', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data })
  });
  return response.json();
};

export const deletePatient = async (id) => {
  const response = await fetch('/fotos-pacientes-app/api/pacientes.php', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `id=${id}`
  });
  return response.json();
};

// --- Sesiones ---
export const getSessions = async (pacienteId) => {
  const response = await fetch(`/fotos-pacientes-app/api/sesiones.php?paciente_id=${pacienteId}`);
  return response.json();
};

export const createSession = async (data) => {
  const response = await fetch('/fotos-pacientes-app/api/sesiones.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updateSession = async (id, data) => {
  const response = await fetch('/fotos-pacientes-app/api/sesiones.php', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data })
  });
  return response.json();
};

export const deleteSession = async (id) => {
  const response = await fetch('/fotos-pacientes-app/api/sesiones.php', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `id=${id}`
  });
  return response.json();
};