import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Importar las imágenes de los templates
import profileTemplate from '../../assets/templates/capture-profile.png';
import smileTemplate from '../../assets/templates/capture-smile.png';
import restTemplate from '../../assets/templates/capture-rest.png';
import mouthOpenTemplate from '../../assets/templates/capture-mouth-open.png';
import upperOcclusalTemplate from '../../assets/templates/capture-upper-occlusal.png';
import rightLateralTemplate from '../../assets/templates/capture-right-lateral.png';
import intraoralTemplate from '../../assets/templates/capture-intraoral.png';
import lowerOcclusalTemplate from '../../assets/templates/capture-lower-occlusal.png';
import leftLateralTemplate from '../../assets/templates/capture-left-lateral.png';

const PHOTO_TYPES = [
  { 
    id: 'profile', 
    label: 'Perfil', 
    template: profileTemplate,
    description: 'Vista de perfil del paciente',
    rotate: false
  },
  { 
    id: 'smile', 
    label: 'Sonrisa', 
    template: smileTemplate,
    description: 'Vista frontal con sonrisa',
    rotate: false
  },
  { 
    id: 'rest', 
    label: 'Reposo', 
    template: restTemplate,
    description: 'Vista frontal en reposo',
    rotate: false
  },
  { 
    id: 'mouth-open', 
    label: 'Boca Abierta', 
    template: mouthOpenTemplate,
    description: 'Vista con boca abierta',
    rotate: false
  },
  { 
    id: 'upper-occlusal', 
    label: 'Oclusal Superior', 
    template: upperOcclusalTemplate,
    description: 'Vista oclusal superior',
    rotate: true
  },
  { 
    id: 'right-lateral', 
    label: 'Lateral Derecho', 
    template: rightLateralTemplate,
    description: 'Vista lateral derecha',
    rotate: false
  },
  { 
    id: 'intraoral', 
    label: 'Intraoral', 
    template: intraoralTemplate,
    description: 'Vista intraoral',
    rotate: false
  },
  { 
    id: 'lower-occlusal', 
    label: 'Oclusal Inferior', 
    template: lowerOcclusalTemplate,
    description: 'Vista oclusal inferior',
    rotate: true
  },
  { 
    id: 'left-lateral', 
    label: 'Lateral Izquierdo', 
    template: leftLateralTemplate,
    description: 'Vista lateral izquierda',
    rotate: false
  }
];

function PhotoButtons({ onTakePhoto, existingPhotos = [], onDeletePhoto }) {
  const [selectedType, setSelectedType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 5000);
  };

  const rotateImage = (imageData, degrees) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (degrees === 180) {
          canvas.width = img.width;
          canvas.height = img.height;
        } else {
          canvas.width = img.height;
          canvas.height = img.width;
        }
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate(degrees * Math.PI / 180);
        ctx.drawImage(img, -img.width/2, -img.height/2);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = () => {
        showError('Error al cargar la imagen para rotar.');
        resolve(imageData);
      };
      img.src = imageData;
    });
  };

  // Redimensionar imagen antes de guardar
  const resizeImage = (imageData, maxWidth = 1280, maxHeight = 960) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          const scale = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(imageData);
      img.src = imageData;
    });
  };

  const handlePhotoClick = (type) => {
    if (isProcessing) return;
    setSelectedType(type);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const file = e.target.files[0];
      if (file && selectedType) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          let imageData = event.target.result;
          try {
            // Redimensionar antes de rotar
            imageData = await resizeImage(imageData);
            const photoType = PHOTO_TYPES.find(p => p.id === selectedType);
            if (photoType && photoType.rotate) {
              imageData = await rotateImage(imageData, 180);
            }
            onTakePhoto(imageData, selectedType);
          } catch (error) {
            showError('Error al procesar la imagen.');
            console.error('Error al procesar la imagen:', error);
          } finally {
            setIsProcessing(false);
            setSelectedType(null);
          }
        };
        reader.onerror = (err) => {
          showError('Error al leer el archivo.');
          console.error('Error al leer el archivo', err);
          setIsProcessing(false);
          setSelectedType(null);
        };
        reader.readAsDataURL(file);
      } else {
        setIsProcessing(false);
        setSelectedType(null);
      }
    } catch (error) {
      showError('Error al procesar la foto.');
      console.error('Error al procesar la foto:', error);
      setIsProcessing(false);
      setSelectedType(null);
    }
  };

  return (
    <>
      {errorMsg && (
        <div className="fixed top-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {errorMsg}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 p-6">
        {PHOTO_TYPES.map((type) => {
          const existingPhoto = existingPhotos.find(p => p.type === type.id);
          const isSelected = selectedType === type.id;
          
          if (existingPhoto) {
            return (
              <div key={type.id} className="relative aspect-square group">
                <img
                  src={existingPhoto.data}
                  alt={type.label}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handlePhotoClick(type.id)}
                    disabled={isProcessing}
                    className={`opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-md text-sm font-medium shadow-lg transition-opacity duration-200 ${
                      isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isProcessing && isSelected ? 'Procesando...' : 'Retomar'}
                  </button>
                  <button
                    onClick={() => onDeletePhoto(type.id)}
                    disabled={isProcessing}
                    className={`opacity-0 group-hover:opacity-100 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-lg transition-opacity duration-200 ${
                      isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Eliminar
                  </button>
                  <a
                    href={existingPhoto.data}
                    download={`foto-${type.label}.jpg`}
                    className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-lg transition-opacity duration-200"
                    style={{ textDecoration: 'none' }}
                  >
                    Descargar
                  </a>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 rounded-b-lg">
                  {type.label}
                </div>
              </div>
            );
          }

          return (
            <button
              key={type.id}
              onClick={() => handlePhotoClick(type.id)}
              disabled={isProcessing}
              className={`relative flex flex-col items-center justify-center p-4 rounded-lg bg-white text-gray-800 hover:bg-gray-50 shadow-md transition-all duration-200 aspect-square group min-h-[200px] ${
                isProcessing && isSelected ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={type.template}
                  alt={type.label}
                  className="w-full h-full object-contain p-4"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200 rounded-lg" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-3 rounded-b-lg">
                <span className="text-base font-medium block text-center">{type.label}</span>
                <span className="text-sm text-gray-500 block text-center">{type.description}</span>
                {isProcessing && isSelected && (
                  <span className="text-sm text-blue-600 block text-center mt-1">Procesando...</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

export default PhotoButtons; 