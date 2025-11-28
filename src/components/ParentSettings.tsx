import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, Clock, RotateCcw, Download, Upload, Shield, Bell, Eye, EyeOff, Lock, Camera } from 'lucide-react';
import ParentPhotoCard from './ParentPhotoCard';
import { capturePhotoFromCamera } from '../utils/imageUtils';

interface ParentSettingsProps {
  onBack: () => void;
}

interface Settings {
  soundEnabled: boolean;
  voiceEnabled: boolean;
  showProgress: boolean;
  timeLimit: number; // in minutes, 0 = no limit
  difficulty: 'easy' | 'medium' | 'hard';
  showHints: boolean;
  autoAdvance: boolean;
  notifications: boolean;
}

export function ParentSettings({ onBack }: ParentSettingsProps) {
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: true,
    voiceEnabled: false,
    showProgress: true,
    timeLimit: 0,
    difficulty: 'medium',
    showHints: true,
    autoAdvance: false,
    notifications: false,
  });

  const [activeTab, setActiveTab] = useState<'general' | 'accessibility' | 'advanced' | 'customization'>('general');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [momPhoto, setMomPhoto] = useState<string | null>(null);
  const [dadPhoto, setDadPhoto] = useState<string | null>(null);
  // capture UI state managed in the helper capturePhotoFromCamera, no local refs needed

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('parentSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
    
    // Load parent photos
    const savedMomPhoto = localStorage.getItem('parentPhoto_mom');
    const savedDadPhoto = localStorage.getItem('parentPhoto_dad');
    if (savedMomPhoto) setMomPhoto(savedMomPhoto);
    if (savedDadPhoto) setDadPhoto(savedDadPhoto);
  }, []);

  const saveSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('parentSettings', JSON.stringify(updated));
      return updated;
    });
  };

  const resetProgress = () => {
    // Clear all game progress
    const keysToRemove = [
      'circleSorterProgress',
      'safeContactProgress',
      'privatePublicProgress',
      'safetyScenariosProgress',
      'infoVaultProgress',
      'spaceBubbleProgress',
      'whatWouldYouDoProgress',
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    setShowConfirmReset(false);
    alert('All progress has been reset!');
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'parent-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            setSettings(imported);
            localStorage.setItem('parentSettings', JSON.stringify(imported));
            alert('Settings imported successfully!');
          } catch (error) {
            alert('Error importing settings. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // progress summary removed (Progress tab no longer present)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-bold text-purple-700">Parent Settings</h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-2 mb-6 shadow-lg flex gap-2 overflow-x-auto">
          {[
            { id: 'general', label: 'General', icon: Shield },
            { id: 'customization', label: 'Photos', icon: Camera },
            /* 'Progress' tab removed */
            { id: 'accessibility', label: 'Accessibility', icon: Eye },
            { id: 'advanced', label: 'Advanced', icon: Lock },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
                activeTab === id
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold">{label}</span>
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Game Settings</h2>
              
              <div className="space-y-4">
                {/* Sound Settings */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    {settings.soundEnabled ? (
                      <Volume2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <VolumeX className="w-6 h-6 text-gray-400" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-800">Sound Effects</h3>
                      <p className="text-sm text-gray-600">Enable sound feedback in games</p>
                    </div>
                  </div>
                  <button
                    onClick={() => saveSettings({ soundEnabled: !settings.soundEnabled })}
                    className={`w-14 h-8 rounded-full transition-all ${
                      settings.soundEnabled ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                        settings.soundEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Voice Settings */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <Bell className={`w-6 h-6 ${settings.voiceEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <h3 className="font-semibold text-gray-800">Voice Narration</h3>
                      <p className="text-sm text-gray-600">Read explanations aloud</p>
                    </div>
                  </div>
                  <button
                    onClick={() => saveSettings({ voiceEnabled: !settings.voiceEnabled })}
                    className={`w-14 h-8 rounded-full transition-all ${
                      settings.voiceEnabled ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                        settings.voiceEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Difficulty */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3">Difficulty Level</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => saveSettings({ difficulty: level })}
                        className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                          settings.difficulty === level
                            ? 'bg-purple-500 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Limit */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4 mb-3">
                    <Clock className="w-6 h-6 text-gray-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">Session Time Limit</h3>
                      <p className="text-sm text-gray-600">Set maximum play time per session</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="60"
                      step="5"
                      value={settings.timeLimit}
                      onChange={(e) => saveSettings({ timeLimit: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-lg font-semibold text-purple-600 min-w-[80px]">
                      {settings.timeLimit === 0 ? 'No Limit' : `${settings.timeLimit} min`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customization Tab - Parent Photos */}
        {activeTab === 'customization' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Parent Photos</h2>
              <p className="text-gray-600 mb-6">
                Take photos using your device's camera or upload from files. These photos will appear in scenarios involving Mom or Dad.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ParentPhotoCard
                  id="mom-file-input"
                  title="Mom's Photo"
                  photo={momPhoto}
                  onSavePhoto={(base64) => { setMomPhoto(base64); localStorage.setItem('parentPhoto_mom', base64); }}
                  onClear={() => { setMomPhoto(null); localStorage.removeItem('parentPhoto_mom'); }}
                  onCapture={capturePhotoFromCamera}
                  colors={{
                    containerBg: 'bg-purple-50',
                    containerBorder: 'border-purple-200',
                    avatarBg: 'bg-purple-100',
                    avatarBorder: 'border-purple-300',
                    captureBtnBg: 'bg-purple-500',
                    captureBtnHover: 'bg-purple-600',
                    uploadBtnBg: 'bg-purple-200',
                    uploadBtnText: 'text-purple-700',
                    uploadBtnBorder: 'border-purple-300',
                  }}
                  iconColor="text-purple-600"
                />

                <ParentPhotoCard
                  id="dad-file-input"
                  title="Dad's Photo"
                  photo={dadPhoto}
                  onSavePhoto={(base64) => { setDadPhoto(base64); localStorage.setItem('parentPhoto_dad', base64); }}
                  onClear={() => { setDadPhoto(null); localStorage.removeItem('parentPhoto_dad'); }}
                  onCapture={capturePhotoFromCamera}
                  colors={{
                    containerBg: 'bg-blue-50',
                    containerBorder: 'border-blue-200',
                    avatarBg: 'bg-blue-100',
                    avatarBorder: 'border-blue-300',
                    captureBtnBg: 'bg-blue-500',
                    captureBtnHover: 'bg-blue-600',
                    uploadBtnBg: 'bg-blue-200',
                    uploadBtnText: 'text-blue-700',
                    uploadBtnBorder: 'border-blue-300',
                  }}
                  iconColor="text-blue-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {/* Progress tab removed */}

        {/* Accessibility Tab */}
        {activeTab === 'accessibility' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Accessibility Options</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    {settings.showHints ? (
                      <Eye className="w-6 h-6 text-green-600" />
                    ) : (
                      <EyeOff className="w-6 h-6 text-gray-400" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-800">Show Hints</h3>
                      <p className="text-sm text-gray-600">Display helpful hints during games</p>
                    </div>
                  </div>
                  <button
                    onClick={() => saveSettings({ showHints: !settings.showHints })}
                    className={`w-14 h-8 rounded-full transition-all ${
                      settings.showHints ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                        settings.showHints ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <Clock className={`w-6 h-6 ${settings.autoAdvance ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <h3 className="font-semibold text-gray-800">Auto-Advance</h3>
                      <p className="text-sm text-gray-600">Automatically move to next question after feedback</p>
                    </div>
                  </div>
                  <button
                    onClick={() => saveSettings({ autoAdvance: !settings.autoAdvance })}
                    className={`w-14 h-8 rounded-full transition-all ${
                      settings.autoAdvance ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                        settings.autoAdvance ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <Bell className={`w-6 h-6 ${settings.notifications ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <p className="text-sm text-gray-600">Enable achievement notifications</p>
                    </div>
                  </div>
                  <button
                    onClick={() => saveSettings({ notifications: !settings.notifications })}
                    className={`w-14 h-8 rounded-full transition-all ${
                      settings.notifications ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                        settings.notifications ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Advanced Options</h2>
              
              <div className="space-y-4">
                <button
                  onClick={exportSettings}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-blue-50 border-2 border-blue-300 rounded-xl hover:bg-blue-100 transition-all"
                >
                  <Download className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-700">Export Settings</span>
                </button>

                <button
                  onClick={importSettings}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-green-50 border-2 border-green-300 rounded-xl hover:bg-green-100 transition-all"
                >
                  <Upload className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700">Import Settings</span>
                </button>

                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowConfirmReset(true)}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 border-2 border-red-300 rounded-xl hover:bg-red-100 transition-all"
                  >
                    <RotateCcw className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-700">Reset All Progress</span>
                  </button>
                  {showConfirmReset && (
                    <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
                      <p className="text-sm text-yellow-800 mb-3">
                        Are you sure you want to reset all progress? This cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={resetProgress}
                          className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                        >
                          Yes, Reset
                        </button>
                        <button
                          onClick={() => setShowConfirmReset(false)}
                          className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

