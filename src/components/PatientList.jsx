import React from 'react';

function PatientList({ patients, onSelectPatient, onEditPatient }) {
  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pacientes</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza añadiendo un nuevo paciente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {patients.map((patient) => (
        <div
          key={patient.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onSelectPatient(patient)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {patient.nombre} {patient.apellidos}
              </h3>
              <p className="text-sm text-gray-600">Ficha: {patient.ficha}</p>
              <p className="text-sm text-gray-600">Doctor: {patient.doctor}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditPatient(patient);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Editar
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {patient.photos ? `${patient.photos.length} fotos` : 'Sin fotos'}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PatientList;
