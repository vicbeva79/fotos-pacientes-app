import { useState, useRef } from 'react';

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
  const fileInputRef = useRef(null);

  const rotateImage = (imageData, degrees) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Establecer dimensiones del canvas según la rotación
        if (degrees === 180) {
          canvas.width = img.width;
          canvas.height = img.height;
        } else {
          canvas.width = img.height;
          canvas.height = img.width;
        }

        // Trasladar y rotar el contexto
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate(degrees * Math.PI / 180);
        ctx.drawImage(img, -img.width/2, -img.height/2);

        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.src = imageData;
    });
  };

  const handlePhotoClick = async (type) => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      setSelectedType(type);

      // Crear un input de tipo file oculto
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Usar la cámara trasera en dispositivos móviles
      fileInputRef.current = input;

      // Prevenir que el input se elimine antes de completar la selección
      document.body.appendChild(input);

      // Manejar la selección de la foto
      input.onchange = async (e) => {
        try {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
              try {
                // Convertir la imagen a base64
                let imageData = event.target.result;
                
                // Rotar la imagen si es necesario
                const photoType = PHOTO_TYPES.find(p => p.id === type);
                if (photoType && photoType.rotate) {
                  imageData = await rotateImage(imageData, 180);
                }

                onTakePhoto(imageData, type);
              } catch (error) {
                console.error('Error al procesar la imagen:', error);
              } finally {
                cleanup();
              }
            };
            reader.onerror = () => {
              console.error('Error al leer el archivo');
              cleanup();
            };
            reader.readAsDataURL(file);
          } else {
            cleanup();
          }
        } catch (error) {
          console.error('Error al procesar la foto:', error);
          cleanup();
        }
      };

      // Manejar cancelación
      input.oncancel = cleanup;

      // Simular clic en el input
      input.click();
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      cleanup();
    }
  };

  const cleanup = () => {
    setIsProcessing(false);
    setSelectedType(null);
    if (fileInputRef.current && fileInputRef.current.parentNode) {
      fileInputRef.current.parentNode.removeChild(fileInputRef.current);
    }
    fileInputRef.current = null;
  };

  return (
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
  );
}

export default PhotoButtons; 