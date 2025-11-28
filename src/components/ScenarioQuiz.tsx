import { useState } from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown, Users, RotateCcw, Star } from 'lucide-react';

interface ScenarioQuizProps {
  onBack: () => void;
}

type GameState = 'setup' | 'choice' | 'feedback-incorrect' | 'feedback-correct' | 'complete';

const scenarios = [
  {
    id: 1,
    title: 'Stranger at the Park',
    scene: '🏞️',
    character: '🧑',
    circleType: 'red',
    prompt: "Hi! I lost my puppy. Can you help me look for it in my car?",
    choices: [
      { id: 'go', label: 'Go with them', icon: ThumbsUp, safe: false },
      { id: 'no', label: "Say 'No'", icon: ThumbsDown, safe: true },
      { id: 'parent', label: 'Find my parent', icon: Users, safe: true },
    ],
    incorrectFeedback: "We never go anywhere with someone from the Red Circle (Strangers).",
    correctFeedback: "Great job! Always find a trusted adult when a stranger asks you to go somewhere.",
  },
  {
    id: 2,
    title: 'Friend Wants Your Password',
    scene: '🏫',
    character: '👦',
    circleType: 'green',
    prompt: "Can you tell me your tablet password so I can play on it?",
    choices: [
      { id: 'yes', label: 'Tell them', icon: ThumbsUp, safe: false },
      { id: 'no', label: "Say 'No'", icon: ThumbsDown, safe: true },
      { id: 'parent', label: 'Ask a grown-up', icon: Users, safe: true },
    ],
    incorrectFeedback: "Passwords are private! Even friends from the Green Circle shouldn't know them.",
    correctFeedback: "Perfect! Passwords should stay private, even from friends.",
  },
  {
    id: 3,
    title: 'Someone Asks Where You Live',
    scene: '🏬',
    character: '👨‍💼',
    circleType: 'yellow',
    prompt: "What's your address? I want to send you a birthday card!",
    choices: [
      { id: 'tell', label: 'Tell them my address', icon: ThumbsUp, safe: false },
      { id: 'no', label: "Say 'No thanks'", icon: ThumbsDown, safe: true },
      { id: 'parent', label: 'Ask my parent first', icon: Users, safe: true },
    ],
    incorrectFeedback: "Your address is private information. Only share it with trusted adults.",
    correctFeedback: "Smart! Always check with your parents before sharing your address.",
  },
  {
    id: 4,
    title: 'Uncomfortable Touch',
    scene: '🏫',
    character: '👤',
    circleType: 'yellow',
    prompt: "Someone keeps tickling you even though you asked them to stop.",
    choices: [
      { id: 'laugh', label: 'Just laugh it off', icon: ThumbsUp, safe: false },
      { id: 'stop', label: 'Say STOP firmly', icon: ThumbsDown, safe: true },
      { id: 'adult', label: 'Tell a teacher', icon: Users, safe: true },
    ],
    incorrectFeedback: "You have the right to say stop! Your body belongs to you.",
    correctFeedback: "Excellent! Always speak up when something makes you uncomfortable.",
  },
  {
    id: 5,
    title: 'Secret Gift',
    scene: '🎁',
    character: '🧔',
    circleType: 'yellow',
    prompt: "Here's a present, but don't tell your parents. It's our secret!",
    choices: [
      { id: 'take', label: 'Take it and keep the secret', icon: ThumbsUp, safe: false },
      { id: 'no', label: "Say 'No thank you'", icon: ThumbsDown, safe: true },
      { id: 'parent', label: 'Tell my parent', icon: Users, safe: true },
    ],
    incorrectFeedback: "Secrets about gifts are not okay. Safe surprises can be told to parents!",
    correctFeedback: "Great thinking! Surprises are okay, but secrets like this are not!",
  },
  {
    id: 6,
    title: 'Online Chat Request',
    scene: '💻',
    character: '👾',
    circleType: 'red',
    prompt: "Someone you don't know sends you a message asking to video chat.",
    choices: [
      { id: 'chat', label: 'Start the video chat', icon: ThumbsUp, safe: false },
      { id: 'ignore', label: 'Ignore and block', icon: ThumbsDown, safe: true },
      { id: 'parent', label: 'Tell a parent', icon: Users, safe: true },
    ],
    incorrectFeedback: "Never chat with strangers online! Tell a trusted adult.",
    correctFeedback: "Smart choice! Only chat with people you know in real life with parent permission.",
  },
];

