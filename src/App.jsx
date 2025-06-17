import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';
import PhotoButtons from './components/photos/PhotoButtons';
import logoCarralero from './assets/templates/Logotipo-horizontal-Dental-Carralero.png';
import './App.css';

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'form', 'photos'
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
    const patientWithPhotos = { ...newPatient, photos: [], comments: '' };
    setPatients(prev => [...prev, patientWithPhotos]);
    setSelectedPatient(patientWithPhotos);
    setView('photos');
    setPhotos([]);
    setComments('');
  };

  const handleEditPatient = (editedPatient) => {
    setPatients(prev => prev.map(p => 
      p.id === editedPatient.id ? { ...editedPatient, photos: p.photos || [], comments: p.comments || '' } : p
    ));
    setSelectedPatient(editedPatient);
    setView('photos');
    // Cargar las fotos existentes del paciente
    const patient = patients.find(p => p.id === editedPatient.id);
    if (patient) {
      setPhotos(patient.photos || []);
      setComments(patient.comments || '');
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setView('photos');
    // Cargar las fotos existentes del paciente
    setPhotos(patient.photos || []);
    setComments(patient.comments || '');
  };

  const handleTakePhoto = (imageData, type) => {
    const newPhoto = { type, data: imageData };
    const updatedPhotos = photos.filter(p => p.type !== type).concat(newPhoto);
    setPhotos(updatedPhotos);

    // Actualizar las fotos en el paciente seleccionado
    if (selectedPatient) {
      setPatients(prev => prev.map(p =>
        p.id === selectedPatient.id
          ? { ...p, photos: updatedPhotos, comments }
          : p
      ));
      setSelectedPatient(prev => ({ ...prev, photos: updatedPhotos }));
    }
  };

  const handleDeletePhoto = (type) => {
    const updatedPhotos = photos.filter(p => p.type !== type);
    setPhotos(updatedPhotos);

    // Actualizar las fotos en el paciente seleccionado
    if (selectedPatient) {
      setPatients(prev => prev.map(p =>
        p.id === selectedPatient.id
          ? { ...p, photos: updatedPhotos, comments }
          : p
      ));
      setSelectedPatient(prev => ({ ...prev, photos: updatedPhotos }));
    }
  };

  const handleCommentsChange = (newComments) => {
    setComments(newComments);
    
    // Actualizar los comentarios en el paciente seleccionado
    if (selectedPatient) {
      setPatients(prev => prev.map(p =>
        p.id === selectedPatient.id
          ? { ...p, comments: newComments }
          : p
      ));
      setSelectedPatient(prev => ({ ...prev, comments: newComments }));
    }
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
    setView('list');
    setPhotos([]);
    setComments('');
  };

  // Crear nueva sesión para el paciente seleccionado
  const addSessionToPatient = () => {
    if (selectedPatient === null) return;
    const newSession = {
      fecha: new Date().toISOString(),
      fotos: [],
      comentarios: ''
    };
    setPatients(prev => prev.map((p, idx) =>
      idx === selectedPatient.id
        ? { ...p, sesiones: [...p.sesiones, newSession] }
        : p
    ));
  };

  // Añadir o actualizar comentarios de una sesión
  const updateSessionComments = (sessionIndex, comments) => {
    if (selectedPatient === null) return;
    
    setPatients(prev => {
      const newPatients = prev.map((p, pIdx) => {
        if (pIdx !== selectedPatient.id) return p;
        return {
          ...p,
          sesiones: p.sesiones.map((s, sIdx) =>
            sIdx === sessionIndex
              ? { ...s, comentarios: comments }
              : s
          )
        };
      });
      
      localStorage.setItem('patients', JSON.stringify(newPatients));
      return newPatients;
    });
  };

  // Generar PDF con todas las fotos y datos
  const generatePDF = async (patient, sessionIndex) => {
    const session = patient.sesiones[sessionIndex];
    // Crear PDF en formato A4
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Dimensiones A4 en mm
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    let yOffset = margin;

    // Añadir logo
    const logoWidth = 60;
    const logoHeight = 20;
    pdf.addImage(logoCarralero, 'PNG', margin, yOffset, logoWidth, logoHeight);
    yOffset += logoHeight + 10;

    // Datos del paciente
    pdf.setFontSize(12);
    pdf.text(`Paciente: ${patient.nombre} ${patient.apellidos}`, margin, yOffset);
    yOffset += 7;
    pdf.text(`Ficha: ${patient.ficha}`, margin, yOffset);
    yOffset += 7;
    pdf.text(`Doctor: ${patient.doctor}`, margin, yOffset);
    yOffset += 7;
    pdf.text(`Fecha: ${new Date(session.fecha).toLocaleDateString()}`, margin, yOffset);
    yOffset += 15;

    // Configurar grid para fotos (3x3)
    const photosPerRow = 3;
    const photoWidth = (pageWidth - 2 * margin - 20) / photosPerRow;
    const photoHeight = photoWidth * 0.75; // Proporción 4:3
    let currentX = margin;

    for (const foto of session.fotos) {
      try {
        // Si no hay espacio vertical, nueva página
        if (yOffset + photoHeight > pageHeight - margin) {
          pdf.addPage();
          yOffset = margin;
          currentX = margin;
        }

        // Añadir foto
        pdf.addImage(foto.data, 'JPEG', currentX, yOffset, photoWidth, photoHeight);
        
        // Añadir etiqueta del tipo de foto
        pdf.setFontSize(8);
        pdf.text(foto.type, currentX, yOffset + photoHeight + 5, { maxWidth: photoWidth });

        // Actualizar posición X
        currentX += photoWidth + 10;

        // Si llegamos al final de la fila, nueva línea
        if (currentX + photoWidth > pageWidth - margin) {
          currentX = margin;
          yOffset += photoHeight + 15;
        }
      } catch (error) {
        console.error('Error al procesar imagen:', error);
      }
    }

    // Añadir comentarios en nueva página
    if (session.comentarios) {
      pdf.addPage();
      yOffset = margin;
      pdf.setFontSize(12);
      pdf.text('Comentarios:', margin, yOffset);
      yOffset += 10;
      pdf.setFontSize(10);
      const splitComments = pdf.splitTextToSize(session.comentarios, pageWidth - 2 * margin);
      pdf.text(splitComments, margin, yOffset);
    }

    // Guardar PDF
    pdf.save(`informe-${patient.nombre}-${patient.apellidos}-${new Date().toISOString()}.pdf`);
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

      {view === 'photos' && selectedPatient && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Fotos de {selectedPatient.nombre} {selectedPatient.apellidos}
            </h2>
            <button
              onClick={handleBackToList}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Volver al Listado
            </button>
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