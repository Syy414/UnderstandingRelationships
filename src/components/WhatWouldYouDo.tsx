import { useState } from 'react';
import { ArrowLeft, Star, Home, RotateCcw, Volume2, MessageSquare, Check } from 'lucide-react';

interface WhatWouldYouDoProps {
  onBack: () => void;
}

type GameState = 'setup' | 'playing' | 'feedback' | 'complete';

interface Choice {
  id: string;
  action: string;
  isCorrect: boolean;
  icon: string;
}

interface Scenario {
  id: number;
  emoji: string;
  situation: string;
  context: string;
  choices: Choice[];
  explanation: string;
  category: 'boundaries' | 'assertiveness' | 'game-rules' | 'stranger-safety' | 'asking-permission';
}

const scenarioPool: Scenario[] = [
  // Boundaries - Unwanted Hug
  {
    id: 1,
    emoji: '🤗',
    situation: 'You don\'t want a hug from Auntie',
    context: 'Your aunt wants to give you a hug, but you don\'t feel like hugging right now.',
    category: 'boundaries',
    choices: [
      {
        id: 'scream',
        action: 'Scream and hit',
        isCorrect: false,
        icon: '😡'
      },
      {
        id: 'alternative',
        action: 'Say "No thank you, I want a high-five"',
        isCorrect: true,
        icon: '✋'
      }
    ],
    explanation: 'It\'s okay to say no to hugs! Offering another greeting like a high-five or wave is polite and respectful.'
  },

  // Assertiveness - Toy Taking
  {
    id: 2,
    emoji: '🧸',
    situation: 'A friend grabs your toy',
    context: 'Your friend took your toy without asking and is playing with it.',
    category: 'assertiveness',
    choices: [
      {
        id: 'words',
        action: 'Use words: "Please give that back"',
        isCorrect: true,
        icon: '🗣️'
      },
      {
        id: 'push',
        action: 'Push them',
        isCorrect: false,
        icon: '👊'
      }
    ],
    explanation: 'Using calm, clear words is the best way to solve problems. Pushing can hurt someone and doesn\'t solve anything.'
  },

  // Game Rules - Tag
  {
    id: 3,
    emoji: '🏃',
    situation: 'You are playing tag and someone tags you gently',
    context: 'You agreed to play tag on the playground, and a friend gently touches your arm to tag you.',
    category: 'game-rules',
    choices: [
      {
        id: 'game',
        action: 'It\'s part of the game (Safe)',
        isCorrect: true,
        icon: '✅'
      },
      {
        id: 'yell',
        action: 'Yell at them',
        isCorrect: false,
        icon: '😠'
      }
    ],
    explanation: 'When you agree to play a game like tag, gentle touching is part of the game rules. That\'s different from unwanted touching!'
  },

  // Stranger Safety - Hair Touching
  {
    id: 4,
    emoji: '💇',
    situation: 'A stranger touches your hair',
    context: 'Someone you don\'t know reaches out and touches your hair without asking.',
    category: 'stranger-safety',
    choices: [
      {
        id: 'smile',
        action: 'Smile and do nothing',
        isCorrect: false,
        icon: '😊'
      },
      {
        id: 'stop',
        action: 'Step back and say "Stop"',
        isCorrect: true,
        icon: '🛑'
      }
    ],
    explanation: 'Your body belongs to you! It\'s okay to tell anyone - even adults - to stop if they touch you without permission.'
  },

  // Asking Permission - Blocks
  {
    id: 5,
    emoji: '🧱',
    situation: 'You want to play with a friend\'s blocks',
    context: 'Your friend is building with blocks and you want to join in.',
    category: 'asking-permission',
    choices: [
      {
        id: 'take',
        action: 'Just take them',
        isCorrect: false,
        icon: '✊'
      },
      {
        id: 'ask',
        action: 'Ask "Can I play too?"',
        isCorrect: true,
        icon: '🙋'
      }
    ],
    explanation: 'Always ask before using someone else\'s things or joining their activity. Asking shows respect!'
  },

  // Boundaries - Unwanted Tickling
  {
    id: 6,
    emoji: '🤭',
    situation: 'Someone keeps tickling you even though you asked them to stop',
    context: 'A friend thinks it\'s funny to tickle you, but you don\'t like it and already said stop.',
    category: 'boundaries',
    choices: [
      {
        id: 'laugh',
        action: 'Just laugh along',
        isCorrect: false,
        icon: '😅'
      },
      {
        id: 'firm',
        action: 'Say firmly "STOP. I don\'t like that."',
        isCorrect: true,
        icon: '✋'
      }
    ],
    explanation: 'When someone doesn\'t stop after you ask nicely, use a firm voice. You have the right to say NO to any touch you don\'t like!'
  },

  // Stranger Safety - Following
  {
    id: 7,
    emoji: '🚶',
    situation: 'A stranger asks you to help find their lost puppy',
    context: 'An adult you don\'t know asks if you can help them look for their dog.',
    category: 'stranger-safety',
    choices: [
      {
        id: 'help',
        action: 'Go with them to help',
        isCorrect: false,
        icon: '🐕'
      },
      {
        id: 'no',
        action: 'Say no and tell a trusted adult',
        isCorrect: true,
        icon: '🛡️'
      }
    ],
    explanation: 'Adults should ask other adults for help, not children. If a stranger asks you for help, say no and tell your parent or teacher!'
  },

  // Assertiveness - Line Cutting
  {
    id: 8,
    emoji: '👥',
    situation: 'Someone cuts in front of you in line',
    context: 'You were waiting patiently in line, and someone pushes ahead of you.',
    category: 'assertiveness',
    choices: [
      {
        id: 'push',
        action: 'Push them back',
        isCorrect: false,
        icon: '👊'
      },
      {
        id: 'speak',
        action: 'Say "Excuse me, I was here first"',
        isCorrect: true,
        icon: '💬'
      }
    ],
    explanation: 'Standing up for yourself with polite but firm words works best. Being assertive doesn\'t mean being mean!'
  },

  // Asking Permission - Borrowing
  {
    id: 9,
    emoji: '✏️',
    situation: 'You want to borrow your friend\'s pencil',
    context: 'Your pencil broke and your friend has a nice one you\'d like to use.',
    category: 'asking-permission',
    choices: [
      {
        id: 'grab',
        action: 'Just take it off their desk',
        isCorrect: false,
        icon: '✊'
      },
      {
        id: 'ask',
        action: 'Ask "May I please borrow your pencil?"',
        isCorrect: true,
        icon: '🙏'
      }
    ],
    explanation: 'Asking permission shows respect for other people\'s belongings. They might say yes, or they might need it themselves!'
  },

  // Game Rules - Turns
  {
    id: 10,
    emoji: '🎮',
    situation: 'Your turn is over but you want to keep playing',
    context: 'You\'ve been playing a video game but it\'s your friend\'s turn now.',
    category: 'game-rules',
    choices: [
      {
        id: 'keep',
        action: 'Keep playing and ignore them',
        isCorrect: false,
        icon: '🙅'
      },
      {
        id: 'share',
        action: 'Hand them the controller and say "Your turn!"',
        isCorrect: true,
        icon: '🤝'
      }
    ],
    explanation: 'Taking turns is fair and keeps friendships strong. You\'ll get another turn soon!'
  },

  // Boundaries - Personal Items
  {
    id: 11,
    emoji: '🎒',
    situation: 'Someone opens your backpack without asking',
    context: 'A classmate starts looking through your backpack while you\'re away from your desk.',
    category: 'boundaries',
    choices: [
      {
        id: 'hit',
        action: 'Yell and grab it back roughly',
        isCorrect: false,
        icon: '😤'
      },
      {
        id: 'words',
        action: 'Say "That\'s my backpack. Please don\'t touch it."',
        isCorrect: true,
        icon: '🗣️'
      }
    ],
    explanation: 'Your belongings are yours! You can be firm about your boundaries while still being respectful.'
  },

  // Stranger Safety - Gifts
  {
    id: 12,
    emoji: '🍬',
    situation: 'A stranger offers you candy',
    context: 'Someone you don\'t know offers you a piece of candy when your parents aren\'t around.',
    category: 'stranger-safety',
    choices: [
      {
        id: 'take',
        action: 'Take it and say thank you',
        isCorrect: false,
        icon: '😊'
      },
      {
        id: 'refuse',
        action: 'Say "No thank you" and walk away',
        isCorrect: true,
        icon: '🚶'
      }
    ],
    explanation: 'Never take food, toys, or gifts from strangers. It\'s a safety rule, even if they seem nice!'
  },

  // Assertiveness - Sharing Your Feelings
  {
    id: 13,
    emoji: '😢',
    situation: 'Your friend said something that hurt your feelings',
    context: 'Your friend made a joke about you that made you feel sad.',
    category: 'assertiveness',
    choices: [
      {
        id: 'silent',
        action: 'Say nothing and stay sad',
        isCorrect: false,
        icon: '😔'
      },
      {
        id: 'express',
        action: 'Say "That hurt my feelings when you said that"',
        isCorrect: true,
        icon: '💬'
      }
    ],
    explanation: 'It\'s healthy to share your feelings! Real friends want to know if they hurt you so they can do better.'
  },

  // Asking Permission - Joining Games
  {
    id: 14,
    emoji: '⚽',
    situation: 'Kids are playing soccer and you want to join',
    context: 'Some kids are playing soccer at recess and it looks fun.',
    category: 'asking-permission',
    choices: [
      {
        id: 'join',
        action: 'Just run in and start playing',
        isCorrect: false,
        icon: '🏃'
      },
      {
        id: 'ask',
        action: 'Ask "Can I play with you?"',
        isCorrect: true,
        icon: '😊'
      }
    ],
    explanation: 'Asking to join is polite! The worst they can say is "maybe next time," and that\'s okay too.'
  },

  // Boundaries - Privacy
  {
    id: 15,
    emoji: '🚪',
    situation: 'You\'re in the bathroom and someone tries to open the door',
    context: 'You\'re using the bathroom and you hear the doorknob turning.',
    category: 'boundaries',
    choices: [
      {
        id: 'silent',
        action: 'Stay quiet and hope they go away',
        isCorrect: false,
        icon: '🤫'
      },
      {
        id: 'speak',
        action: 'Say "Someone\'s in here!"',
        isCorrect: true,
        icon: '🗣️'
      }
    ],
    explanation: 'You have a right to privacy! It\'s okay to speak up so people know the bathroom is occupied.'
  },
];

