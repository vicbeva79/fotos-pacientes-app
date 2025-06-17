import React, { useState } from 'react';

function SessionList({ sessions = [], onSelectSession, onCreateSession, onEditSession, onDeleteSession }) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  const handleDeleteClick = (e, sessionIndex) => {
    e.stopPropagation();
    setSessionToDelete(sessionIndex);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (sessionToDelete !== null) {
      onDeleteSession(sessionToDelete);
      setShowConfirmDialog(false);
      setSessionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setSessionToDelete(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sesiones</h2>
        <button
          onClick={onCreateSession}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Nueva Sesión
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay sesiones</h3>
          <p className="mt-1 text-sm text-gray-500">Crea una nueva sesión para empezar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectSession(index)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {session.nombre || `Sesión ${index + 1}`}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(session.fecha).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSession(index);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-2">
                {session.fotos?.slice(0, 3).map((foto, fotoIndex) => (
                  <div key={fotoIndex} className="aspect-square">
                    <img
                      src={foto.data}
                      alt={`Preview ${fotoIndex + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
                {(!session.fotos || session.fotos.length === 0) && (
                  <div className="col-span-3 text-center text-gray-500 text-sm py-4">
                    Sin fotos
                  </div>
                )}
              </div>

              {session.comentarios && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {session.comentarios}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Diálogo de confirmación */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar esta sesión? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionList; 