import { useState } from 'react';
import { ArrowLeft, Lock, Share2, Star, Home, RotateCcw, Check, X, Volume2, Shield, AlertTriangle } from 'lucide-react';

interface InfoVaultProps {
  onBack: () => void;
}

type GameState = 'setup' | 'playing' | 'feedback' | 'complete';

interface InfoItem {
  id: number;
  title: string;
  emoji: string;
  shouldShare: boolean; // true = safe to share, false = keep secret
  shareWith: string; // who it's safe to share with
  explanation: string;
  category: 'personal' | 'feelings' | 'location' | 'online' | 'body';
}

const infoPool: InfoItem[] = [
  // SAFE TO SHARE
  {
    id: 1,
    title: 'Your First Name',
    emoji: '👤',
    shouldShare: true,
    shareWith: 'Teacher at school',
    explanation: 'Your first name is okay to share with teachers and at school. They need to know what to call you!',
    category: 'personal'
  },
  {
    id: 2,
    title: 'Your Favorite Color',
    emoji: '🎨',
    shouldShare: true,
    shareWith: 'Friends and classmates',
    explanation: 'Sharing your favorite things with friends is a great way to get to know each other!',
    category: 'personal'
  },
  {
    id: 3,
    title: 'How You Feel (Sad/Happy)',
    emoji: '😊',
    shouldShare: true,
    shareWith: 'Mom, Dad, or trusted adults',
    explanation: 'It\'s healthy and important to share your feelings with family and trusted adults!',
    category: 'feelings'
  },
  {
    id: 4,
    title: 'That You Are Hurt',
    emoji: '🤕',
    shouldShare: true,
    shareWith: 'Parents, teachers, or school nurse',
    explanation: 'Always tell a trusted adult if you\'re hurt! They can help you feel better.',
    category: 'feelings'
  },
  {
    id: 5,
    title: 'What You Ate for Lunch',
    emoji: '🍎',
    shouldShare: true,
    shareWith: 'Friends and family',
    explanation: 'Talking about what you ate is a normal, safe conversation topic!',
    category: 'personal'
  },
  {
    id: 6,
    title: 'Your Favorite Game',
    emoji: '🎮',
    shouldShare: true,
    shareWith: 'Friends and classmates',
    explanation: 'Sharing your interests helps you make friends with people who like the same things!',
    category: 'personal'
  },
  {
    id: 7,
    title: 'Your Age',
    emoji: '🎂',
    shouldShare: true,
    shareWith: 'Friends and teachers',
    explanation: 'Your age is okay to share with people you know like friends, teachers, and classmates.',
    category: 'personal'
  },
  {
    id: 8,
    title: 'Your Pet\'s Name',
    emoji: '🐕',
    shouldShare: true,
    shareWith: 'Friends and family',
    explanation: 'Talking about your pets is a fun and safe way to share with friends!',
    category: 'personal'
  },
  {
    id: 9,
    title: 'That You Need Help',
    emoji: '🆘',
    shouldShare: true,
    shareWith: 'Parents, teachers, any trusted adult',
    explanation: 'Always tell an adult when you need help! That\'s what they\'re there for.',
    category: 'feelings'
  },
  {
    id: 10,
    title: 'Your Favorite Book',
    emoji: '📚',
    shouldShare: true,
    shareWith: 'Friends, teachers, librarian',
    explanation: 'Sharing what you like to read is a great conversation starter!',
    category: 'personal'
  },

  // KEEP SECRET
  {
    id: 11,
    title: 'Your Home Address',
    emoji: '🏠',
    shouldShare: false,
    shareWith: 'Only parents decide who knows',
    explanation: 'Your address is private! Only share it if your parents say it\'s okay. Never tell strangers or people online.',
    category: 'location'
  },
  {
    id: 12,
    title: 'Your Password',
    emoji: '🔐',
    shouldShare: false,
    shareWith: 'Keep it secret from everyone',
    explanation: 'Passwords should stay private, even from friends! They protect your personal information.',
    category: 'online'
  },
  {
    id: 13,
    title: 'Your Phone Number',
    emoji: '📱',
    shouldShare: false,
    shareWith: 'Only parents decide who knows',
    explanation: 'Your phone number is private information. Only share it when your parents give permission.',
    category: 'personal'
  },
  {
    id: 14,
    title: 'Your School Name',
    emoji: '🏫',
    shouldShare: false,
    shareWith: 'Never to online strangers',
    explanation: 'Don\'t share your school name with people you only know online. This keeps you safe.',
    category: 'location'
  },
  {
    id: 15,
    title: 'Pictures of Your Body',
    emoji: '📸',
    shouldShare: false,
    shareWith: 'Only parents or doctor (with parent)',
    explanation: 'Photos of your body are private. Only share with parents or doctors when parents are there.',
    category: 'body'
  },
  {
    id: 16,
    title: 'Where You Go After School',
    emoji: '🚸',
    shouldShare: false,
    shareWith: 'Never to strangers',
    explanation: 'Don\'t tell strangers or people online where you go after school. This is private information.',
    category: 'location'
  },
  {
    id: 17,
    title: 'When You\'re Home Alone',
    emoji: '🔑',
    shouldShare: false,
    shareWith: 'Never share this',
    explanation: 'Never tell anyone when you\'re home alone. This is important safety information to keep private.',
    category: 'location'
  },
  {
    id: 18,
    title: 'Your Parent\'s Credit Card',
    emoji: '💳',
    shouldShare: false,
    shareWith: 'Never share or use this',
    explanation: 'Credit cards are private! Never share the numbers or use them without permission.',
    category: 'personal'
  },
  {
    id: 19,
    title: 'Your Full Name and Birthday',
    emoji: '🎈',
    shouldShare: false,
    shareWith: 'Not to people online',
    explanation: 'Together, your full name and birthday can be used to find you. Don\'t share both with strangers or online.',
    category: 'personal'
  },
  {
    id: 20,
    title: 'Family Vacation Plans',
    emoji: '✈️',
    shouldShare: false,
    shareWith: 'Not on social media or to strangers',
    explanation: 'Don\'t post vacation plans online or tell strangers. Wait until you\'re back home to share!',
    category: 'location'
  },
];

