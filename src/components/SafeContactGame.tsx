import { useState } from 'react';
import { ArrowLeft, Check, X, Star } from 'lucide-react';
import { getCharacterImage } from '../utils/imageUtils';

interface SafeContactGameProps {
  onBack: () => void;
}

interface Scenario {
  id: number;
  situation: string;
  person: string;
  personEmoji: string;
  circleColor: string;
  action: string;
  isSafe: boolean;
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    id: 1,
    situation: 'Your mom gives you a hug',
    person: 'Mom',
    personEmoji: '👩',
    circleColor: 'blue',
    action: 'Hug',
    isSafe: true,
    explanation: 'Family hugs are safe and loving!'
  },
  {
    id: 2,
    situation: 'A stranger at the park tries to hold your hand',
    person: 'Stranger',
    personEmoji: '🧑',
    circleColor: 'red',
    action: 'Hold hands',
    isSafe: false,
    explanation: 'Never hold hands with strangers. Say no and find a trusted adult.'
  },
  {
    id: 3,
    situation: 'Your doctor checks your heartbeat',
    person: 'Doctor',
    personEmoji: '👨‍⚕️',
    circleColor: 'orange',
    action: 'Medical check',
    isSafe: true,
    explanation: 'Doctors can check you, but a parent should be there too.'
  },
  {
    id: 4,
    situation: 'Someone you just met asks to tickle you',
    person: 'New Person',
    personEmoji: '🧔',
    circleColor: 'red',
    action: 'Tickle',
    isSafe: false,
    explanation: 'Only family and very close friends you trust can tickle you, and only if you say yes!'
  },
  {
    id: 5,
    situation: 'Your teacher gives you a high-five',
    person: 'Teacher',
    personEmoji: '👨‍🏫',
    circleColor: 'orange',
    action: 'High-five',
    isSafe: true,
    explanation: 'High-fives are a safe way to celebrate!'
  },
  {
    id: 6,
    situation: 'Your best friend wants to play tag',
    person: 'Best Friend',
    personEmoji: '👦',
    circleColor: 'green',
    action: 'Tag game',
    isSafe: true,
    explanation: 'Playing games like tag with friends is fun and safe!'
  },
  {
    id: 7,
    situation: 'Someone you don\'t know well asks to take a photo of you alone',
    person: 'Acquaintance',
    personEmoji: '👨‍💼',
    circleColor: 'yellow',
    action: 'Take photo alone',
    isSafe: false,
    explanation: 'Photos should only be taken by trusted adults or with your parent\'s permission.'
  },
  {
    id: 8,
    situation: 'Grandpa asks for a hug goodbye',
    person: 'Grandpa',
    personEmoji: '👴',
    circleColor: 'blue',
    action: 'Goodbye hug',
    isSafe: true,
    explanation: 'Hugging family is safe, but you can always say if you prefer a wave or high-five!'
  },
  {
    id: 9,
    situation: 'A stranger offers you candy and asks you to get in their car',
    person: 'Stranger',
    personEmoji: '🚗',
    circleColor: 'red',
    action: 'Get in car',
    isSafe: false,
    explanation: 'Never go anywhere with strangers! Find a trusted adult immediately.'
  },
  {
    id: 10,
    situation: 'Your coach helps you stretch before practice',
    person: 'Coach',
    personEmoji: '⚽',
    circleColor: 'orange',
    action: 'Stretching help',
    isSafe: true,
    explanation: 'Coaches can help with sports activities in safe, public places.'
  }
];

