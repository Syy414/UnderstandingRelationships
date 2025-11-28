import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Star, RotateCcw, Home, Volume2 } from 'lucide-react';

interface SafetyScenariosProps {
  onBack: () => void;
}

type GameState = 'setup' | 'playing' | 'feedback' | 'complete';

interface Scenario {
  id: number;
  title: string;
  description: string;
  emoji: string;
  isSafe: boolean;
  explanation: string;
  category: 'stranger' | 'touch' | 'online' | 'sharing' | 'permission';
}

const scenarioPool: Scenario[] = [
  // UNSAFE scenarios
  {
    id: 1,
    title: 'Lost Puppy Help',
    description: 'A stranger asks you to help find their lost puppy in their car.',
    emoji: '🐕',
    isSafe: false,
    explanation: 'Never go anywhere with a stranger! If someone needs help, they should ask an adult, not a child. Tell a parent or trusted adult.',
    category: 'stranger'
  },
  {
    id: 2,
    title: 'Stranger Offers Ride',
    description: 'Someone you don\'t know offers to give you a ride home from school.',
    emoji: '🚗',
    isSafe: false,
    explanation: 'Never accept rides from strangers! Only get in cars with people your parents have approved. Say "No thank you" and walk away.',
    category: 'stranger'
  },
  {
    id: 3,
    title: 'Online Photo Request',
    description: 'Someone you met online asks you to send them a photo of yourself.',
    emoji: '📱',
    isSafe: false,
    explanation: 'Never share photos with people you only know online! Tell a parent right away and block the person.',
    category: 'online'
  },
  {
    id: 4,
    title: 'Neighbor Invitation',
    description: 'A neighbor you don\'t know well asks you to come inside their house alone.',
    emoji: '🏠',
    isSafe: false,
    explanation: 'Only go to someone\'s house if your parents know and gave permission. Always check with your parents first.',
    category: 'stranger'
  },
  {
    id: 5,
    title: 'Free Toy from Stranger',
    description: 'A stranger at the park offers you a toy or candy.',
    emoji: '🎁',
    isSafe: false,
    explanation: 'Don\'t take things from strangers! Politely say "No thank you" and tell a parent or trusted adult.',
    category: 'stranger'
  },
  {
    id: 6,
    title: 'Secret Touch',
    description: 'Someone tells you to keep a touch a secret and not tell your parents.',
    emoji: '🤫',
    isSafe: false,
    explanation: 'Safe touches are never secrets! If someone asks you to keep a touch secret, tell a trusted adult right away.',
    category: 'touch'
  },
  {
    id: 7,
    title: 'Password Sharing',
    description: 'Your friend asks for your tablet password so they can play games.',
    emoji: '🔐',
    isSafe: false,
    explanation: 'Passwords should always stay private, even from friends! They are your personal security.',
    category: 'sharing'
  },
  {
    id: 8,
    title: 'Address Question',
    description: 'Someone at the store asks where you live and what your address is.',
    emoji: '🏘️',
    isSafe: false,
    explanation: 'Your address is private information! Never tell strangers or acquaintances where you live.',
    category: 'sharing'
  },
  {
    id: 9,
    title: 'Uncomfortable Touch Continues',
    description: 'Someone keeps tickling you even after you said "Stop".',
    emoji: '✋',
    isSafe: false,
    explanation: 'When you say "Stop", people must listen! This is not safe. Tell a trusted adult immediately.',
    category: 'touch'
  },
  {
    id: 10,
    title: 'Online Gamer Wants Info',
    description: 'Someone you play games with online asks for your school name.',
    emoji: '🎮',
    isSafe: false,
    explanation: 'Never share personal information with online friends! Keep your school, address, and full name private.',
    category: 'online'
  },
  
  // SAFE scenarios
  {
    id: 11,
    title: 'Grandma Wants a Hug',
    description: 'Your grandma asks if you want a hug hello.',
    emoji: '👵',
    isSafe: true,
    explanation: 'Hugs from family members you know and trust are safe! You can always say yes or no to hugs.',
    category: 'touch'
  },
  {
    id: 12,
    title: 'Doctor Check-Up',
    description: 'The doctor asks to check your heartbeat with a stethoscope while your parent is there.',
    emoji: '👨‍⚕️',
    isSafe: true,
    explanation: 'Medical exams with a parent present are safe! Doctors need to check your body to keep you healthy.',
    category: 'permission'
  },
  {
    id: 13,
    title: 'High-Five at Game',
    description: 'Your teammate gives you a high-five after scoring a goal.',
    emoji: '🙌',
    isSafe: true,
    explanation: 'High-fives and celebrations with friends during games are safe and fun!',
    category: 'touch'
  },
  {
    id: 14,
    title: 'Holding Parent\'s Hand',
    description: 'Dad holds your hand while crossing a busy parking lot.',
    emoji: '👨‍👧',
    isSafe: true,
    explanation: 'Holding a parent\'s hand for safety is perfectly safe! Parents help keep you safe in busy places.',
    category: 'touch'
  },
  {
    id: 15,
    title: 'Waving to Mail Carrier',
    description: 'You wave hello to the mail carrier from your front porch.',
    emoji: '👋',
    isSafe: true,
    explanation: 'Being friendly from a distance is safe! Waving and saying "hi" is a nice way to be polite.',
    category: 'permission'
  },
  {
    id: 16,
    title: 'Sharing Feelings with Mom',
    description: 'You tell your mom that you feel sad today.',
    emoji: '💙',
    isSafe: true,
    explanation: 'Sharing your feelings with trusted family is safe and healthy! It\'s good to talk about how you feel.',
    category: 'sharing'
  },
  {
    id: 17,
    title: 'Teacher Asks Your Name',
    description: 'Your teacher asks what your name is on the first day of school.',
    emoji: '👩‍🏫',
    isSafe: true,
    explanation: 'Telling your teacher your name at school is safe! Teachers need to know your name to help you learn.',
    category: 'sharing'
  },
  {
    id: 18,
    title: 'Friend Asks Favorite Color',
    description: 'A classmate asks what your favorite color is.',
    emoji: '🎨',
    isSafe: true,
    explanation: 'Sharing your favorite things with friends is safe and fun! It helps you get to know each other.',
    category: 'sharing'
  },
  {
    id: 19,
    title: 'Nurse at School',
    description: 'The school nurse checks your temperature when you feel sick.',
    emoji: '🌡️',
    isSafe: true,
    explanation: 'School nurses help when you\'re sick! They are trusted adults who take care of students.',
    category: 'permission'
  },
  {
    id: 20,
    title: 'Playing Tag',
    description: 'Friends gently tag you during a game of tag at recess.',
    emoji: '🏃',
    isSafe: true,
    explanation: 'Gentle touch during games with friends is safe! Games like tag are fun when everyone plays nicely.',
    category: 'touch'
  }
];