export function InfoVault({ onBack }: InfoVaultProps) {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [sessionLength, setSessionLength] = useState<number>(10);
  const [selectedItems, setSelectedItems] = useState<InfoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [waitingForChoice, setWaitingForChoice] = useState(false);
  const [userChoice, setUserChoice] = useState<'share' | 'secret' | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const startGame = (length: number) => {
    const shuffled = [...infoPool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, length);
    setSelectedItems(selected);
    setSessionLength(length);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
    setWaitingForChoice(false);
  };

  const currentItem = selectedItems[currentIndex];

  const handleDecideNow = () => {
    setWaitingForChoice(true);
  };

  const handleChoice = (choice: 'share' | 'secret') => {
    if (!waitingForChoice) return;

    setUserChoice(choice);
    const correct = 
      (choice === 'share' && currentItem.shouldShare) ||
      (choice === 'secret' && !currentItem.shouldShare);
    
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
    if (currentIndex < selectedItems.length - 1) {
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 md:p-8 flex items-center justify-center">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🔒</div>
            <h2 className="mb-4 text-blue-700">The Info Vault</h2>
            <p className="text-xl text-gray-700 mb-2">Learn what information to share and what to keep private!</p>
            <p className="text-gray-600">Choose how many items to sort:</p>
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
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="text-5xl mb-2">{length}</div>
                  <p className="text-sm text-gray-600">Items</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => startGame(sessionLength)}
              className="w-full py-6 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-all hover:scale-105 text-xl"
            >
              Start Game!
            </button>
          </div>

          <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
            <h4 className="mb-3 text-green-800">How to Play:</h4>
            <ul className="space-y-2 text-green-700">
              <li className="flex items-start gap-2">
                <Share2 className="w-5 h-5 mt-1 text-green-600" />
                <span><strong>Safe to Share:</strong> Information you can tell friends, teachers, or family</span>
              </li>
              <li className="flex items-start gap-2">
                <Lock className="w-5 h-5 mt-1 text-red-600" />
                <span><strong>Keep Secret:</strong> Private information that strangers shouldn't know</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 mt-1 text-blue-600" />
                <span>When in doubt, always ask a parent or trusted adult first!</span>
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl mb-8">
            <div className="text-9xl mb-8">🎉</div>
            <h2 className="mb-4 text-blue-700">Great Job Staying Safe!</h2>
            <p className="text-3xl mb-6">You sorted</p>
            <p className="text-6xl mb-8">
              <span className="text-blue-600">{score}</span>
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
                ? 'You know how to protect your information! 🛡️'
                : percentage >= 70
                ? 'Great job learning about privacy! 🔒'
                : 'Keep practicing! You\'re learning! 💪'}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setGameState('setup')}
              className="px-8 py-5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all hover:scale-105 flex items-center gap-3 text-xl"
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 md:p-8 flex items-center justify-center">
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
              {isCorrect ? 'Correct!' : 'Let\'s Learn!'}
            </h3>

            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="text-6xl mb-4">{currentItem.emoji}</div>
              <p className="text-2xl mb-4">{currentItem.title}</p>
              
              {!isCorrect && userChoice && (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
                  <p className="text-red-700">
                    You chose: <strong>{userChoice === 'share' ? 'Safe to Share' : 'Keep Secret'}</strong>
                  </p>
                </div>
              )}
              
              <div 
                className={`p-4 rounded-xl border-4 ${
                  currentItem.shouldShare
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  {currentItem.shouldShare ? (
                    <>
                      <Share2 className="w-8 h-8 text-green-600" />
                      <span className="text-2xl text-green-700">Safe to Share</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-8 h-8 text-red-600" />
                      <span className="text-2xl text-red-700">Keep Secret</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Who to share with:</strong> {currentItem.shareWith}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 mb-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {currentItem.explanation}
              </p>
            </div>

            {!isCorrect && (
              <p className="text-orange-600 mb-6">
                That's okay! Privacy rules can be tricky. Keep learning! 💪
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
              {currentIndex < selectedItems.length - 1 ? 'Next Item →' : 'See Results! 🎉'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 md:p-8">
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
            Item <span className="text-blue-600">{currentIndex + 1}</span> / {sessionLength}
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
            className="bg-gradient-to-r from-blue-400 to-purple-600 h-full transition-all duration-500"
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
              : 'bg-blue-50 border-2 border-blue-300'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Volume2 className="w-5 h-5" style={{ color: waitingForChoice ? '#16a34a' : '#2563eb' }} />
            <p style={{ color: waitingForChoice ? '#16a34a' : '#2563eb' }}>
              {waitingForChoice 
                ? '👇 Should you share this or keep it secret?' 
                : '👇 Tap "Decide Now" when ready!'}
            </p>
          </div>
        </div>
      </div>

      {/* Info Item Card */}
      <div className="max-w-md mx-auto mb-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-blue-200">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">Think about this:</p>
            <div className="text-9xl mb-4">{currentItem.emoji}</div>
            <h3 className="text-blue-700 mb-2">{currentItem.title}</h3>
            <div className="inline-block px-4 py-2 bg-purple-50 border-2 border-purple-300 rounded-full">
              <span className="text-sm text-purple-700 capitalize">{currentItem.category} info</span>
            </div>
          </div>

          <button
            onClick={handleDecideNow}
            disabled={waitingForChoice}
            className={`w-full py-5 rounded-2xl text-xl transition-all ${
              waitingForChoice
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
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
          {/* Safe to Share Button */}
          <button
            onClick={() => handleChoice('share')}
            disabled={!waitingForChoice}
            className={`group rounded-3xl p-8 border-4 transition-all ${
              waitingForChoice
                ? 'bg-white border-green-400 hover:bg-green-50 hover:border-green-500 hover:scale-105 cursor-pointer'
                : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Share2 className="w-12 h-12 text-white" />
              </div>
              <h4 className="mb-2 text-green-700">Safe to Share</h4>
              <p className="text-sm text-gray-600">This is okay to tell friends, family, or teachers</p>
            </div>
          </button>

          {/* Keep Secret Button */}
          <button
            onClick={() => handleChoice('secret')}
            disabled={!waitingForChoice}
            className={`group rounded-3xl p-8 border-4 transition-all ${
              waitingForChoice
                ? 'bg-white border-red-400 hover:bg-red-50 hover:border-red-500 hover:scale-105 cursor-pointer'
                : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lock className="w-12 h-12 text-white" />
              </div>
              <h4 className="mb-2 text-red-700">Keep Secret</h4>
              <p className="text-sm text-gray-600">This should stay private and not be shared</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
