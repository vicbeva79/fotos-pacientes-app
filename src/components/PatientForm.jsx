import React, { useState, useEffect } from 'react';

const DOCTORS = [
  "Dr. David Carralero",
  "Dra. Eva Tormo",
  "Dra. Lucía Sanchis",
  "Dra. Marta Piquer",
  "Dra. Ángela Martín",
  "Dra. Marina Marco",
  "Dra. Sara Macias",
  "Dr. Nicolás Pastrana",
  "Dra. Alicia Rocher",
  "Dra. Ofelia Sánchez",
  "Dra. Lidón Pedrós",
  "Dr. Luis Martorell",
  "Dr. Didier Delmas",
  "Dra. Mª Josep Albert",
  "Dr. Eugenio Sahuquillo",
  "Dr. Carlos Trull"
];

function PatientForm({ patient, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    ficha: '',
    doctor: ''
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        nombre: patient.nombre || '',
        apellidos: patient.apellidos || '',
        ficha: patient.ficha || '',
        doctor: patient.doctor || ''
      });
    }
  }, [patient]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const patientData = {
      ...formData,
      id: patient?.id || Date.now().toString(),
      photos: patient?.photos || [],
      comments: patient?.comments || ''
    };
    onSubmit(patientData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        {patient ? 'Editar Paciente' : 'Nuevo Paciente'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">
            Apellidos
          </label>
          <input
            type="text"
            id="apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="ficha" className="block text-sm font-medium text-gray-700">
            Número de Ficha
          </label>
          <input
            type="text"
            id="ficha"
            name="ficha"
            value={formData.ficha}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
            Doctor
          </label>
          <select
            id="doctor"
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Selecciona un doctor</option>
            {DOCTORS.map((doctor) => (
              <option key={doctor} value={doctor}>
                {doctor}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {patient ? 'Guardar Cambios' : 'Crear Paciente'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PatientForm;
