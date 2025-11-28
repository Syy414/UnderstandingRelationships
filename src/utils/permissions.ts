/**
 * Permission management utilities for browser APIs
 * Handles requests for camera, microphone, audio, and other device permissions
 */

export type PermissionType = 'camera' | 'microphone' | 'audio' | 'notifications';

export interface PermissionStatus {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
  error?: string;
}

/**
 * Request permission for camera access
 */
export async function requestCameraPermission(): Promise<PermissionStatus> {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        granted: false,
        denied: false,
        prompt: false,
        error: 'Camera API not supported in this browser'
      };
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // Stop the stream immediately - we just needed permission
    stream.getTracks().forEach(track => track.stop());
    
    return {
      granted: true,
      denied: false,
      prompt: false
    };
  } catch (error: any) {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      return {
        granted: false,
        denied: true,
        prompt: false,
        error: 'Camera permission denied'
      };
    }
    return {
      granted: false,
      denied: false,
      prompt: false,
      error: error.message || 'Failed to request camera permission'
    };
  }
}

/**
 * Request permission for microphone access
 */
export async function requestMicrophonePermission(): Promise<PermissionStatus> {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        granted: false,
        denied: false,
        prompt: false,
        error: 'Microphone API not supported in this browser'
      };
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop the stream immediately - we just needed permission
    stream.getTracks().forEach(track => track.stop());
    
    return {
      granted: true,
      denied: false,
      prompt: false
    };
  } catch (error: any) {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      return {
        granted: false,
        denied: true,
        prompt: false,
        error: 'Microphone permission denied'
      };
    }
    return {
      granted: false,
      denied: false,
      prompt: false,
      error: error.message || 'Failed to request microphone permission'
    };
  }
}

/**
 * Request permission for audio playback
 * Note: AudioContext requires user interaction, so this is mainly for checking
 */
export async function requestAudioPermission(): Promise<PermissionStatus> {
  try {
    // AudioContext requires user interaction, so we'll just check if it's available
    if (typeof AudioContext === 'undefined' && typeof (window as any).webkitAudioContext === 'undefined') {
      return {
        granted: false,
        denied: false,
        prompt: false,
        error: 'Web Audio API not supported in this browser'
      };
    }

    // Try to create an audio context (this will be suspended until user interaction)
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContextClass();
    
    // Resume if suspended (requires user interaction)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    return {
      granted: audioContext.state === 'running',
      denied: false,
      prompt: audioContext.state === 'suspended',
      error: audioContext.state === 'suspended' ? 'Audio requires user interaction' : undefined
    };
  } catch (error: any) {
    return {
      granted: false,
      denied: false,
      prompt: false,
      error: error.message || 'Failed to initialize audio'
    };
  }
}

/**
 * Request permission for notifications
 */
export async function requestNotificationPermission(): Promise<PermissionStatus> {
  try {
    if (!('Notification' in window)) {
      return {
        granted: false,
        denied: false,
        prompt: false,
        error: 'Notifications not supported in this browser'
      };
    }

    if (Notification.permission === 'granted') {
      return {
        granted: true,
        denied: false,
        prompt: false
      };
    }

    if (Notification.permission === 'denied') {
      return {
        granted: false,
        denied: true,
        prompt: false,
        error: 'Notification permission was previously denied'
      };
    }

    const permission = await Notification.requestPermission();
    
    return {
      granted: permission === 'granted',
      denied: permission === 'denied',
      prompt: false
    };
  } catch (error: any) {
    return {
      granted: false,
      denied: false,
      prompt: false,
      error: error.message || 'Failed to request notification permission'
    };
  }
}

/**
 * Request all permissions needed for the app
 */
export async function requestAllPermissions(): Promise<Record<PermissionType, PermissionStatus>> {
  const [audio, microphone, camera, notifications] = await Promise.all([
    requestAudioPermission(),
    requestMicrophonePermission(),
    requestCameraPermission(),
    requestNotificationPermission()
  ]);

  return {
    audio,
    microphone,
    camera,
    notifications
  };
}

/**
 * Check current permission status without requesting
 */
export function checkPermissionStatus(type: PermissionType): PermissionStatus {
  switch (type) {
    case 'notifications':
      if (!('Notification' in window)) {
        return {
          granted: false,
          denied: false,
          prompt: false,
          error: 'Notifications not supported'
        };
      }
      return {
        granted: Notification.permission === 'granted',
        denied: Notification.permission === 'denied',
        prompt: Notification.permission === 'default'
      };
    
    case 'audio':
      if (typeof AudioContext === 'undefined' && typeof (window as any).webkitAudioContext === 'undefined') {
        return {
          granted: false,
          denied: false,
          prompt: false,
          error: 'Web Audio API not supported'
        };
      }
      return {
        granted: true, // AudioContext doesn't have a permission API, it just works after user interaction
        denied: false,
        prompt: false
      };
    
    case 'camera':
    case 'microphone':
      // Can't check without requesting, so we return prompt
      return {
        granted: false,
        denied: false,
        prompt: true
      };
    
    default:
      return {
        granted: false,
        denied: false,
        prompt: false,
        error: 'Unknown permission type'
      };
  }
}

