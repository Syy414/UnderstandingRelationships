import { useState } from 'react';
import { ArrowLeft, Lock, Users, Star } from 'lucide-react';

interface PrivatePublicSortingProps {
  onBack: () => void;
}

interface Item {
  id: number;
  text: string;
  emoji: string;
  isPrivate: boolean;
  category: 'body' | 'info' | 'activity' | 'place';
}

const items: Item[] = [
  // Private
  { id: 1, text: 'Going to the bathroom', emoji: '🚽', isPrivate: true, category: 'activity' },
  { id: 2, text: 'Your body under clothes', emoji: '👕', isPrivate: true, category: 'body' },
  { id: 3, text: 'Your home address', emoji: '🏠', isPrivate: true, category: 'info' },
  { id: 4, text: 'Your password', emoji: '🔑', isPrivate: true, category: 'info' },
  { id: 5, text: 'Getting dressed', emoji: '👔', isPrivate: true, category: 'activity' },
  { id: 6, text: 'Taking a bath', emoji: '🛁', isPrivate: true, category: 'activity' },
  { id: 7, text: 'Your bedroom', emoji: '🛏️', isPrivate: true, category: 'place' },
  { id: 8, text: 'Family secrets', emoji: '🤫', isPrivate: true, category: 'info' },
  { id: 9, text: 'Changing clothes', emoji: '👗', isPrivate: true, category: 'activity' },
  { id: 10, text: 'Your phone number', emoji: '📱', isPrivate: true, category: 'info' },
  
  // Public
  { id: 11, text: 'Waving hello', emoji: '👋', isPrivate: false, category: 'activity' },
  { id: 12, text: 'Playing at the park', emoji: '🏞️', isPrivate: false, category: 'activity' },
  { id: 13, text: 'Your first name', emoji: '📛', isPrivate: false, category: 'info' },
  { id: 14, text: 'Eating lunch', emoji: '🍱', isPrivate: false, category: 'activity' },
  { id: 15, text: 'Doing homework in class', emoji: '📚', isPrivate: false, category: 'activity' },
  { id: 16, text: 'Playing with friends', emoji: '⚽', isPrivate: false, category: 'activity' },
  { id: 17, text: 'Your favorite color', emoji: '🎨', isPrivate: false, category: 'info' },
  { id: 18, text: 'Riding your bike', emoji: '🚲', isPrivate: false, category: 'activity' },
  { id: 19, text: 'Singing a song', emoji: '🎵', isPrivate: false, category: 'activity' },
  { id: 20, text: 'Drawing a picture', emoji: '✏️', isPrivate: false, category: 'activity' },
];

export function PrivatePublicSorting({ onBack }: PrivatePublicSortingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'private' | 'public' | null>(null);

  const currentItem = items[currentIndex];

  const handleCategorySelect = (category: 'private' | 'public') => {
    if (feedback || selectedCategory) return;

    setSelectedCategory(category);
    const isCorrect = (category === 'private') === currentItem.isPrivate;

    if (isCorrect) {
      setFeedback('correct');
      setScore(score + 1);
      playSound(523.25, 0.2);
    } else {
      setFeedback('incorrect');
      playSound(200, 0.3);
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedCategory(null);
      if (currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setGameComplete(true);
      }
    }, 2500);
  };

  const playSound = (frequency: number, duration: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  if (gameComplete) {
    const percentage = Math.round((score / items.length) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : 1;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="text-center max-w-2xl">
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="mb-4 text-green-700">Awesome Work!</h2>
          <p className="text-2xl mb-4">You scored {score} out of {items.length}</p>
          
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map((star) => (
              <Star 
                key={star}
                className={`w-12 h-12 ${star <= stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
              />
            ))}
          </div>

          <div className="bg-green-50 border-4 border-green-300 rounded-3xl p-8 mb-8">
            <h3 className="mb-4 text-green-700">Key Points:</h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <Lock className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <p><strong>Private:</strong> Keep these things to yourself or share only with trusted family</p>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <p><strong>Public:</strong> It's okay for others to see or know these things</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setGameComplete(false);
              }}
              className="px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all hover:scale-105"
            >
              Play Again
            </button>
            <button
              onClick={onBack}
              className="px-8 py-4 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all hover:scale-105"
            >
              Back to Module
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4 md:p-8">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-10"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="absolute top-6 right-6 bg-white rounded-full px-6 py-3 shadow-lg z-10">
        <span>{currentIndex + 1}/{items.length}</span>
      </div>

      <div className="max-w-3xl mx-auto pt-20">
        <h2 className="text-center mb-8 text-green-700">What to Share Game</h2>

        <div className="bg-white rounded-3xl p-10 shadow-lg mb-8 text-center">
          <div className="text-8xl mb-6">{currentItem.emoji}</div>
          <h3 className="mb-4">{currentItem.text}</h3>
          <p className="text-gray-600 mb-8">Is this private or public?</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => handleCategorySelect('private')}
            disabled={feedback !== null || selectedCategory !== null}
            className={`bg-purple-100 border-4 border-purple-400 text-purple-700 rounded-3xl p-10 transition-all
              ${!feedback && !selectedCategory ? 'hover:bg-purple-200 hover:scale-105 active:scale-95' : 'opacity-60'}
              ${feedback === 'correct' && currentItem.isPrivate ? 'ring-8 ring-green-500 scale-110' : ''}
            `}
          >
            <Lock className="w-20 h-20 mx-auto mb-4" strokeWidth={2.5} />
            <h3 className="mb-2">Private</h3>
            <p className="text-sm opacity-80">Keep it to myself</p>
          </button>

          <button
            onClick={() => handleCategorySelect('public')}
            disabled={feedback !== null || selectedCategory !== null}
            className={`bg-blue-100 border-4 border-blue-400 text-blue-700 rounded-3xl p-10 transition-all
              ${!feedback && !selectedCategory ? 'hover:bg-blue-200 hover:scale-105 active:scale-95' : 'opacity-60'}
              ${feedback === 'correct' && !currentItem.isPrivate ? 'ring-8 ring-green-500 scale-110' : ''}
            `}
          >
            <Users className="w-20 h-20 mx-auto mb-4" strokeWidth={2.5} />
            <h3 className="mb-2">Public</h3>
            <p className="text-sm opacity-80">Okay to share</p>
          </button>
        </div>

        {/* Feedback */}
        {feedback === 'correct' && (
          <div className="bg-green-50 border-4 border-green-500 rounded-3xl p-8 text-center animate-bounce">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-green-700 mb-3">Perfect!</h3>
            <p className="text-xl">
              {currentItem.isPrivate 
                ? `Yes! "${currentItem.text}" is private. Keep it safe!` 
                : `Yes! "${currentItem.text}" is okay to do or share in public!`
              }
            </p>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="bg-orange-50 border-4 border-orange-500 rounded-3xl p-8 text-center">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-orange-700 mb-3">Let's learn!</h3>
            <p className="text-xl">
              {currentItem.isPrivate 
                ? `"${currentItem.text}" is actually private. Keep it safe!` 
                : `"${currentItem.text}" is public - it's okay in public!`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
