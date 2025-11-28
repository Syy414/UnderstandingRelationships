import { useState } from 'react';
import { ArrowLeft, Check, Volume2, User, Users, Heart, Handshake, Shield, AlertCircle, Star, Home, RotateCcw } from 'lucide-react';
import { Confetti } from './Confetti';
import { getCharacterImage } from '../utils/imageUtils';

interface CircleSorterProps {
  onBack: () => void;
}

interface Character {
  name: string;
  correctCircle: string;
  emoji: string;
}

const characterPool: Character[] = [
  { name: 'Mom', correctCircle: 'blue', emoji: '👩' },
  { name: 'Dad', correctCircle: 'blue', emoji: '👨' },
  { name: 'Grandma', correctCircle: 'blue', emoji: '👵' },
  { name: 'Grandpa', correctCircle: 'blue', emoji: '👴' },
  { name: 'Sister', correctCircle: 'blue', emoji: '👧' },
  { name: 'Brother', correctCircle: 'blue', emoji: '👦' },
  { name: 'Cousin', correctCircle: 'blue', emoji: '👧' },
  
  { name: 'Best Friend', correctCircle: 'green', emoji: '👦' },
  { name: 'Classmate', correctCircle: 'green', emoji: '👧' },
  { name: 'School Friend', correctCircle: 'green', emoji: '👦' },
  { name: 'Teammate', correctCircle: 'green', emoji: '🏃' },
  { name: 'Playground Buddy', correctCircle: 'green', emoji: '🎮' },
  
  { name: 'Neighbor', correctCircle: 'yellow', emoji: '👨‍🦳' },
  { name: 'Cashier', correctCircle: 'yellow', emoji: '👨‍💼' },
  { name: 'Librarian', correctCircle: 'yellow', emoji: '👩‍💼' },
  { name: 'Babysitter', correctCircle: 'yellow', emoji: '👩' },
  { name: 'Bus Driver', correctCircle: 'yellow', emoji: '👨‍✈️' },
  { name: 'Mail Carrier', correctCircle: 'yellow', emoji: '📬' },
  
  { name: 'Teacher', correctCircle: 'orange', emoji: '👨‍🏫' },
  { name: 'Doctor', correctCircle: 'orange', emoji: '👨‍⚕️' },
  { name: 'Police Officer', correctCircle: 'orange', emoji: '👮' },
  { name: 'Firefighter', correctCircle: 'orange', emoji: '👨‍🚒' },
  { name: 'Dentist', correctCircle: 'orange', emoji: '🦷' },
  { name: 'Nurse', correctCircle: 'orange', emoji: '👩‍⚕️' },
  { name: 'Coach', correctCircle: 'orange', emoji: '⚽' },
  
  { name: 'Stranger', correctCircle: 'red', emoji: '🧔' },
  { name: 'Person at Park', correctCircle: 'red', emoji: '🧑' },
  { name: 'Unknown Person', correctCircle: 'red', emoji: '🕴️' },
  { name: 'Online Stranger', correctCircle: 'red', emoji: '💻' },
  
  { name: 'Pet', correctCircle: 'purple', emoji: '🐕' },
];

const circles = [
  { 
    id: 'purple', 
    label: 'Me', 
    size: 90, 
    color: '#9333ea', 
    lightColor: '#f3e8ff', 
    icon: User,
    description: 'Just you!'
  },
  { 
    id: 'blue', 
    label: 'Family', 
    size: 170, 
    color: '#2563eb', 
    lightColor: '#dbeafe', 
    icon: Users,
    description: 'People who live with you'
  },
  { 
    id: 'green', 
    label: 'Friends', 
    size: 250, 
    color: '#16a34a', 
    lightColor: '#dcfce7', 
    icon: Heart,
    description: 'People you play with'
  },
  { 
    id: 'yellow', 
    label: 'Acquaintances', 
    size: 330, 
    color: '#ca8a04', 
    lightColor: '#fef9c3', 
    icon: Handshake,
    description: 'People you know a little'
  },
  { 
    id: 'orange', 
    label: 'Helpers', 
    size: 410, 
    color: '#ea580c', 
    lightColor: '#ffedd5', 
    icon: Shield,
    description: 'People who help us'
  },
  { 
    id: 'red', 
    label: 'Strangers', 
    size: 490, 
    color: '#dc2626', 
    lightColor: '#fee2e2', 
    icon: AlertCircle,
    description: 'People you don\'t know'
  },
];