export function WhatWouldYouDo({ onBack }: WhatWouldYouDoProps) {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [sessionLength, setSessionLength] = useState<number>(10);
  const [selectedScenarios, setSelectedScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [waitingForChoice, setWaitingForChoice] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
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

  const handleReadNow = () => {
    setWaitingForChoice(true);
  };

  const handleChoice = (choice: Choice) => {
    if (!waitingForChoice) return;

    setSelectedChoice(choice);
    setIsCorrect(choice.isCorrect);
    
    if (choice.isCorrect) {
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
      setSelectedChoice(null);
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
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 p-4 md:p-8 flex items-center justify-center">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🤔</div>
            <h2 className="mb-4 text-orange-700">What Would You Do?</h2>
            <p className="text-xl text-gray-700 mb-2">Practice making good choices in tricky situations!</p>
            <p className="text-gray-600">Choose how many scenarios to solve:</p>
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
              Start Game!
            </button>
          </div>

          <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
            <h4 className="mb-3 text-purple-800">What You'll Learn:</h4>
            <ul className="space-y-2 text-purple-700">
              <li className="flex items-start gap-2">
                <span className="text-2xl">💪</span>
                <span><strong>Being Assertive:</strong> Standing up for yourself respectfully</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl">🛡️</span>
                <span><strong>Personal Boundaries:</strong> Saying no to things you don't want</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl">🗣️</span>
                <span><strong>Using Words:</strong> Solving problems by talking, not hitting</span>
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
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl mb-8">
            <div className="text-9xl mb-8">🎉</div>
            <h2 className="mb-4 text-orange-700">Amazing Choices!</h2>
            <p className="text-3xl mb-6">You made good choices</p>
            <p className="text-6xl mb-8">
              <span className="text-orange-600">{score}</span>
              <span className="text-gray-400"> / </span>
              <span className="text-gray-600">{sessionLength}</span>
              <span className="text-2xl text-gray-500"> times</span>
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
                ? 'You know how to handle tricky situations! 🌟'
                : percentage >= 70
                ? 'Great job learning to make good choices! 💪'
                : 'Keep practicing! Every choice helps you learn! 🎯'}
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
    const correctChoice = currentScenario.choices.find(c => c.isCorrect);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 p-4 md:p-8 flex items-center justify-center">
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
              {isCorrect ? 'Great Choice!' : 'Let\'s Learn Together!'}
            </h3>

            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="text-6xl mb-4">{currentScenario.emoji}</div>
              <p className="text-xl mb-2">{currentScenario.situation}</p>
              
              {selectedChoice && (
                <div className={`mt-4 p-4 rounded-xl border-4 ${
                  isCorrect 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-red-50 border-red-300'
                }`}>
                  <div className="text-4xl mb-2">{selectedChoice.icon}</div>
                  <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                    You chose: <strong>{selectedChoice.action}</strong>
                  </p>
                </div>
              )}

              {!isCorrect && correctChoice && (
                <div className="mt-4 p-4 bg-green-50 border-4 border-green-500 rounded-xl">
                  <p className="text-green-700 mb-2">
                    <strong>Better choice:</strong>
                  </p>
                  <div className="text-4xl mb-2">{correctChoice.icon}</div>
                  <p className="text-green-700">{correctChoice.action}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 mb-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                <strong>Why?</strong> {currentScenario.explanation}
              </p>
            </div>

            {!isCorrect && (
              <p className="text-orange-600 mb-6">
                That's okay! These situations can be confusing. You're learning! 💪
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 p-4 md:p-8">
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
            className="bg-gradient-to-r from-orange-400 to-yellow-600 h-full transition-all duration-500"
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
                ? '👇 What would you do? Tap your choice!' 
                : '👇 Read the scenario, then tap "Ready to Choose"!'}
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Card */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-orange-200">
          <div className="text-center mb-6">
            <div className="text-9xl mb-4">{currentScenario.emoji}</div>
            
            <div className="bg-orange-50 border-4 border-orange-300 rounded-2xl p-6 mb-4 relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full border-2 border-orange-300">
                <MessageSquare className="w-5 h-5 inline text-orange-600 mr-2" />
                <span className="text-sm">Situation</span>
              </div>
              <h3 className="text-orange-700 mb-3 mt-2">{currentScenario.situation}</h3>
              <p className="text-gray-700">{currentScenario.context}</p>
            </div>

            <div className="inline-block px-4 py-2 bg-purple-50 border-2 border-purple-300 rounded-full mb-6">
              <span className="text-sm text-purple-700 capitalize">{currentScenario.category.replace('-', ' ')}</span>
            </div>
          </div>

          <button
            onClick={handleReadNow}
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
                Choose your answer below!
              </span>
            ) : (
              'Ready to Choose'
            )}
          </button>
        </div>
      </div>

      {/* Choice Buttons */}
      <div className="max-w-3xl mx-auto">
        <h4 className="text-center mb-4 text-orange-700">What would YOU do?</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentScenario.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleChoice(choice)}
              disabled={!waitingForChoice}
              className={`group rounded-3xl p-8 border-4 transition-all ${
                waitingForChoice
                  ? 'bg-white border-blue-400 hover:bg-blue-50 hover:border-blue-500 hover:scale-105 cursor-pointer'
                  : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="text-6xl mb-4">{choice.icon}</div>
                <p className="text-center text-lg">{choice.action}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