export function SafetyScenarios({ onBack }: SafetyScenariosProps) {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [sessionLength, setSessionLength] = useState<number>(5);
  const [selectedScenarios, setSelectedScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Load voice setting from parent settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('parentSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.voiceEnabled !== undefined) {
          setVoiceEnabled(parsed.voiceEnabled);
        }
      } catch (e) {
        console.error('Error loading voice settings:', e);
      }
    }
  }, []);

  // Shuffle and select scenarios when session starts
  const startSession = (length: number) => {
    const shuffled = [...scenarioPool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, length);
    setSelectedScenarios(selected);
    setSessionLength(length);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
    setShowFeedback(false);
  };

  const currentScenario = selectedScenarios[currentIndex];

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.log('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    // Handle errors
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
    };

    // Small delay to ensure browser is ready
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Error speaking:', error);
      }
    }, 100);
  };

  const handleAnswer = (userSaysIsSafe: boolean) => {
    const correct = userSaysIsSafe === currentScenario.isSafe;
    setLastAnswerCorrect(correct);
    if (correct) {
      setScore(score + 1);
      playSound('correct');
    } else {
      playSound('incorrect');
    }
    setShowFeedback(true);
    
    // Read explanation aloud if voice is enabled
    if (voiceEnabled) {
      speakText(currentScenario.explanation);
    }
  };

  const handleNext = () => {
    // Stop any ongoing speech when moving to next question
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    if (currentIndex < selectedScenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowFeedback(false);
    } else {
      setGameState('complete');
    }
  };

  const playSound = (type: 'correct' | 'incorrect') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'correct') {
        oscillator.frequency.value = 523.25;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.stop(audioContext.currentTime + 0.3);
      } else {
        oscillator.frequency.value = 200;
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.stop(audioContext.currentTime + 0.4);
      }
      
      oscillator.start(audioContext.currentTime);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  // Setup Screen
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4 md:p-8 flex items-center justify-center">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🛡️</div>
            <h2 className="mb-4 text-green-700">Safe or Unsafe?</h2>
            <p className="text-xl text-gray-700 mb-2">Learn to spot safe and unsafe situations!</p>
            <p className="text-gray-600">Choose how many questions you want to practice:</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
            <h3 className="text-center mb-6">Choose Session Length</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[5, 10, 15].map((length) => (
                <button
                  key={length}
                  onClick={() => setSessionLength(length)}
                  className={`p-6 rounded-2xl border-4 transition-all hover:scale-105 ${
                    sessionLength === length
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-green-300'
                  }`}
                >
                  <div className="text-5xl mb-2">{length}</div>
                  <p className="text-sm text-gray-600">Questions</p>
                </button>
              ))}
            </div>

            {/* Voice option */}
            <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-purple-50 rounded-xl">
              <Volume2 className="w-6 h-6 text-purple-600" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={voiceEnabled}
                  onChange={(e) => setVoiceEnabled(e.target.checked)}
                  className="w-6 h-6 rounded"
                />
                <span className="text-lg">Read explanations aloud</span>
              </label>
            </div>

            <button
              onClick={() => startSession(sessionLength)}
              className="w-full py-6 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all hover:scale-105 text-xl"
            >
              Start Game!
            </button>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
            <h4 className="mb-3 text-blue-800">How to Play:</h4>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Read each situation carefully</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Tap the green checkmark if it's SAFE</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Tap the red X if it's UNSAFE</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Learn from the explanation after each answer!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Complete Screen
  if (gameState === 'complete') {
    const percentage = Math.round((score / sessionLength) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : 1;

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl mb-8">
            <div className="text-9xl mb-8">🎉</div>
            <h2 className="mb-4 text-green-700">Amazing Work!</h2>
            <p className="text-3xl mb-6">You scored</p>
            <p className="text-6xl mb-8">
              <span className="text-green-600">{score}</span>
              <span className="text-gray-400"> / </span>
              <span className="text-gray-600">{sessionLength}</span>
            </p>

            <div className="flex justify-center gap-3 mb-8">
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  className={`w-16 h-16 transition-all ${
                    star <= stars
                      ? 'text-yellow-400 fill-yellow-400 animate-pulse'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            <p className="text-xl text-gray-600">
              {percentage >= 90
                ? 'You\'re a safety superstar! 🌟'
                : percentage >= 70
                ? 'Great job staying safe! 👍'
                : 'Good try! Practice makes perfect! 💪'}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setGameState('setup')}
              className="px-8 py-5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all hover:scale-105 flex items-center gap-3 text-xl"
            >
              <RotateCcw className="w-6 h-6" />
              Play Again
            </button>
            <button
              onClick={onBack}
              className="px-8 py-5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all hover:scale-105 flex items-center gap-3 text-xl"
            >
              <Home className="w-6 h-6" />
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="bg-white rounded-full px-6 py-3 shadow-lg">
          <span className="text-lg">
            Question <span className="text-green-600">{currentIndex + 1}</span> / {sessionLength}
          </span>
        </div>

        <button
          onClick={onBack}
          className="p-4 bg-red-50 border-2 border-red-300 rounded-full hover:bg-red-100 transition-all hover:scale-105"
          title="Exit Game"
        >
          <Home className="w-6 h-6 text-red-600" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / sessionLength) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto">
        {!showFeedback ? (
          // Question Screen
          <div className="text-center">
            <div className="bg-white rounded-3xl p-12 shadow-xl mb-8">
              <div className="text-9xl mb-6 animate-bounce">{currentScenario.emoji}</div>
              <h3 className="mb-6 text-gray-800">{currentScenario.title}</h3>
              <div className="bg-blue-50 border-4 border-blue-200 rounded-2xl p-6">
                <p className="text-xl text-gray-700">{currentScenario.description}</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <p className="text-2xl mb-4">Is this SAFE or UNSAFE?</p>
              
              <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                {/* Safe Button */}
                <button
                  onClick={() => handleAnswer(true)}
                  className="group bg-white border-4 border-green-400 rounded-3xl p-8 hover:bg-green-50 hover:border-green-500 transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center group-hover:animate-pulse">
                    <Check className="w-12 h-12 text-white" strokeWidth={4} />
                  </div>
                  <p className="text-2xl text-green-700">SAFE</p>
                </button>

                {/* Unsafe Button */}
                <button
                  onClick={() => handleAnswer(false)}
                  className="group bg-white border-4 border-red-400 rounded-3xl p-8 hover:bg-red-50 hover:border-red-500 transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center group-hover:animate-pulse">
                    <X className="w-12 h-12 text-white" strokeWidth={4} />
                  </div>
                  <p className="text-2xl text-red-700">UNSAFE</p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Feedback Screen
          <div className="text-center">
            <div
              className={`rounded-3xl p-12 shadow-2xl mb-8 border-8 ${
                lastAnswerCorrect
                  ? 'bg-green-50 border-green-500'
                  : 'bg-orange-50 border-orange-500'
              }`}
            >
              <div className="text-9xl mb-6">
                {lastAnswerCorrect ? '✅' : '💭'}
              </div>
              <h3
                className={`mb-6 ${
                  lastAnswerCorrect ? 'text-green-700' : 'text-orange-700'
                }`}
              >
                {lastAnswerCorrect ? 'Correct!' : 'Let\'s Learn Together'}
              </h3>

              {/* Show correct answer badge */}
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-6 ${
                currentScenario.isSafe
                  ? 'bg-green-200 border-2 border-green-400'
                  : 'bg-red-200 border-2 border-red-400'
              }`}>
                {currentScenario.isSafe ? (
                  <>
                    <Check className="w-6 h-6 text-green-700" />
                    <span className="text-green-700">This is SAFE</span>
                  </>
                ) : (
                  <>
                    <X className="w-6 h-6 text-red-700" />
                    <span className="text-red-700">This is UNSAFE</span>
                  </>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 mb-6">
                <p className="text-xl text-gray-700 leading-relaxed">
                  {currentScenario.explanation}
                </p>
              </div>

              {!lastAnswerCorrect && (
                <div className="text-lg text-orange-600 italic">
                  It's okay to make mistakes - that's how we learn! 💪
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              className={`px-12 py-6 text-white rounded-full transition-all hover:scale-105 text-xl shadow-lg ${
                lastAnswerCorrect
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {currentIndex < selectedScenarios.length - 1 ? 'Next Question →' : 'See My Results! 🎉'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
