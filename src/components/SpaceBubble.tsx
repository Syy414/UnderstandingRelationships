import { useState } from 'react';
import { ArrowLeft, Check, X, Star, Home, RotateCcw, Shield, Volume2 } from 'lucide-react';

interface SpaceBubbleProps {
  onBack: () => void;
}

type GameState = 'setup' | 'playing' | 'feedback' | 'complete';

interface Scenario {
  id: number;
  emoji: string;
  situation: string;
  person: string;
  distance: 'too-close' | 'okay';
  explanation: string;
  visualDistance: 'inside-bubble' | 'near-bubble' | 'far-away';
}

const scenarioPool: Scenario[] = [
  // TOO CLOSE
  {
    id: 1,
    emoji: '🧑',
    situation: 'A stranger standing inside your hula hoop',
    person: 'Stranger',
    distance: 'too-close',
    visualDistance: 'inside-bubble',
    explanation: 'Strangers should not stand this close to you. This is your personal space bubble!'
  },
  {
    id: 2,
    emoji: '👦',
    situation: 'A classmate leaning on your shoulder without asking',
    person: 'Classmate',
    distance: 'too-close',
    visualDistance: 'inside-bubble',
    explanation: 'Even friends and classmates should ask before touching you. Your body belongs to you!'
  },
  {
    id: 3,
    emoji: '🧔',
    situation: 'Someone you don\'t know well standing very close to you in line',
    person: 'Acquaintance',
    distance: 'too-close',
    visualDistance: 'inside-bubble',
    explanation: 'People should give you space in line. It\'s okay to ask them to step back.'
  },
  {
    id: 4,
    emoji: '👨',
    situation: 'A stranger reaching to touch your hair',
    person: 'Stranger',
    distance: 'too-close',
    visualDistance: 'inside-bubble',
    explanation: 'Your hair and body are private. Strangers should not touch you without permission.'
  },
  {
    id: 5,
    emoji: '👧',
    situation: 'Someone looking over your shoulder at your paper without asking',
    person: 'Classmate',
    distance: 'too-close',
    visualDistance: 'inside-bubble',
    explanation: 'Your work is yours. People should respect your space and ask before looking.'
  },
  {
    id: 6,
    emoji: '🧑‍🦱',
    situation: 'A new kid sitting in your lap',
    person: 'New acquaintance',
    distance: 'too-close',
    visualDistance: 'inside-bubble',
    explanation: 'Your lap is your personal space! People need your permission to be this close.'
  },
  {
    id: 7,
    emoji: '👨‍💼',
    situation: 'A stranger at the store standing right next to you',
    person: 'Stranger',
    distance: 'too-close',
    visualDistance: 'inside-bubble',
    explanation: 'Strangers should keep their distance. It\'s okay to move away if someone is too close.'
  },

  // OKAY
  {
    id: 8,
    emoji: '👫',
    situation: 'Your friend sitting next to you on a bench',
    person: 'Friend',
    distance: 'okay',
    visualDistance: 'near-bubble',
    explanation: 'Friends can sit near you! This is a comfortable distance for people you know and trust.'
  },
  {
    id: 9,
    emoji: '👩‍🏫',
    situation: 'Your teacher standing at the whiteboard',
    person: 'Teacher',
    distance: 'okay',
    visualDistance: 'far-away',
    explanation: 'Perfect! Teachers often stand at a comfortable distance when teaching the class.'
  },
  {
    id: 10,
    emoji: '👩',
    situation: 'Mom giving you a hug',
    person: 'Mom',
    distance: 'okay',
    visualDistance: 'inside-bubble',
    explanation: 'Hugs from family you trust and love are okay! They are in your closest circle.'
  },
  {
    id: 11,
    emoji: '👨‍⚕️',
    situation: 'The doctor checking your heartbeat (with your parent there)',
    person: 'Doctor',
    distance: 'okay',
    visualDistance: 'inside-bubble',
    explanation: 'Doctors need to be close to help you, but a parent should always be there too!'
  },
  {
    id: 12,
    emoji: '👦',
    situation: 'Your teammate giving you a high-five after a game',
    person: 'Teammate',
    distance: 'okay',
    visualDistance: 'near-bubble',
    explanation: 'High-fives are great! Quick, friendly touches during games are usually okay.'
  },
  {
    id: 13,
    emoji: '👨',
    situation: 'Dad holding your hand in the parking lot',
    person: 'Dad',
    distance: 'okay',
    visualDistance: 'inside-bubble',
    explanation: 'Family members you trust can hold your hand to keep you safe!'
  },
  {
    id: 14,
    emoji: '📬',
    situation: 'Waving to the mailman from the porch',
    person: 'Mailman',
    distance: 'okay',
    visualDistance: 'far-away',
    explanation: 'Perfect! Friendly waves from a distance are great. You\'re staying safe in your own space.'
  },
  {
    id: 15,
    emoji: '👧',
    situation: 'A classmate sitting at their own desk next to yours',
    person: 'Classmate',
    distance: 'okay',
    visualDistance: 'near-bubble',
    explanation: 'Good! Each person has their own space. This is a comfortable classroom distance.'
  },
  {
    id: 16,
    emoji: '👵',
    situation: 'Grandma asking "Can I have a hug?"',
    person: 'Grandma',
    distance: 'okay',
    visualDistance: 'near-bubble',
    explanation: 'Great! She asked first! You can say yes or no. Both answers are okay.'
  },
  {
    id: 17,
    emoji: '⚽',
    situation: 'Playing tag on the playground, someone gently tags your arm',
    person: 'Friend',
    distance: 'okay',
    visualDistance: 'inside-bubble',
    explanation: 'This is part of the game! Quick, gentle touches during games you agreed to play are okay.'
  },
  {
    id: 18,
    emoji: '👨‍🏫',
    situation: 'The school nurse checking your temperature',
    person: 'Nurse',
    distance: 'okay',
    visualDistance: 'inside-bubble',
    explanation: 'Healthcare helpers at school can check on you when you\'re not feeling well. That\'s their job!'
  },
];