export function ScenarioQuiz({ onBack }: ScenarioQuizProps) {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>('setup');
  const [score, setScore] = useState(0);

  const currentScenario = scenarios[currentScenarioIndex];

  const handleChoice = (safe: boolean) => {
    if (safe) {
      setGameState('feedback-correct');
      setScore(score + 1);
      playSound('correct');
    } else {
      setGameState('feedback-incorrect');
      playSound('incorrect');
    }
  };

  const handleTryAgain = () => {
    setGameState('choice');
  };

  const handleNextScenario = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setGameState('setup');
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
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.stop(audioContext.currentTime + 0.2);
      } else {
        oscillator.frequency.value = 200;
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
      
      oscillator.start(audioContext.currentTime);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const getCircleColor = (circleType: string) => {
    const colors: Record<string, string> = {
      red: 'bg-red-100 border-red-500 text-red-700',
      green: 'bg-green-100 border-green-500 text-green-700',
      blue: 'bg-blue-100 border-blue-500 text-blue-700',
      yellow: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    };
    return colors[circleType] || '';
  };

  if (gameState === 'complete') {
    const percentage = Math.round((score / scenarios.length) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : 1;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="text-center max-w-2xl">
          <div className="text-8xl mb-8">🎉</div>
          <h2 className="mb-4 text-green-700">All Scenarios Complete!</h2>
          <p className="text-2xl mb-4">You scored {score} out of {scenarios.length}!</p>
          
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map((star) => (
              <Star 
                key={star}
                className={`w-12 h-12 ${star <= stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
              />
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setCurrentScenarioIndex(0);
                setScore(0);
                setGameState('setup');
              }}
              className="px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all hover:scale-105 flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
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
        <span>Scenario {currentScenarioIndex + 1}/{scenarios.length}</span>
      </div>

      <div className="max-w-4xl mx-auto pt-20">
        <h2 className="text-center mb-8 text-green-700">
          Safety Scenarios
        </h2>

        {/* Setup/Scene Screen */}
        {gameState === 'setup' && (
          <div className="text-center">
            <h3 className="mb-8">{currentScenario.title}</h3>
            
            <div className="bg-white rounded-3xl p-12 shadow-lg mb-8">
              <div className="text-8xl mb-8">{currentScenario.scene}</div>
              <div className="text-6xl mb-8">{currentScenario.character}</div>
              
              <div className="bg-blue-50 border-4 border-blue-300 rounded-2xl p-6 mb-8 relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full border-2 border-blue-300">
                  <span className="text-sm">Situation:</span>
                </div>
                <p className="mt-4 text-xl">{currentScenario.prompt}</p>
              </div>
            </div>

            <button
              onClick={() => setGameState('choice')}
              className="px-12 py-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all hover:scale-105 text-xl"
            >
              What should you do?
            </button>
          </div>
        )}

        {/* Choice Screen */}
        {gameState === 'choice' && (
          <div className="text-center">
            <h3 className="mb-8">What should you do?</h3>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-4xl">{currentScenario.scene}</div>
                <div className="text-4xl">{currentScenario.character}</div>
              </div>
              <p className="text-gray-600 italic">"{currentScenario.prompt}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentScenario.choices.map((choice) => {
                const Icon = choice.icon;
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice.safe)}
                    className="bg-white border-4 border-gray-300 rounded-3xl p-8 hover:border-green-400 hover:bg-green-50 transition-all hover:scale-105 active:scale-95"
                  >
                    <Icon className="w-16 h-16 mx-auto mb-4 text-gray-700" />
                    <p className="text-xl">{choice.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Incorrect Feedback */}
        {gameState === 'feedback-incorrect' && (
          <div className="text-center">
            <div className="bg-orange-50 border-8 border-orange-500 rounded-3xl p-12 shadow-2xl mb-8">
              <div className="text-8xl mb-6">🤔</div>
              <h3 className="mb-6 text-orange-700">Let's think about this...</h3>
              
              <div className={`inline-block border-4 rounded-2xl p-6 mb-6 ${getCircleColor(currentScenario.circleType)}`}>
                <div className="text-4xl mb-4">{currentScenario.character}</div>
                <p className="capitalize">{currentScenario.circleType} Circle</p>
              </div>
              
              <p className="text-xl mb-8">{currentScenario.incorrectFeedback}</p>
            </div>

            <button
              onClick={handleTryAgain}
              className="px-12 py-6 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all hover:scale-105 text-xl flex items-center gap-3 mx-auto"
            >
              <RotateCcw className="w-6 h-6" />
              Try Again
            </button>
          </div>
        )}

        {/* Correct Feedback */}
        {gameState === 'feedback-correct' && (
          <div className="text-center">
            <div className="bg-green-50 border-8 border-green-500 rounded-3xl p-12 shadow-2xl mb-8">
              <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <Star className="w-20 h-20 text-white fill-white" />
              </div>
              <h3 className="mb-6 text-green-700">Safe Choice! Great Job!</h3>
              
              <div className="text-6xl mb-6">✅</div>
              
              <p className="text-xl mb-8">{currentScenario.correctFeedback}</p>
            </div>

            <button
              onClick={handleNextScenario}
              className="px-12 py-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all hover:scale-105 text-xl"
            >
              {currentScenarioIndex < scenarios.length - 1 ? 'Next Scenario' : 'Finish'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
