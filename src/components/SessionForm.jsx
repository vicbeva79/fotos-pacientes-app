import React, { useState, useEffect } from 'react';

function SessionForm({ session, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: new Date().toISOString().split('T')[0],
    comentarios: ''
  });

  useEffect(() => {
    if (session) {
      setFormData({
        nombre: session.nombre || '',
        fecha: session.fecha ? new Date(session.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        comentarios: session.comentarios || ''
      });
    }
  }, [session]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      fecha: new Date(formData.fecha).toISOString(),
      fotos: session?.fotos || []
    });
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
        {session ? 'Editar Sesión' : 'Nueva Sesión'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre de la Sesión
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Primera visita, Control, etc."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
            Fecha
          </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="comentarios" className="block text-sm font-medium text-gray-700">
            Comentarios
          </label>
          <textarea
            id="comentarios"
            name="comentarios"
            value={formData.comentarios}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
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
            {session ? 'Guardar Cambios' : 'Crear Sesión'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SessionForm; 