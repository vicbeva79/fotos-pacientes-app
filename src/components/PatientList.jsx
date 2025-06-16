function PatientList({ patients, onSelect, selectedIndex }) {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
      <h2 className="text-2xl font-bold mb-4">Lista de Pacientes</h2>
      {patients.length === 0 ? (
        <p className="text-gray-500">No hay pacientes registrados.</p>
      ) : (
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Ficha</th>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Apellidos</th>
              <th className="py-2 px-4 border-b">Doctor</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p, idx) => (
              <tr
                key={idx}
                className={`cursor-pointer ${selectedIndex === idx ? 'bg-blue-100' : ''}`}
                onClick={() => onSelect(idx)}
              >
                <td className="py-2 px-4 border-b">{p.ficha}</td>
                <td className="py-2 px-4 border-b">{p.nombre}</td>
                <td className="py-2 px-4 border-b">{p.apellidos}</td>
                <td className="py-2 px-4 border-b">{p.doctor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PatientList;
