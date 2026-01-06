import { useEffect } from 'react';
import { Settings, HelpCircle } from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { useGuide } from '../context/GuideContext';

interface MainMenuProps {
  onNavigate: (screen: string) => void;
  onShowTutorial?: () => void;
}

export function MainMenu({ onNavigate, onShowTutorial }: MainMenuProps) {
  const t = useTranslation();
  const { showPointer, hidePointer, isPointerEnabled } = useGuide();

  // Show pointer to first module when user arrives at main menu
  useEffect(() => {
    if (!isPointerEnabled) {
      console.log('MainMenu: Pointer guides are disabled');
      return;
    }
    
    // Check if this is a first-time user (hasn't completed any games)
    const completedGames = localStorage.getItem('completedGames');
    const hasCompletedAnyGame = completedGames && JSON.parse(completedGames).length > 0;
    
    // Always show pointer to help users find where to start
    const timer = setTimeout(() => {
      console.log('MainMenu: Showing pointer to module1');
      showPointer({
        id: 'first-module',
        selector: '[data-guide="module1"]',
        message: hasCompletedAnyGame 
          ? (t.continueHere || 'Continue here! 🎮')
          : (t.tapToStart || 'Tap here to start! 👆'),
        messagePosition: 'bottom',
        pulseColor: 'rgba(168, 85, 247, 0.8)',
        character: 'bear'
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [isPointerEnabled, showPointer, t]);

  const modules = [
    {
      id: 'module1',
      title: t.module1Title,
      description: t.module1Desc,
      emoji: '🌈',
      color: 'from-purple-400 to-pink-400',
      borderColor: 'border-purple-400',
      hoverColor: 'hover:from-purple-500 hover:to-pink-500'
    },
    {
      id: 'module2',
      title: t.module2Title,
      description: t.module2Desc,
      emoji: '🛡️',
      color: 'from-green-400 to-blue-400',
      borderColor: 'border-green-400',
      hoverColor: 'hover:from-green-500 hover:to-blue-500'
    },
    {
      id: 'module3',
      title: t.module3Title,
      description: t.module3Desc,
      emoji: '🫧',
      color: 'from-orange-400 to-yellow-400',
      borderColor: 'border-orange-400',
      hoverColor: 'hover:from-orange-500 hover:to-yellow-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8 flex items-center justify-center relative">
      {/* Tutorial Help Button */}
      {onShowTutorial && (
        <button
          className="absolute top-6 left-6 p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
          onClick={onShowTutorial}
          title={t.tutorialHelp}
        >
          <HelpCircle className="w-7 h-7 text-purple-500 group-hover:text-purple-600 transition-colors" />
        </button>
      )}

      {/* Parent Settings Button */}
      <button
        className="absolute top-6 right-6 p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
        onClick={() => onNavigate('parentSettings')}
        title={t.parentSettings}
      >
        <Settings className="w-7 h-7 text-gray-600 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl mb-4" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            {t.appTitle}
          </h1>
          <div className="text-7xl mb-6">👦👧🌟</div>
          <p className="text-2xl text-gray-700 mb-2">{t.subtitle}</p>
          <p className="text-xl text-gray-600">{t.chooseModule}</p>
        </div>

        {/* Module Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {modules.map((module) => (
            <button
              key={module.id}
              data-guide={module.id}
              onClick={() => {
                hidePointer();
                onNavigate(module.id);
              }}
              className={`group relative bg-gradient-to-br ${module.color} ${module.hoverColor} rounded-[2.5rem] p-8 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl border-8 ${module.borderColor}`}
            >
              {/* Emoji */}
              <div className="text-8xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {module.emoji}
              </div>
              
              {/* Title */}
              <h2 className="text-white mb-3 drop-shadow-lg" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                {module.title}
              </h2>
              
              {/* Description */}
              <p className="text-white/90 text-sm drop-shadow">
                {module.description}
              </p>

              {/* Shine effect */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 text-center shadow-lg border-4 border-white">
          <p className="text-gray-700 mb-2">
            <strong>🎮 {t.howToPlay}:</strong> {t.howToPlayDesc}
          </p>
        </div>
      </div>
    </div>
  );
}