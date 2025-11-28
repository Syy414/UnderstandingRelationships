import React from 'react';
import { Camera, Upload, X, User } from 'lucide-react';
import { fileToBase64 } from '../utils/imageUtils';

interface Colors {
  containerBg: string;
  containerBorder: string;
  avatarBg: string;
  avatarBorder: string;
  captureBtnBg: string;
  captureBtnHover: string;
  uploadBtnBg: string;
  uploadBtnText: string;
  uploadBtnBorder: string;
}

interface ParentPhotoCardProps {
  id: string; // unique id for file input
  title: string;
  photo: string | null;
  onSavePhoto: (base64: string) => void;
  onClear: () => void;
  onCapture: () => Promise<string | null>;
  colors: Colors;
  iconColor?: string;
}

export function ParentPhotoCard({ id, title, photo, onSavePhoto, onClear, onCapture, colors, iconColor }: ParentPhotoCardProps) {
  return (
    <div className={`p-6 ${colors.containerBg} rounded-xl border-2 ${colors.containerBorder} shadow-sm ring-1`}>
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <User className={`w-5 h-5 ${iconColor || 'text-gray-600'}`} />
        {title}
      </h3>

      <div className="flex flex-col items-center gap-4">
        {photo ? (
          <div className="relative">
            <img src={photo} alt={title} className={`w-32 h-32 rounded-full object-cover border-4 ${colors.avatarBorder} shadow-lg`} />
            <button onClick={onClear} className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className={`w-32 h-32 rounded-full ${colors.avatarBg} border-4 ${colors.avatarBorder} shadow-inner flex items-center justify-center`}>
            <span className="text-6xl">{title.includes('Mom') ? '👩' : '👨'}</span>
          </div>
        )}

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={async () => {
              try {
                const photoBase64 = await onCapture();
                if (photoBase64) onSavePhoto(photoBase64);
                else alert('Could not capture photo. Please try again or use file upload.');
              } catch (err) {
                console.error('Error capturing photo:', err);
                alert('Camera access denied or not available. Please use file upload instead.');
              }
            }}
            className={`flex items-center justify-center gap-2 w-full px-6 py-3 ${colors.captureBtnBg} text-white rounded-xl hover:${colors.captureBtnHover} transition-all text-lg font-semibold`}
          >
            <Camera className="w-5 h-5" />
            <span>Take Photo with Camera</span>
          </button>

          <input
            id={id}
            type="file"
            accept="image/*"
            aria-hidden="true"
            tabIndex={-1}
            style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
            onChange={async (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                try {
                  const base64 = await fileToBase64(file);
                  onSavePhoto(base64);
                } catch (error) {
                  alert('Error uploading photo. Please try again.');
                }
              }
            }}
          />

          <label htmlFor={id} className="cursor-pointer">
            <div className={`flex items-center justify-center gap-2 px-6 py-3 ${colors.uploadBtnBg} ${colors.uploadBtnText} rounded-xl hover:${colors.uploadBtnBg} transition-all border ${colors.uploadBtnBorder} justify-center opacity-80`}>
              <Upload className="w-5 h-5" />
              <span>Upload from Files</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default ParentPhotoCard;
