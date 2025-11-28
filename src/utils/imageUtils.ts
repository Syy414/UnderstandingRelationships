/**
 * Utility functions for handling character images
 * Uses uploaded/captured photos for parents, emoji fallback for others
 */

// Get image for a character (uploaded/captured photo or null for emoji fallback)
export function getCharacterImage(characterName: string, emoji: string): string | null {
  // Check for uploaded/captured parent photos
  const normalizedName = characterName.toLowerCase();
  
  if (normalizedName === 'mom' || normalizedName === 'mother') {
    const momPhoto = localStorage.getItem('parentPhoto_mom');
    if (momPhoto) {
      return momPhoto; // Base64 or URL
    }
  }
  
  if (normalizedName === 'dad' || normalizedName === 'father') {
    const dadPhoto = localStorage.getItem('parentPhoto_dad');
    if (dadPhoto) {
      return dadPhoto; // Base64 or URL
    }
  }
  
  // Return null to use emoji fallback for others
  return null;
}

// Convert file to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Capture photo from camera with preview
export async function capturePhotoFromCamera(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        reject(new Error('Camera not supported'));
        return;
      }

      // Create modal overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center;';
      
      const container = document.createElement('div');
      container.style.cssText = 'background: white; padding: 2rem; border-radius: 1rem; max-width: 90%; max-height: 90%; display: flex; flex-direction: column; gap: 1rem;';
      
      const video = document.createElement('video');
      video.style.cssText = 'width: 100%; max-width: 500px; border-radius: 0.5rem;';
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = 'display: flex; gap: 1rem; justify-content: center;';
      
      const captureButton = document.createElement('button');
      captureButton.textContent = 'Take Photo';
      captureButton.style.cssText = 'padding: 0.75rem 1.5rem; background: #9333ea; color: white; border: none; border-radius: 0.5rem; font-size: 1rem; cursor: pointer;';
      
      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'Cancel';
      // Keep same sizing/spacing as capture button but use a red color for cancel per design request
      cancelButton.style.cssText = 'padding: 0.75rem 1.5rem; background: #ef4444; color: white; border: none; border-radius: 0.5rem; font-size: 1rem; cursor: pointer;';
      
      let stream: MediaStream | null = null;
      
      const cleanup = () => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        document.body.removeChild(overlay);
      };
      
      captureButton.onclick = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            const base64 = canvas.toDataURL('image/jpeg', 0.8);
            cleanup();
            resolve(base64);
          } else {
            cleanup();
            reject(new Error('Could not get canvas context'));
          }
        } catch (error) {
          cleanup();
          reject(error);
        }
      };
      
      cancelButton.onclick = () => {
        cleanup();
        reject(new Error('User cancelled'));
      };
      
      buttonContainer.appendChild(captureButton);
      buttonContainer.appendChild(cancelButton);
      container.appendChild(video);
      container.appendChild(buttonContainer);
      overlay.appendChild(container);
      document.body.appendChild(overlay);
      
      // Request camera access
      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      }).then((mediaStream) => {
        stream = mediaStream;
        video.srcObject = stream;
      }).catch((error) => {
        cleanup();
        reject(error);
      });
      
    } catch (error) {
      reject(error);
    }
  });
}