export function SafeContactGame({ onBack }: SafeContactGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  const currentScenario = scenarios[currentIndex];

  const handleChoice = (userSaysIsSafe: boolean) => {
    if (feedback) return;

    const isCorrect = userSaysIsSafe === currentScenario.isSafe;
    
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
      if (currentIndex < scenarios.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setGameComplete(true);
      }
    }, 3000);
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

  const getCircleInfo = (color: string) => {
    const circles: Record<string, { name: string, bg: string, border: string }> = {
      blue: { name: 'Family', bg: 'bg-blue-100', border: 'border-blue-500' },
      green: { name: 'Friends', bg: 'bg-green-100', border: 'border-green-500' },
      yellow: { name: 'Acquaintances', bg: 'bg-yellow-100', border: 'border-yellow-500' },
      orange: { name: 'Community Helpers', bg: 'bg-orange-100', border: 'border-orange-500' },
      red: { name: 'Strangers', bg: 'bg-red-100', border: 'border-red-500' }
    };
    return circles[color];
  };

  if (gameComplete) {
    const percentage = Math.round((score / scenarios.length) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : 1;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="text-center max-w-2xl">
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="mb-4 text-purple-700">Great Job!</h2>
          <p className="text-2xl mb-4">You scored {score} out of {scenarios.length}</p>
          
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map((star) => (
              <Star 
                key={star}
                className={`w-12 h-12 ${star <= stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
              />
            ))}
          </div>

          <div className="bg-purple-50 border-4 border-purple-300 rounded-3xl p-8 mb-8">
            <h3 className="mb-4 text-purple-700">Remember:</h3>
            <ul className="text-left space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <span>You can always say "No" to touches that feel uncomfortable</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <span>Tell a trusted adult if someone makes you feel unsafe</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <span>Safe touches should never be secrets</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setGameComplete(false);
              }}
              className="px-8 py-4 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-all hover:scale-105"
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

  const circleInfo = getCircleInfo(currentScenario.circleColor);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-10"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="absolute top-6 right-6 bg-white rounded-full px-6 py-3 shadow-lg z-10">
        <span>Question {currentIndex + 1}/{scenarios.length}</span>
      </div>

      <div className="max-w-3xl mx-auto pt-20">
        <h2 className="text-center mb-8 text-purple-700">Safe Touch Game</h2>

        <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              {(() => {
                const imageSrc = getCharacterImage(currentScenario.person, currentScenario.personEmoji);
                if (imageSrc && (currentScenario.person === 'Mom' || currentScenario.person === 'Dad')) {
                  return (
                    <img
                      src={imageSrc}
                      alt={currentScenario.person}
                      className="w-28 h-28 rounded-full object-cover border-4 border-purple-300 shadow-lg"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          const emojiDiv = document.createElement('div');
                          emojiDiv.className = 'text-7xl';
                          emojiDiv.textContent = currentScenario.personEmoji;
                          target.parentElement.appendChild(emojiDiv);
                        }
                      }}
                    />
                  );
                } else {
                  return <div className="text-7xl">{currentScenario.personEmoji}</div>;
                }
              })()}
            </div>
            <div className={`inline-block ${circleInfo.bg} ${circleInfo.border} border-3 rounded-2xl px-6 py-3 mb-4`}>
              <p className="text-sm opacity-70">{circleInfo.name} Circle</p>
              <p>{currentScenario.person}</p>
            </div>
          </div>

          <div className="bg-blue-50 border-4 border-blue-300 rounded-2xl p-6 mb-6">
            <p className="text-xl text-center">{currentScenario.situation}</p>
          </div>

          <h3 className="text-center mb-6">Is this safe?</h3>

          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => handleChoice(true)}
              disabled={feedback !== null}
              className={`bg-green-100 border-4 border-green-400 text-green-700 rounded-3xl p-8 transition-all
                ${!feedback ? 'hover:bg-green-200 hover:scale-105 active:scale-95' : 'opacity-60'}
                ${feedback === 'correct' && currentScenario.isSafe ? 'ring-8 ring-green-500 scale-110' : ''}
              `}
            >
              <Check className="w-16 h-16 mx-auto mb-3" strokeWidth={3} />
              <p className="text-xl">Safe</p>
            </button>

            <button
              onClick={() => handleChoice(false)}
              disabled={feedback !== null}
              className={`bg-red-100 border-4 border-red-400 text-red-700 rounded-3xl p-8 transition-all
                ${!feedback ? 'hover:bg-red-200 hover:scale-105 active:scale-95' : 'opacity-60'}
                ${feedback === 'correct' && !currentScenario.isSafe ? 'ring-8 ring-green-500 scale-110' : ''}
              `}
            >
              <X className="w-16 h-16 mx-auto mb-3" strokeWidth={3} />
              <p className="text-xl">Not Safe</p>
            </button>
          </div>
        </div>

        {/* Feedback */}
        {feedback === 'correct' && (
          <div className="bg-green-50 border-4 border-green-500 rounded-3xl p-8 text-center animate-bounce">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-green-700 mb-4">Correct!</h3>
            <p className="text-xl">{currentScenario.explanation}</p>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="bg-orange-50 border-4 border-orange-500 rounded-3xl p-8 text-center">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-orange-700 mb-4">Let's learn together!</h3>
            <p className="text-xl mb-2">
              This is <strong>{currentScenario.isSafe ? 'safe' : 'not safe'}</strong>.
            </p>
            <p className="text-lg">{currentScenario.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
