import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { getPhotos, getPatients, createPatient, updatePatient, deletePatient, getSessions, createSession, updateSession, deleteSession } from './services/api';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';
import SessionList from './components/SessionList';
import SessionForm from './components/SessionForm';
import PhotoButtons from './components/photos/PhotoButtons';
import logoCarralero from './assets/templates/Logotipo-horizontal-Dental-Carralero.png';
import './App.css';

const PHOTO_TYPES = [
  { id: 'profile' },
  { id: 'smile' },
  { id: 'rest' },
  { id: 'mouth-open' },
  { id: 'upper-occlusal' },
  { id: 'right-lateral' },
  { id: 'intraoral' },
  { id: 'lower-occlusal' },
  { id: 'left-lateral' }
];

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'form', 'sessions', 'session-form', 'photos'
  const [photos, setPhotos] = useState([]);
  const [comments, setComments] = useState('');

  // Cargar pacientes desde la API al iniciar SOLO una vez
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const res = await getPatients();
    if (res.success) setPatients(res.data);
  };

  // Al seleccionar un paciente, cargar sus sesiones desde la API
  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    setView('sessions');
    const res = await getSessions(patient.id);
    if (res.success) setSessions(res.data);
    else setSessions([]);
  };

  // Crear sesión usando la API
  const handleAddSession = async (sessionData) => {
    const res = await createSession({ ...sessionData, paciente_id: selectedPatient.id });
    if (res.success) {
      await fetchSessions(selectedPatient.id);
    setView('sessions');
    }
  };

  // Editar sesión usando la API
  const handleEditSession = async (sessionData) => {
    const res = await updateSession(sessionData.id, sessionData);
    if (res.success) {
      await fetchSessions(selectedPatient.id);
    setView('sessions');
    }
  };

  // Eliminar sesión usando la API
  const handleDeleteSession = async (sessionId) => {
    const res = await deleteSession(sessionId);
    if (res.success) {
      await fetchSessions(selectedPatient.id);
    }
  };

  // Cargar sesiones de un paciente
  const fetchSessions = async (pacienteId) => {
    const res = await getSessions(pacienteId);
    if (res.success) setSessions(res.data);
    else setSessions([]);
  };

  // Seleccionar sesión
  const handleSelectSession = (session) => {
    if (!session) {
      setSelectedSession(null);
      setView('sessions');
      return;
    }
    setSelectedSession(session);
    setView('photos');
  };

  // Crear paciente usando la API
  const handleAddPatient = async (newPatient) => {
    const res = await createPatient(newPatient);
    if (res.success) {
      await fetchPatients();
      // Selecciona el paciente recién creado
      const created = { ...newPatient, id: res.id };
      setSelectedPatient(created);
      setView('sessions');
    }
  };

  // Editar paciente usando la API
  const handleEditPatient = async (editedPatient) => {
    const res = await updatePatient(editedPatient.id, editedPatient);
    if (res.success) {
      await fetchPatients();
      setSelectedPatient(editedPatient);
      setView('sessions');
    }
  };

  // Eliminar paciente usando la API
  const handleDeletePatient = async (id) => {
    const res = await deletePatient(id);
    if (res.success) {
      await fetchPatients();
      setSelectedPatient(null);
      setView('list');
    }
  };

  // Cargar fotos cuando se selecciona una sesión
  useEffect(() => {
    const loadPhotos = async () => {
      if (
        selectedPatient &&
        selectedSession &&
        selectedSession.id
      ) {
        try {
          const result = await getPhotos(selectedSession.id);
          if (result.success && Array.isArray(result.data)) {
            setPhotos(result.data.map(photo => ({
              id: photo.id,
              type: photo.tipo,
              data: `/uploads/${photo.ruta_archivo}`
            })));
          } else {
            setPhotos([]);
          }
        } catch (error) {
          console.error('Error al cargar las fotos:', error);
          setPhotos([]);
        }
      } else {
        setPhotos([]);
      }
    };
    loadPhotos();
  }, [selectedPatient, sessions, selectedSession]);

  const handleTakePhoto = (imageData, type) => {
    const newPhoto = { type, data: imageData };
    const updatedPhotos = photos.filter(p => p.type !== type).concat(newPhoto);
    setPhotos(updatedPhotos);

    // Actualizar las fotos en la sesión seleccionada
    if (selectedPatient && selectedSession !== null) {
      const updatedPatient = {
        ...selectedPatient,
        sesiones: selectedPatient.sesiones.map((session, idx) => {
          if (idx === sessions.findIndex(s => s.id === selectedSession.id)) {
            return {
              ...session,
              fotos: updatedPhotos,
              comentarios: comments
            };
          }
          return session;
        })
      };
      handleEditPatient(updatedPatient);
    }
  };

  const handleDeletePhoto = (type) => {
    const updatedPhotos = photos.filter(p => p.type !== type);
    setPhotos(updatedPhotos);

    // Actualizar las fotos en la sesión seleccionada
    if (selectedPatient && selectedSession !== null) {
      const updatedPatient = {
        ...selectedPatient,
        sesiones: selectedPatient.sesiones.map((session, idx) => {
          if (idx === sessions.findIndex(s => s.id === selectedSession.id)) {
            return {
              ...session,
            fotos: updatedPhotos,
            comentarios: comments
          };
          }
          return session;
        })
      };
      handleEditPatient(updatedPatient);
    }
  };

  const handleCommentsChange = async (newComments) => {
    setComments(newComments);
    if (selectedSession && selectedSession.id) {
      // Asegúrate de enviar todos los campos requeridos
      const updatedSession = {
        ...selectedSession,
        comentarios: newComments,
        nombre: selectedSession.nombre,
        fecha: selectedSession.fecha
      };
      const res = await updateSession(selectedSession.id, updatedSession);
      if (res.success) {
        await fetchSessions(selectedPatient.id);
      }
    }
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
    setSelectedSession(null);
    setView('list');
    setPhotos([]);
    setComments('');
  };

  const handleBackToSessions = () => {
    setSelectedSession(null);
    setView('sessions');
    setPhotos([]);
    setComments('');
  };

  // Sincroniza comments con la sesión seleccionada
  useEffect(() => {
    if (selectedSession && selectedSession.comentarios !== undefined) {
      setComments(selectedSession.comentarios);
    } else {
      setComments('');
    }
  }, [selectedSession]);

  // Guardar estado en localStorage
  useEffect(() => {
    localStorage.setItem('view', view);
    localStorage.setItem('selectedPatient', selectedPatient ? JSON.stringify(selectedPatient) : '');
    localStorage.setItem('selectedSession', selectedSession ? JSON.stringify(selectedSession) : '');
  }, [view, selectedPatient, selectedSession]);

  // Restaurar estado desde localStorage al cargar
  useEffect(() => {
    const savedView = localStorage.getItem('view');
    const savedPatient = localStorage.getItem('selectedPatient');
    const savedSession = localStorage.getItem('selectedSession');
    if (savedView) setView(savedView);
    if (savedPatient) setSelectedPatient(JSON.parse(savedPatient));
    if (savedSession) setSelectedSession(JSON.parse(savedSession));
  }, []);

  // Función para recargar fotos tras subir/eliminar
  const handlePhotosUpdated = async () => {
    if (selectedSession && selectedSession.id) {
      const result = await getPhotos(selectedSession.id);
      if (result.success && Array.isArray(result.data)) {
        setPhotos(result.data.map(photo => ({
          id: photo.id,
          type: photo.tipo,
          data: `/uploads/${photo.ruta_archivo}`
        })));
      } else {
        setPhotos([]);
      }
    }
  };

  // Generar PDF con todas las fotos y datos
  const generatePDF = async () => {
    if (!selectedPatient || !selectedSession) return;

    // Ordena las fotos según PHOTO_TYPES
    const orderedPhotos = PHOTO_TYPES.map(type =>
      photos.find(photo => photo.type === type.id)
    ).filter(Boolean);

    const comentarios = selectedSession.comentarios || '';
    const fecha = selectedSession.fecha ? new Date(selectedSession.fecha) : new Date();
    const sessionIndex = sessions.findIndex(s => s.id === selectedSession.id);
    const nombreSesion = selectedSession.nombre || `Sesión ${sessionIndex + 1}`;

    // Crear PDF en formato A4 horizontal
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Dimensiones A4 horizontal en mm
    const pageWidth = 297;
    const pageHeight = 210;
    const margin = 12;
    const headerHeight = 24;
    let yOffset = margin;

    // Logo y datos alineados horizontalmente
    const logoWidth = 50;
    const logoHeight = 18;
    pdf.addImage(logoCarralero, 'PNG', margin, yOffset, logoWidth, logoHeight);
    pdf.setFontSize(12);
    const datosX = margin + logoWidth + 8;
    const datosY = yOffset + 6;
    pdf.text(`Paciente: ${selectedPatient.nombre || ''} ${selectedPatient.apellidos || ''}`, datosX, datosY);
    pdf.text(`Doctor: ${selectedPatient.doctor || ''}`, datosX, datosY + 7);
    pdf.text(`Ficha: ${selectedPatient.ficha || ''}`, datosX + 80, datosY);
    pdf.text(`Fecha: ${fecha.toLocaleDateString()}`, datosX + 80, datosY + 7);
    pdf.text(`Sesión: ${nombreSesion}`, datosX + 160, datosY);
    yOffset += headerHeight;

    // Área disponible para el grid de fotos
    const gridTop = yOffset;
    const gridHeight = pageHeight - gridTop - margin - 18; // 18mm para comentarios si hay espacio
    const gridWidth = pageWidth - 2 * margin;
    const photosPerRow = 3;
    const photosPerCol = 3;
    const cellWidth = (gridWidth - (photosPerRow - 1) * 4) / photosPerRow;
    const cellHeight = (gridHeight - (photosPerCol - 1) * 4) / photosPerCol;

    let count = 0;
    for (let row = 0; row < photosPerCol; row++) {
      for (let col = 0; col < photosPerRow; col++) {
        if (count >= orderedPhotos.length) break;
        const foto = orderedPhotos[count];
        const x = margin + col * (cellWidth + 4);
        const y = gridTop + row * (cellHeight + 4);
        try {
          // Calcular tamaño de la imagen manteniendo proporción
          const img = new window.Image();
          img.src = foto.data;
          let drawW = cellWidth;
          let drawH = cellHeight;
          if (img.width && img.height) {
            const ratio = Math.min(cellWidth / img.width, cellHeight / img.height);
            drawW = img.width * ratio;
            drawH = img.height * ratio;
          }
          // Centrar la imagen en la celda
          const offsetX = x + (cellWidth - drawW) / 2;
          const offsetY = y + (cellHeight - drawH) / 2;
          pdf.addImage(foto.data, 'JPEG', offsetX, offsetY, drawW, drawH);
        } catch (error) {
          console.error('Error al procesar imagen:', error);
        }
        count++;
      }
    }

    // Añadir comentarios si hay espacio debajo del grid
    const commentsY = gridTop + photosPerCol * (cellHeight + 4) + 8;
    if (comentarios && commentsY + 10 < pageHeight - margin) {
      pdf.setFontSize(11);
      pdf.text('Comentarios:', margin, commentsY);
      pdf.setFontSize(10);
      const splitComments = pdf.splitTextToSize(comentarios, pageWidth - 2 * margin);
      pdf.text(splitComments, margin, commentsY + 6);
    }

    pdf.save(`informe-${selectedPatient.nombre || ''}-${selectedPatient.apellidos || ''}-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {view === 'list' && (
        <>
          <h1 className="text-3xl font-bold mb-8 text-center">Gestión de Fotos de Pacientes</h1>
          <div className="mb-4">
            <button
              onClick={() => setView('form')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Añadir Nuevo Paciente
            </button>
          </div>
          <PatientList
            patients={patients}
            onSelectPatient={handleSelectPatient}
            onEditPatient={patient => {
              setSelectedPatient(patient);
              setView('form');
            }}
            onDeletePatient={handleDeletePatient}
          />
        </>
      )}

      {view === 'form' && (
        <PatientForm
          patient={selectedPatient}
          onSubmit={selectedPatient ? handleEditPatient : handleAddPatient}
          onCancel={() => {
            setSelectedPatient(null);
            setView('list');
          }}
        />
      )}

      {view === 'sessions' && selectedPatient && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Sesiones de {selectedPatient.nombre} {selectedPatient.apellidos}
            </h2>
            <button
              onClick={handleBackToList}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Volver al Listado
            </button>
          </div>
          <SessionList
            sessions={sessions}
            onSelectSession={handleSelectSession}
            onCreateSession={() => setView('session-form')}
            onEditSession={session => { setSelectedSession(session); setView('session-form'); }}
            onDeleteSession={handleDeleteSession}
          />
        </div>
      )}

      {view === 'session-form' && selectedPatient && (
        <SessionForm
          session={selectedSession}
          onSubmit={selectedSession ? handleEditSession : handleAddSession}
          onCancel={() => setView('sessions')}
        />
      )}

      {view === 'photos' && selectedPatient && selectedSession && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Fotos - {selectedPatient.nombre} {selectedPatient.apellidos}
            </h2>
            <div className="space-x-4">
              <button
                onClick={handleBackToSessions}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Volver a Sesiones
              </button>
              <button
                onClick={generatePDF}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Descargar PDF
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <PhotoButtons
              onTakePhoto={handleTakePhoto}
              existingPhotos={photos}
              onDeletePhoto={handleDeletePhoto}
              sesionId={selectedSession.id}
              onPhotosUpdated={handlePhotosUpdated}
            />
            <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentarios
            </label>
            <textarea
              value={comments}
              onChange={(e) => handleCommentsChange(e.target.value)}
                className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Añade comentarios sobre la sesión..."
            />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;