type GameState = 'setup' | 'playing' | 'feedback' | 'complete';

export function CircleSorter({ onBack }: CircleSorterProps) {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [sessionLength, setSessionLength] = useState<number>(10);
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [waitingForCircle, setWaitingForCircle] = useState(false);
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  // color guide legend removed — no left/right guides

  const startGame = (length: number) => {
    const shuffled = [...characterPool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, length);
    setSelectedCharacters(selected);
    setSessionLength(length);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
    setWaitingForCircle(false);
    // (legend removed)
  };

  const currentCharacter = selectedCharacters[currentIndex];

  const handleChooseCircle = () => {
    setWaitingForCircle(true);
  };

  const handleCircleClick = (circleId: string) => {
    if (!waitingForCircle) return;
    
    setSelectedCircleId(circleId);
    const correct = circleId === currentCharacter.correctCircle;
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
    if (currentIndex < selectedCharacters.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setGameState('playing');
      setWaitingForCircle(false);
      setSelectedCircleId(null);
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
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-4 md:p-8 flex items-center justify-center">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🎯</div>
            <h2 className="mb-4 text-purple-700">Relationship Circles</h2>
            <p className="text-xl text-gray-700 mb-2">Sort people into the correct relationship circle!</p>
            <p className="text-gray-600">Choose how many people to sort:</p>
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
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="text-5xl mb-2">{length}</div>
                  <p className="text-sm text-gray-600">People</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => startGame(sessionLength)}
              className="w-full py-6 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 transition-all hover:scale-105 text-xl"
            >
              Start Game!
            </button>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
            <h4 className="mb-4 text-blue-800 text-xl font-bold">Color Guide - Relationship Circles:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {circles.map((circle) => {
                const IconComponent = circle.icon;
                return (
                  <div 
                    key={circle.id} 
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border-2 transition-all hover:shadow-md"
                    style={{ borderColor: circle.color }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                      style={{ backgroundColor: circle.lightColor, border: `3px solid ${circle.color}` }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: circle.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div 
                          className="w-6 h-6 rounded-full border-2 flex-shrink-0"
                          style={{ backgroundColor: circle.color, borderColor: circle.color }}
                        />
                        <strong className="text-lg" style={{ color: circle.color }}>{circle.label}</strong>
                      </div>
                      <p className="text-sm text-gray-600">{circle.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
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
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-4 md:p-8 flex items-center justify-center relative">
        <Confetti />
        <div className="max-w-2xl w-full text-center relative z-10">
          <div className="bg-white rounded-3xl p-12 shadow-2xl mb-8">
            <div className="text-9xl mb-8">🎉</div>
            <h2 className="mb-4 text-purple-700" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              Great Job!
            </h2>
            <p className="text-3xl mb-6">You sorted</p>
            <p className="text-6xl mb-8">
              <span className="text-purple-600">{score}</span>
              <span className="text-gray-400"> / </span>
              <span className="text-gray-600">{sessionLength}</span>
            </p>

            <div className="flex justify-center gap-3 mb-8">
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  className={`w-20 h-20 transition-all ${
                    star <= stars
                      ? 'text-yellow-400 fill-yellow-400 animate-pulse drop-shadow-lg'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            <p className="text-xl text-gray-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              {percentage >= 90
                ? 'You did it! Perfect sorting! 🌟'
                : percentage >= 70
                ? 'Awesome job! You\'re learning! 👍'
                : 'Good practice! Keep going! 💪'}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setGameState('setup')}
              className="px-10 py-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all hover:scale-105 flex items-center gap-3 text-xl shadow-xl border-4 border-green-600"
              style={{ fontFamily: 'Comic Sans MS, cursive' }}
            >
              <RotateCcw className="w-7 h-7" />
              Play Again
            </button>
            <button
              onClick={onBack}
              className="px-10 py-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all hover:scale-105 flex items-center gap-3 text-xl shadow-xl border-4 border-blue-600"
              style={{ fontFamily: 'Comic Sans MS, cursive' }}
            >
              <Home className="w-7 h-7" />
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Feedback Screen
  if (gameState === 'feedback') {
    const correctCircle = circles.find(c => c.id === currentCharacter.correctCircle);
    const selectedCircle = circles.find(c => c.id === selectedCircleId);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-4 md:p-8 flex items-center justify-center">
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
              {isCorrect ? 'Perfect!' : 'Not Quite!'}
            </h3>

            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="flex justify-center mb-4">
                {(() => {
                  const imageSrc = getCharacterImage(currentCharacter.name, currentCharacter.emoji);
                  if (imageSrc && (currentCharacter.name === 'Mom' || currentCharacter.name === 'Dad')) {
                    return (
                      <img
                        src={imageSrc}
                        alt={currentCharacter.name}
                        className="w-24 h-24 rounded-full object-cover border-4 shadow-lg"
                        style={{ borderColor: isCorrect ? '#16a34a' : '#ea580c' }}
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          if (target.parentElement) {
                            const emojiDiv = document.createElement('div');
                            emojiDiv.className = 'text-6xl';
                            emojiDiv.textContent = currentCharacter.emoji;
                            target.parentElement.appendChild(emojiDiv);
                          }
                        }}
                      />
                    );
                  } else {
                    return <div className="text-6xl">{currentCharacter.emoji}</div>;
                  }
                })()}
              </div>
              <p className="text-2xl mb-4">{currentCharacter.name}</p>
              
              {!isCorrect && selectedCircle && (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
                  <p className="text-red-700">
                    You chose: <strong>{selectedCircle.label}</strong>
                  </p>
                </div>
              )}
              
              {correctCircle && (
                <div 
                  className="p-4 rounded-xl border-4"
                  style={{ 
                    backgroundColor: correctCircle.lightColor,
                    borderColor: correctCircle.color
                  }}
                >
                  <p className="mb-2">
                    {isCorrect ? 'Yes!' : 'Correct answer:'} <strong>{currentCharacter.name}</strong> belongs in
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    {(() => {
                      const IconComponent = correctCircle.icon;
                      return (
                        <>
                          <IconComponent className="w-6 h-6" style={{ color: correctCircle.color }} />
                          <span className="text-2xl" style={{ color: correctCircle.color }}>
                            {correctCircle.label}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{correctCircle.description}</p>
                </div>
              )}
            </div>

            {!isCorrect && (
              <p className="text-orange-600 mb-6">
                That's okay! Learning takes practice. 💪
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
              {currentIndex < selectedCharacters.length - 1 ? 'Next Person →' : 'See Results! 🎉'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-4 md:p-8">
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
            Person <span className="text-purple-600">{currentIndex + 1}</span> / {sessionLength}
          </span>
        </div>

          <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-4 bg-red-50 border-2 border-red-300 rounded-full hover:bg-red-100 transition-all hover:scale-105"
          >
            <Home className="w-6 h-6 text-red-600" />
          </button>
        </div>
      </div>


      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-purple-400 to-purple-600 h-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / sessionLength) * 100}%` }}
          />
        </div>
      </div>

      {/* Instruction */}
      <div className="max-w-2xl mx-auto mb-6">
        <div 
          className={`rounded-2xl p-4 text-center transition-all ${
            waitingForCircle 
              ? 'bg-green-50 border-2 border-green-500' 
              : 'bg-blue-50 border-2 border-blue-300'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Volume2 className="w-5 h-5" style={{ color: waitingForCircle ? '#16a34a' : '#2563eb' }} />
            <p style={{ color: waitingForCircle ? '#16a34a' : '#2563eb' }}>
              {waitingForCircle 
                ? '👇 Tap the correct circle below!' 
                : '👇 Tap "Choose Circle" when ready!'}
            </p>
          </div>
        </div>
      </div>

      {/* Character Card */}
      <div className="max-w-md mx-auto mb-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-purple-200">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">Who is this?</p>
            <div className="flex justify-center mb-4">
              {(() => {
                const imageSrc = getCharacterImage(currentCharacter.name, currentCharacter.emoji);
                if (imageSrc && (currentCharacter.name === 'Mom' || currentCharacter.name === 'Dad')) {
                  return (
                    <img
                      src={imageSrc}
                      alt={currentCharacter.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-purple-300 shadow-lg"
                      onError={(e) => {
                        // Fallback to emoji if image fails
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          const emojiDiv = document.createElement('div');
                          emojiDiv.className = 'text-8xl';
                          emojiDiv.textContent = currentCharacter.emoji;
                          target.parentElement.appendChild(emojiDiv);
                        }
                      }}
                    />
                  );
                } else {
                  // Show emoji for non-parent characters or if no photo uploaded
                  return <div className="text-8xl">{currentCharacter.emoji}</div>;
                }
              })()}
            </div>
            <h3 className="text-purple-700">{currentCharacter.name}</h3>
          </div>

          <button
            onClick={handleChooseCircle}
            disabled={waitingForCircle}
            className={`w-full py-5 rounded-2xl text-xl transition-all ${
              waitingForCircle
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-purple-500 text-white hover:bg-purple-600 hover:scale-105'
            }`}
          >
            {waitingForCircle ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-6 h-6" />
                Now tap a circle!
              </span>
            ) : (
              'Choose Circle'
            )}
          </button>
        </div>
      </div>

      {/* Concentric Circles with Color Guide on sides */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-6">
          {/* left colour guide removed */}

          {/* Concentric Circles - Center */}
          <div className="flex-shrink-0 w-full">
            {/* Center the grid to make sure middle column aligns with page center.
                Fixed width computed from 3 columns so the center column sits exactly in the middle. */}
            <div className="mx-auto flex justify-center" style={{ width: '100%' }}>
              {/* Use an inner fixed-width grid so middle column lines up with the page center.
                  Keep a 3-column layout so the center (middle column) is aligned. */}
              <div
                className="grid grid-cols-3 gap-6 place-items-center py-6"
                style={{
                  width: `${240 * 3 + 24 * 2}px`, // 3 cols * size + 2 gaps (size=240, gap=24)
                }}
              >
                {circles.map((circle) => {
            const isClickable = waitingForCircle;
            
            // No external labels; just render concentric interactive circles
            
            // labelPositions removed — no labels placed on circle edges anymore
            
            const size = 240; // increased uniform size for all circles

            return (
                <button
                key={circle.id}
                onClick={() => handleCircleClick(circle.id)}
                disabled={!isClickable}
                className={`rounded-full flex items-center justify-center transition-all duration-300 ${isClickable ? 'hover:scale-105' : ''}`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: circle.lightColor,
                  border: `6px solid ${circle.color}`,
                  cursor: isClickable ? 'pointer' : 'default',
                  boxShadow: isClickable
                    ? `0 6px 18px ${circle.color}40, 0 6px 12px rgba(0,0,0,0.08)`
                    : '0 2px 8px rgba(0,0,0,0.1)',
                }}
                aria-label={circle.label}
                >
                {/* inner icon or label */}
                <div className="flex flex-col items-center justify-center gap-2 px-2">
                  <div style={{ width: Math.round(size * 0.45), height: Math.round(size * 0.45), borderRadius: '50%', backgroundColor: circle.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(() => { const Icon = circle.icon; return <Icon className="w-8 h-8 text-white" /> })()}
                  </div>
                  <div className="text-base font-semibold text-center" style={{ color: circle.color }}>{circle.label}</div>
                  <div className="text-sm text-gray-600 text-center max-w-[220px] leading-tight">{circle.description}</div>
                </div>
              </button>
            );
          })}
              </div>
            </div>
          </div>

          {/* right colour guide removed */}
        </div>
      </div>
    </div>
  );
}