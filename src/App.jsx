import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';
import SessionList from './components/SessionList';
import SessionForm from './components/SessionForm';
import PhotoButtons from './components/photos/PhotoButtons';
import logoCarralero from './assets/templates/Logotipo-horizontal-Dental-Carralero.png';
import './App.css';

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'form', 'sessions', 'session-form', 'photos'
  const [photos, setPhotos] = useState([]);
  const [comments, setComments] = useState('');

  // Cargar datos al iniciar
  useEffect(() => {
    const savedPatients = localStorage.getItem('patients');
    if (savedPatients) {
      setPatients(JSON.parse(savedPatients));
    }
  }, []);

  // Guardar datos cuando cambian
  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

  const handleAddPatient = (newPatient) => {
    const patientWithSessions = { 
      ...newPatient, 
      sesiones: [],
      photos: [], 
      comments: '' 
    };
    setPatients(prev => [...prev, patientWithSessions]);
    setSelectedPatient(patientWithSessions);
    setView('sessions');
  };

  const handleEditPatient = (editedPatient) => {
    setPatients(prev => prev.map(p => 
      p.id === editedPatient.id ? { ...editedPatient, sesiones: p.sesiones || [], photos: p.photos || [], comments: p.comments || '' } : p
    ));
    setSelectedPatient(editedPatient);
    setView('sessions');
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setView('sessions');
  };

  const handleCreateSession = () => {
    setSelectedSession(null);
    setView('session-form');
  };

  const handleEditSession = (sessionIndex) => {
    setSelectedSession(sessionIndex);
    setView('session-form');
  };

  const handleSelectSession = (sessionIndex) => {
    setSelectedSession(sessionIndex);
    setView('photos');
    const session = selectedPatient.sesiones[sessionIndex];
    setPhotos(session.fotos || []);
    setComments(session.comentarios || '');
  };

  const handleSessionSubmit = (sessionData) => {
    if (selectedSession !== null) {
      // Editar sesión existente
      const updatedPatient = {
        ...selectedPatient,
        sesiones: selectedPatient.sesiones.map((s, idx) => 
          idx === selectedSession ? sessionData : s
        )
      };
      setPatients(prev => prev.map(p => 
        p.id === selectedPatient.id ? updatedPatient : p
      ));
      setSelectedPatient(updatedPatient);
    } else {
      // Crear nueva sesión
      const updatedPatient = {
        ...selectedPatient,
        sesiones: [...(selectedPatient.sesiones || []), sessionData]
      };
      setPatients(prev => prev.map(p => 
        p.id === selectedPatient.id ? updatedPatient : p
      ));
      setSelectedPatient(updatedPatient);
    }
    setView('sessions');
  };

  const handleTakePhoto = (imageData, type) => {
    const newPhoto = { type, data: imageData };
    const updatedPhotos = photos.filter(p => p.type !== type).concat(newPhoto);
    setPhotos(updatedPhotos);

    // Actualizar las fotos en la sesión seleccionada
    if (selectedPatient && selectedSession !== null) {
      setPatients(prev => prev.map(p => {
        if (p.id === selectedPatient.id) {
          const updatedSessions = [...p.sesiones];
          updatedSessions[selectedSession] = {
            ...updatedSessions[selectedSession],
            fotos: updatedPhotos,
            comentarios: comments
          };
          return { ...p, sesiones: updatedSessions };
        }
        return p;
      }));
    }
  };

  const handleDeletePhoto = (type) => {
    const updatedPhotos = photos.filter(p => p.type !== type);
    setPhotos(updatedPhotos);

    // Actualizar las fotos en la sesión seleccionada
    if (selectedPatient && selectedSession !== null) {
      setPatients(prev => prev.map(p => {
        if (p.id === selectedPatient.id) {
          const updatedSessions = [...p.sesiones];
          updatedSessions[selectedSession] = {
            ...updatedSessions[selectedSession],
            fotos: updatedPhotos,
            comentarios: comments
          };
          return { ...p, sesiones: updatedSessions };
        }
        return p;
      }));
    }
  };

  const handleCommentsChange = (newComments) => {
    setComments(newComments);
    
    // Actualizar los comentarios en la sesión seleccionada
    if (selectedPatient && selectedSession !== null) {
      setPatients(prev => prev.map(p => {
        if (p.id === selectedPatient.id) {
          const updatedSessions = [...p.sesiones];
          updatedSessions[selectedSession] = {
            ...updatedSessions[selectedSession],
            comentarios: newComments
          };
          return { ...p, sesiones: updatedSessions };
        }
        return p;
      }));
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

  const handleDeleteSession = (sessionIndex) => {
    const updatedPatient = {
      ...selectedPatient,
      sesiones: selectedPatient.sesiones.filter((_, idx) => idx !== sessionIndex)
    };
    setPatients(prev => prev.map(p => 
      p.id === selectedPatient.id ? updatedPatient : p
    ));
    setSelectedPatient(updatedPatient);
  };

  // Generar PDF con todas las fotos y datos
  const generatePDF = async () => {
    if (!selectedPatient || selectedSession === null) return;

    const session = selectedPatient.sesiones[selectedSession];
    const fotos = session.fotos || [];
    const comentarios = session.comentarios || '';
    const fecha = session.fecha ? new Date(session.fecha) : new Date();
    const nombreSesion = session.nombre || `Sesión ${selectedSession + 1}`;

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
        if (count >= fotos.length) break;
        const foto = fotos[count];
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
    <div className="container mx-auto px-4 py-8">
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
            onEditPatient={(patient) => {
              setSelectedPatient(patient);
              setView('form');
            }}
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
            sessions={selectedPatient.sesiones || []}
            onSelectSession={handleSelectSession}
            onCreateSession={handleCreateSession}
            onEditSession={handleEditSession}
            onDeleteSession={handleDeleteSession}
          />
        </div>
      )}

      {view === 'session-form' && selectedPatient && (
        <SessionForm
          session={selectedSession !== null ? selectedPatient.sesiones[selectedSession] : null}
          onSubmit={handleSessionSubmit}
          onCancel={() => setView('sessions')}
        />
      )}

      {view === 'photos' && selectedPatient && selectedSession !== null && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Fotos de {selectedPatient.nombre} {selectedPatient.apellidos} - {selectedPatient.sesiones[selectedSession].nombre || `Sesión ${selectedSession + 1}`}
            </h2>
            <div className="space-x-4">
              <button
                onClick={handleBackToSessions}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Volver a Sesiones
              </button>
              <button
                onClick={generatePDF}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors font-semibold"
              >
                Generar PDF
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentarios de la sesión
            </label>
            <textarea
              value={comments}
              onChange={(e) => handleCommentsChange(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows="4"
            />
          </div>

          <PhotoButtons
            onTakePhoto={handleTakePhoto}
            existingPhotos={photos}
            onDeletePhoto={handleDeletePhoto}
          />
        </div>
      )}
    </div>
  );
}

export default App;