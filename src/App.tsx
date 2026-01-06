import { useState, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { ModuleMenu } from './components/ModuleMenu';
import { CircleSorter } from './components/CircleSorter';
import { SafeContactGame } from './components/SafeContactGame';
import { PrivatePublicSorting } from './components/PrivatePublicSorting';
import { ScenarioQuiz } from './components/ScenarioQuiz';
import { SafetyScenarios } from './components/SafetyScenarios';
import { InfoVault } from './components/InfoVault';
import { SpaceBubble } from './components/SpaceBubble';
import { WhatWouldYouDo } from './components/WhatWouldYouDo';
import { PermissionRequest } from './components/PermissionRequest';
import { ParentSettings } from './components/ParentSettings';
import { LanguageSelector } from './components/LanguageSelector';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import { GuidedPointer } from './components/GuidedPointer';
import { GuideProvider, useGuide } from './context/GuideContext';
import { useTranslation } from './utils/translations';

type Screen = 'main' | 'module1' | 'module2' | 'module3' | 
  'circles' | 'safecontact' | 'privatePublic' | 'scenarioQuiz' | 'safetyScenarios' | 'infoVault' |
  'spaceBubble' | 'whatWouldYouDo' | 'parentSettings';

// Inner component that uses the Guide context
function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [showPermissions, setShowPermissions] = useState(false);
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const t = useTranslation();
  const { currentPointer, hidePointer } = useGuide();

  useEffect(() => {
    // 1. Check if language has been set up initially
    const isLanguageSetup = localStorage.getItem('languageSetupComplete') === 'true';
    
    if (!isLanguageSetup) {
      setShowLanguageSelect(true);
    } else {
      // 2. If language is set, check if permissions have been shown
      const hasShownPermissions = localStorage.getItem('permissionsShown') === 'true';
      if (!hasShownPermissions) {
        setShowPermissions(true);
      }
    }
  }, []);

  const handleLanguageComplete = () => {
    setShowLanguageSelect(false);
    // After language is selected, check if we need to show permissions
    const hasShownPermissions = localStorage.getItem('permissionsShown') === 'true';
    if (!hasShownPermissions) {
      setShowPermissions(true);
    } else {
      // Check if tutorial needs to be shown
      const tutorialComplete = localStorage.getItem('tutorialComplete') === 'true';
      if (!tutorialComplete) {
        setShowTutorial(true);
      }
    }
  };

  const handlePermissionComplete = (granted: boolean) => {
    localStorage.setItem('permissionsShown', 'true');
    setShowPermissions(false);
    
    // Check if tutorial needs to be shown
    const tutorialComplete = localStorage.getItem('tutorialComplete') === 'true';
    if (!tutorialComplete) {
      setShowTutorial(true);
    }
    
    if (granted) {
      // Try to resume audio context if available
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioContext = new AudioContextClass();
          if (audioContext.state === 'suspended') {
            audioContext.resume();
          }
        }
      } catch (e) {
        console.log('Audio context initialization:', e);
      }
    }
  };

  // Screen Rendering Logic
  if (showLanguageSelect) {
    return <LanguageSelector onComplete={handleLanguageComplete} />;
  }

  if (showPermissions) {
    return (
      <PermissionRequest 
        onComplete={handlePermissionComplete}
        onSkip={() => handlePermissionComplete(false)}
      />
    );
  }

  const handleNavigate = (screen: string) => {
    hidePointer(); // Hide any active pointer when navigating
    setCurrentScreen(screen as Screen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Guided Pointer Overlay */}
      <GuidedPointer 
        target={currentPointer} 
        onTargetClick={hidePointer}
      />

      {/* Onboarding Tutorial Overlay */}
      {showTutorial && (
        <OnboardingTutorial 
          onComplete={() => setShowTutorial(false)}
          currentScreen={currentScreen}
        />
      )}

      {currentScreen === 'main' && (
        <MainMenu onNavigate={handleNavigate} onShowTutorial={() => setShowTutorial(true)} />
      )}
      
      {currentScreen === 'module1' && (
        <ModuleMenu 
          moduleNumber={1}
          title={t.module1FullTitle}
          color="purple"
          games={[
            { id: 'circles', title: t.game_circles, description: t.game_circles_desc, icon: '👥' },
            { id: 'safecontact', title: t.game_safecontact, description: t.game_safecontact_desc, icon: '🤝' }
          ]}
          onNavigate={handleNavigate}
          onBack={() => setCurrentScreen('main')}
        />
      )}
      
      {currentScreen === 'module2' && (
        <ModuleMenu 
          moduleNumber={2}
          title={t.module2FullTitle}
          color="green"
          games={[
            { id: 'safetyScenarios', title: t.game_safetyScenarios, description: t.game_safetyScenarios_desc, icon: '🛡️' },
            { id: 'infoVault', title: t.game_infoVault, description: t.game_infoVault_desc, icon: '🔒' }
          ]}
          onNavigate={handleNavigate}
          onBack={() => setCurrentScreen('main')}
        />
      )}
      
      {currentScreen === 'module3' && (
        <ModuleMenu 
          moduleNumber={3}
          title={t.module3FullTitle}
          color="orange"
          games={[
            { id: 'spaceBubble', title: t.game_spaceBubble, description: t.game_spaceBubble_desc, icon: '🛡️' },
            { id: 'whatWouldYouDo', title: t.game_whatWouldYouDo, description: t.game_whatWouldYouDo_desc, icon: '👫' }
          ]}
          onNavigate={handleNavigate}
          onBack={() => setCurrentScreen('main')}
        />
      )}

      {currentScreen === 'circles' && (
        <CircleSorter onBack={() => setCurrentScreen('module1')} />
      )}
      
      {currentScreen === 'safecontact' && (
        <SafeContactGame onBack={() => setCurrentScreen('module1')} />
      )}
      
      {currentScreen === 'privatePublic' && (
        <PrivatePublicSorting onBack={() => setCurrentScreen('module2')} />
      )}
      
      {currentScreen === 'scenarioQuiz' && (
        <ScenarioQuiz onBack={() => setCurrentScreen('module2')} />
      )}
      
      {currentScreen === 'safetyScenarios' && (
        <SafetyScenarios onBack={() => setCurrentScreen('module2')} />
      )}
      
      {currentScreen === 'infoVault' && (
        <InfoVault onBack={() => setCurrentScreen('module2')} />
      )}
      
      {currentScreen === 'spaceBubble' && (
        <SpaceBubble onBack={() => setCurrentScreen('module3')} />
      )}
      
      {currentScreen === 'whatWouldYouDo' && (
        <WhatWouldYouDo onBack={() => setCurrentScreen('module3')} />
      )}

      {currentScreen === 'parentSettings' && (
        <ParentSettings onBack={() => setCurrentScreen('main')} />
      )}
    </div>
  );
}

// Main App component wrapped with GuideProvider
export default function App() {
  return (
    <GuideProvider>
      <AppContent />
    </GuideProvider>
  );
}