export function SpaceBubble({ onBack }: SpaceBubbleProps) {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [sessionLength, setSessionLength] = useState<number>(10);
  const [selectedScenarios, setSelectedScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [waitingForChoice, setWaitingForChoice] = useState(false);
  const [userChoice, setUserChoice] = useState<'too-close' | 'okay' | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const startGame = (length: number) => {
    const shuffled = [...scenarioPool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, length);
    setSelectedScenarios(selected);
    setSessionLength(length);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
    setWaitingForChoice(false);
  };

  const currentScenario = selectedScenarios[currentIndex];

  const handleDecideNow = () => {
    setWaitingForChoice(true);
  };

  const handleChoice = (choice: 'too-close' | 'okay') => {
    if (!waitingForChoice) return;

    setUserChoice(choice);
    const correct = choice === currentScenario.distance;
    
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      playSound('correct');
    } else {
      playSound('incorrect');
    }
    
    setGameState('feedback');
  };

  const handleContinue = () => {
    if (currentIndex < selectedScenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setGameState('playing');
      setWaitingForChoice(false);
      setUserChoice(null);
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
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 p-4 md:p-8 flex items-center justify-center">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🫧</div>
            <h2 className="mb-4 text-orange-700">Space Bubble</h2>
            <p className="text-xl text-gray-700 mb-2">Learn about personal space and who can be close to you!</p>
            <p className="text-gray-600">Choose how many scenarios to practice:</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
            <h3 className="text-center mb-6">Choose Game Length</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[5, 10, 15].map((length) => (
                <button
                  key={length}
                  onClick={() => setSessionLength(length)}
                  className={`p-6 rounded-2xl border-4 transition-all hover:scale-105 ${
                    sessionLength === length
                      ? 'border-orange-500 bg-orange-50 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="text-5xl mb-2">{length}</div>
                  <p className="text-sm text-gray-600">Scenarios</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => startGame(sessionLength)}
              className="w-full py-6 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-all hover:scale-105 text-xl"
            >
              Start Learning!
            </button>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
            <h4 className="mb-3 text-blue-800">Understanding Personal Space:</h4>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 mt-1 text-orange-600" />
                <span><strong>Your Space Bubble:</strong> Imagine a bubble around you - that's your personal space!</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-1 text-green-600" />
                <span><strong>Okay:</strong> Family you trust and friends can be close with permission</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-5 h-5 mt-1 text-red-600" />
                <span><strong>Too Close:</strong> Strangers and people without permission should stay back</span>
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
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl mb-8">
            <div className="text-9xl mb-8">🎉</div>
            <h2 className="mb-4 text-orange-700">You Protected Your Space Bubble!</h2>
            <p className="text-3xl mb-6">You got</p>
            <p className="text-6xl mb-8">
              <span className="text-orange-600">{score}</span>
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
                ? 'You know all about personal space! 🫧'
                : percentage >= 70
                ? 'Great job learning about boundaries! 🛡️'
                : 'Keep practicing! You\'re getting better! 💪'}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setGameState('setup')}
              className="px-8 py-5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all hover:scale-105 flex items-center gap-3 text-xl"
            >
              <RotateCcw className="w-6 h-6" />
              Play Again
            </button>
            <button
              onClick={onBack}
              className="px-8 py-5 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-all hover:scale-105 flex items-center gap-3 text-xl"
            >
              <Home className="w-6 h-6" />
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Feedback Screen
  if (gameState === 'feedback') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div 
            className={`rounded-3xl p-12 shadow-2xl border-8 text-center ${
              isCorrect 
                ? 'bg-green-50 border-green-500' 
                : 'bg-orange-50 border-orange-500'
            }`}
          >
            <div className="text-9xl mb-6">
              {isCorrect ? '✅' : '🤔'}
            </div>
            
            <h3 className={`mb-6 ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
              {isCorrect ? 'Correct!' : 'Let\'s Learn Together!'}
            </h3>

            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="text-6xl mb-4">{currentScenario.emoji}</div>
              <p className="text-2xl mb-4">{currentScenario.situation}</p>
              
              {!isCorrect && userChoice && (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
                  <p className="text-red-700">
                    You chose: <strong>{userChoice === 'too-close' ? 'Too Close' : 'Just Right'}</strong>
                  </p>
                </div>
              )}
              
              <div 
                className={`p-4 rounded-xl border-4 ${
                  currentScenario.distance === 'too-close'
                    ? 'bg-red-50 border-red-500'
                    : 'bg-green-50 border-green-500'
                }`}
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  {currentScenario.distance === 'too-close' ? (
                    <>
                      <X className="w-8 h-8 text-red-600" />
                      <span className="text-2xl text-red-700">Too Close!</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-8 h-8 text-green-600" />
                      <span className="text-2xl text-green-700">Just Right!</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 mb-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {currentScenario.explanation}
              </p>
            </div>

            {!isCorrect && (
              <p className="text-orange-600 mb-6">
                Personal space can be tricky! You're learning! 💪
              </p>
            )}

            <button
              onClick={handleContinue}
              className={`px-12 py-6 text-white rounded-full text-xl transition-all hover:scale-105 ${
                isCorrect 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {currentIndex < selectedScenarios.length - 1 ? 'Next Scenario →' : 'See Results! 🎉'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="bg-white rounded-full px-6 py-3 shadow-lg">
          <span className="text-lg">
            Scenario <span className="text-orange-600">{currentIndex + 1}</span> / {sessionLength}
          </span>
        </div>

        <button
          onClick={onBack}
          className="p-4 bg-red-50 border-2 border-red-300 rounded-full hover:bg-red-100 transition-all hover:scale-105"
        >
          <Home className="w-6 h-6 text-red-600" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-orange-400 to-pink-600 h-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / sessionLength) * 100}%` }}
          />
        </div>
      </div>

      {/* Instruction */}
      <div className="max-w-2xl mx-auto mb-6">
        <div 
          className={`rounded-2xl p-4 text-center transition-all ${
            waitingForChoice 
              ? 'bg-green-50 border-2 border-green-500' 
              : 'bg-orange-50 border-2 border-orange-300'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Volume2 className="w-5 h-5" style={{ color: waitingForChoice ? '#16a34a' : '#f97316' }} />
            <p style={{ color: waitingForChoice ? '#16a34a' : '#f97316' }}>
              {waitingForChoice 
                ? '👇 Is this person too close or just right?' 
                : '👇 Think about the scenario, then tap "Decide Now"!'}
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Card */}
      <div className="max-w-md mx-auto mb-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-orange-200">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">Imagine this scenario:</p>
            <div className="text-9xl mb-4">{currentScenario.emoji}</div>
            <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-4 mb-4">
              <p className="text-lg">{currentScenario.situation}</p>
            </div>
            <div className="inline-block px-4 py-2 bg-purple-50 border-2 border-purple-300 rounded-full">
              <span className="text-sm text-purple-700">{currentScenario.person}</span>
            </div>
          </div>

          <button
            onClick={handleDecideNow}
            disabled={waitingForChoice}
            className={`w-full py-5 rounded-2xl text-xl transition-all ${
              waitingForChoice
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105'
            }`}
          >
            {waitingForChoice ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-6 h-6" />
                Now make your choice!
              </span>
            ) : (
              'Decide Now'
            )}
          </button>
        </div>
      </div>

      {/* Choice Buttons */}
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Too Close Button */}
          <button
            onClick={() => handleChoice('too-close')}
            disabled={!waitingForChoice}
            className={`group rounded-3xl p-8 border-4 transition-all ${
              waitingForChoice
                ? 'bg-white border-red-400 hover:bg-red-50 hover:border-red-500 hover:scale-105 cursor-pointer'
                : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <X className="w-12 h-12 text-white" />
              </div>
              <h4 className="mb-2 text-red-700">Too Close!</h4>
              <p className="text-sm text-gray-600">This person is invading personal space</p>
            </div>
          </button>

          {/* Just Right Button */}
          <button
            onClick={() => handleChoice('okay')}
            disabled={!waitingForChoice}
            className={`group rounded-3xl p-8 border-4 transition-all ${
              waitingForChoice
                ? 'bg-white border-green-400 hover:bg-green-50 hover:border-green-500 hover:scale-105 cursor-pointer'
                : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Check className="w-12 h-12 text-white" />
              </div>
              <h4 className="mb-2 text-green-700">Just Right!</h4>
              <p className="text-sm text-gray-600">This distance is comfortable and safe</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
