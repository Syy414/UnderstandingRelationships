import { useState, useEffect } from 'react';
import { Mic, Camera, Volume2, Bell, Check, X, AlertCircle } from 'lucide-react';
import { requestAllPermissions, checkPermissionStatus, type PermissionType } from '../utils/permissions';

interface PermissionRequestProps {
  onComplete: (granted: boolean) => void;
  onSkip?: () => void;
}

export function PermissionRequest({ onComplete, onSkip }: PermissionRequestProps) {
  const [permissions, setPermissions] = useState<Record<PermissionType, { status: 'pending' | 'granted' | 'denied' | 'error', message?: string }>>({
    audio: { status: 'pending' },
    microphone: { status: 'pending' },
    camera: { status: 'pending' },
    notifications: { status: 'pending' }
  });
  const [isRequesting, setIsRequesting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check initial status
    const initialStatus = {
      audio: checkPermissionStatus('audio'),
      notifications: checkPermissionStatus('notifications'),
      camera: checkPermissionStatus('camera'),
      microphone: checkPermissionStatus('microphone')
    };

    setPermissions({
      audio: {
        status: initialStatus.audio.granted ? 'granted' : 'pending',
        message: initialStatus.audio.error
      },
      microphone: {
        status: initialStatus.microphone.prompt ? 'pending' : 'granted',
        message: initialStatus.microphone.error
      },
      camera: {
        status: initialStatus.camera.prompt ? 'pending' : 'granted',
        message: initialStatus.camera.error
      },
      notifications: {
        status: initialStatus.notifications.granted ? 'granted' : initialStatus.notifications.denied ? 'denied' : 'pending',
        message: initialStatus.notifications.error
      }
    });
  }, []);

  const handleRequestPermissions = async () => {
    setIsRequesting(true);
    
    try {
      const results = await requestAllPermissions();
      
      const newPermissions: typeof permissions = {
        audio: {
          status: results.audio.granted ? 'granted' : results.audio.denied ? 'denied' : 'error',
          message: results.audio.error
        },
        microphone: {
          status: results.microphone.granted ? 'granted' : results.microphone.denied ? 'denied' : 'error',
          message: results.microphone.error
        },
        camera: {
          status: results.camera.granted ? 'granted' : results.camera.denied ? 'denied' : 'error',
          message: results.camera.error
        },
        notifications: {
          status: results.notifications.granted ? 'granted' : results.notifications.denied ? 'denied' : 'error',
          message: results.notifications.error
        }
      };
      
      setPermissions(newPermissions);
      
      // Consider it successful if at least audio is granted (most important for the app)
      const hasAudio = results.audio.granted;
      setTimeout(() => {
        onComplete(hasAudio);
      }, 1500);
    } catch (error: any) {
      console.error('Error requesting permissions:', error);
      setIsRequesting(false);
    } finally {
      setIsRequesting(false);
    }
  };

  const getPermissionIcon = (type: PermissionType) => {
    switch (type) {
      case 'audio': return Volume2;
      case 'microphone': return Mic;
      case 'camera': return Camera;
      case 'notifications': return Bell;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'granted': return <Check className="w-5 h-5 text-green-500" />;
      case 'denied': return <X className="w-5 h-5 text-red-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default: return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const allGranted = Object.values(permissions).every(p => p.status === 'granted');
  const hasAnyGranted = Object.values(permissions).some(p => p.status === 'granted');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Enable Features</h2>
          <p className="text-gray-600">
            We need your permission to enable audio, voice, and other interactive features
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {(Object.keys(permissions) as PermissionType[]).map((type) => {
            const Icon = getPermissionIcon(type);
            const permission = permissions[type];
            const status = permission.status;

            return (
              <div
                key={type}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                  status === 'granted'
                    ? 'bg-green-50 border-green-300'
                    : status === 'denied'
                    ? 'bg-red-50 border-red-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    status === 'granted'
                      ? 'bg-green-100'
                      : status === 'denied'
                      ? 'bg-red-100'
                      : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      status === 'granted'
                        ? 'text-green-600'
                        : status === 'denied'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg capitalize">{type}</h3>
                    <p className="text-sm text-gray-600">
                      {status === 'granted'
                        ? 'Permission granted'
                        : status === 'denied'
                        ? 'Permission denied'
                        : status === 'error'
                        ? permission.message || 'Error occurred'
                        : 'Waiting for permission'}
                    </p>
                  </div>
                </div>
                {getStatusIcon(status)}
              </div>
            );
          })}
        </div>

        {showDetails && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
            <h4 className="font-semibold text-blue-800 mb-3">Why we need these permissions:</h4>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• <strong>Audio:</strong> For sound effects and feedback in games</li>
              <li>• <strong>Microphone:</strong> For voice interactions and speech recognition (future features)</li>
              <li>• <strong>Camera:</strong> For interactive activities and photo features (future features)</li>
              <li>• <strong>Notifications:</strong> For reminders and achievements (optional)</li>
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleRequestPermissions}
            disabled={isRequesting || allGranted}
            className={`flex-1 py-4 px-6 rounded-2xl text-lg font-semibold transition-all ${
              isRequesting || allGranted
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-500 text-white hover:bg-purple-600 hover:scale-105'
            }`}
          >
            {isRequesting ? 'Requesting...' : allGranted ? 'All Permissions Granted!' : 'Request Permissions'}
          </button>
          
          {onSkip && (
            <button
              onClick={() => onComplete(hasAnyGranted)}
              className="py-4 px-6 rounded-2xl text-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
            >
              {hasAnyGranted ? 'Continue' : 'Skip for Now'}
            </button>
          )}
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
        >
          {showDetails ? 'Hide' : 'Show'} details
        </button>
      </div>
    </div>
  );
}

