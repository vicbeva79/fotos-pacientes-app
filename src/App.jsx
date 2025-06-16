import { useState } from 'react';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(null);

  // Añadir paciente con sesiones vacías
  const addPatient = (patient) => {
    setPatients(prev => [...prev, { ...patient, sesiones: [] }]);
  };

  // Crear nueva sesión para el paciente seleccionado
  const addSessionToPatient = () => {
    if (selectedPatientIndex === null) return;
    const newSession = {
      fecha: new Date().toISOString(),
      fotos: []
    };
    setPatients(prev => prev.map((p, idx) =>
      idx === selectedPatientIndex
        ? { ...p, sesiones: [...p.sesiones, newSession] }
        : p
    ));
  };

  // Añadir foto a una sesión específica
  const addPhotoToSession = (sessionIdx, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      setPatients(prev => prev.map((p, pIdx) => {
        if (pIdx !== selectedPatientIndex) return p;
        return {
          ...p,
          sesiones: p.sesiones.map((s, sIdx) =>
            sIdx === sessionIdx
              ? { ...s, fotos: [...s.fotos, { data: imageData }] }
              : s
          )
        };
      }));
    };
    reader.readAsDataURL(file);
  };

  const selectedPatient =
    selectedPatientIndex !== null ? patients[selectedPatientIndex] : null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Gestión de Pacientes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <PatientForm onAddPatient={addPatient} />
        <PatientList patients={patients} onSelect={setSelectedPatientIndex} selectedIndex={selectedPatientIndex} />
      </div>
      {selectedPatient && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
          <h2 className="text-xl font-bold mb-4">Sesiones de {selectedPatient.nombre} {selectedPatient.apellidos}</h2>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
            onClick={addSessionToPatient}
          >
            Crear nueva sesión
          </button>
          {selectedPatient.sesiones.length === 0 ? (
            <p className="text-gray-500">No hay sesiones para este paciente.</p>
          ) : (
            <ul className="list-disc pl-5">
              {selectedPatient.sesiones.map((sesion, idx) => (
                <li key={idx} className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span>
                      Sesión {idx + 1} - {new Date(sesion.fecha).toLocaleString()} ({sesion.fotos.length} fotos)
                    </span>
                    <label className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded cursor-pointer ml-4">
                      Añadir foto
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            addPhotoToSession(idx, e.target.files[0]);
                            e.target.value = null;
                          }
                        }}
                      />
                    </label>
                  </div>
                  {sesion.fotos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {sesion.fotos.map((foto, fIdx) => (
                        <img
                          key={fIdx}
                          src={foto.data}
                          alt={`Foto ${fIdx + 1}`}
                          className="w-20 h-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;