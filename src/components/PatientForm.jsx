import { useState } from "react";

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

function PatientForm({ onAddPatient }) {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [ficha, setFicha] = useState("");
  const [doctor, setDoctor] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !apellidos || !ficha || !doctor) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    onAddPatient({ nombre, apellidos, ficha, doctor });
    setNombre("");
    setApellidos("");
    setFicha("");
    setDoctor("");
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Agregar Paciente</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nombre del paciente"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellidos">
            Apellidos
          </label>
          <input
            id="apellidos"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Apellidos del paciente"
            value={apellidos}
            onChange={e => setApellidos(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ficha">
            Número de ficha
          </label>
          <input
            id="ficha"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Número de ficha"
            value={ficha}
            onChange={e => setFicha(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="doctor">
            Doctor responsable
          </label>
          <select
            id="doctor"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={doctor}
            onChange={e => setDoctor(e.target.value)}
          >
            <option value="">Selecciona un doctor</option>
            {DOCTORS.map((doctor) => (
              <option key={doctor} value={doctor}>{doctor}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Guardar Paciente
        </button>
      </form>
    </div>
  );
}

export default PatientForm;
