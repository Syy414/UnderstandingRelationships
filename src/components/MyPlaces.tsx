import { useState, useEffect } from 'react';
import { Home, Users, Lock, Unlock, Star, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, School, ShoppingCart, Building2, MapPin, Clock, Heart } from 'lucide-react';

interface MyPlacesProps {
  onBack: () => void;
}

type Level = 1 | 2 | 3 | 4 | 5;
type GameState = 'levelSelect' | 'playing' | 'levelComplete';

// Sound effect helpers
const playSound = (frequency: number, duration: number, type: 'success' | 'error' | 'neutral' = 'neutral') => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type === 'success' ? 'sine' : type === 'error' ? 'triangle' : 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    console.log('Audio not supported');
  }
};

const playSuccess = () => {
  playSound(523.25, 0.15, 'success');
  setTimeout(() => playSound(659.25, 0.2, 'success'), 150);
};

const playError = () => {
  playSound(200, 0.3, 'error');
};

const playNeutral = () => {
  playSound(440, 0.1, 'neutral');
};

export function MyPlaces({ onBack }: MyPlacesProps) {
  const [gameState, setGameState] = useState<GameState>('levelSelect');
  const [currentLevel, setCurrentLevel] = useState<Level>(1);
  const [levelProgress, setLevelProgress] = useState({
    1: { completed: false, stars: 0 },
    2: { completed: false, stars: 0 },
    3: { completed: false, stars: 0 },
    4: { completed: false, stars: 0 },
    5: { completed: false, stars: 0 },
  });

  const startLevel = (level: Level) => {
    setCurrentLevel(level);
    setGameState('playing');
  };

  const completeLevel = (stars: number) => {
    setLevelProgress(prev => ({
      ...prev,
      [currentLevel]: { completed: true, stars }
    }));
    setGameState('levelComplete');
  };

  const backToLevelSelect = () => {
    setGameState('levelSelect');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4 md:p-8">
      {gameState === 'levelSelect' && (
        <LevelSelectScreen 
          onBack={onBack} 
          onStartLevel={startLevel}
          levelProgress={levelProgress}
        />
      )}
      
      {gameState === 'playing' && currentLevel === 1 && (
        <Level1HomeSafeZones onComplete={completeLevel} onBack={backToLevelSelect} />
      )}
      
      {gameState === 'playing' && currentLevel === 2 && (
        <Level2CommunityPlaces onComplete={completeLevel} onBack={backToLevelSelect} />
      )}
      
      {gameState === 'playing' && currentLevel === 3 && (
        <Level3PrivatePublic onComplete={completeLevel} onBack={backToLevelSelect} />
      )}
      
      {gameState === 'playing' && currentLevel === 4 && (
        <Level4SocialStories onComplete={completeLevel} onBack={backToLevelSelect} />
      )}
      
      {gameState === 'playing' && currentLevel === 5 && (
        <Level5RoutineBuilder onComplete={completeLevel} onBack={backToLevelSelect} />
      )}
      
      {gameState === 'levelComplete' && (
        <LevelCompleteScreen 
          level={currentLevel}
          stars={levelProgress[currentLevel].stars}
          onContinue={backToLevelSelect}
        />
      )}
    </div>
  );
}

// Level Select Screen
function LevelSelectScreen({ onBack, onStartLevel, levelProgress }: any) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Menu</span>
        </button>
        <h1 className="text-green-700">My Places Adventure</h1>
        <div className="w-24"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LevelCard
          level={1}
          title="Home Safe Zones"
          description="Learn about private and family spaces"
          icon={<Home className="w-12 h-12" />}
          color="blue"
          stars={levelProgress[1].stars}
          completed={levelProgress[1].completed}
          onStart={() => onStartLevel(1)}
        />
        
        <LevelCard
          level={2}
          title="Community Places"
          description="Explore school, park, and stores"
          icon={<MapPin className="w-12 h-12" />}
          color="green"
          stars={levelProgress[2].stars}
          completed={levelProgress[2].completed}
          onStart={() => onStartLevel(2)}
        />
        
        <LevelCard
          level={3}
          title="Talk or Keep Private"
          description="What to share and what to keep private"
          icon={<Lock className="w-12 h-12" />}
          color="purple"
          stars={levelProgress[3].stars}
          completed={levelProgress[3].completed}
          onStart={() => onStartLevel(3)}
        />
        
        <LevelCard
          level={4}
          title="Social Stories"
          description="Learn safety rules through stories"
          icon={<AlertCircle className="w-12 h-12" />}
          color="orange"
          stars={levelProgress[4].stars}
          completed={levelProgress[4].completed}
          onStart={() => onStartLevel(4)}
        />
        
        <LevelCard
          level={5}
          title="My Safe Routine"
          description="Build your daily safety routine"
          icon={<Clock className="w-12 h-12" />}
          color="pink"
          stars={levelProgress[5].stars}
          completed={levelProgress[5].completed}
          onStart={() => onStartLevel(5)}
        />
      </div>
    </div>
  );
}

function LevelCard({ level, title, description, icon, color, stars, completed, onStart }: any) {
  const colorClasses = {
    blue: 'bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-700',
    green: 'bg-green-100 hover:bg-green-200 border-green-300 text-green-700',
    purple: 'bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-700',
    orange: 'bg-orange-100 hover:bg-orange-200 border-orange-300 text-orange-700',
    pink: 'bg-pink-100 hover:bg-pink-200 border-pink-300 text-pink-700',
  };

  return (
    <button
      onClick={() => { playNeutral(); onStart(); }}
      className={`${colorClasses[color]} border-4 rounded-3xl p-6 flex flex-col items-center gap-4 transition-all hover:scale-105 active:scale-95 relative`}
    >
      {completed && (
        <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
      )}
      
      <div className="mb-2">{icon}</div>
      
      <div className="text-center">
        <div className="mb-1 opacity-70">Level {level}</div>
        <h3 className="mb-2">{title}</h3>
        <p className="text-sm opacity-80">{description}</p>
      </div>
      
      {stars > 0 && (
        <div className="flex gap-1 mt-2">
          {[1, 2, 3].map(i => (
            <Star
              key={i}
              className={`w-5 h-5 ${i <= stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      )}
    </button>
  );
}

// Level Complete Screen
function LevelCompleteScreen({ level, stars, onContinue }: any) {
  useEffect(() => {
    playSuccess();
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="bg-white rounded-3xl p-12 shadow-2xl">
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="mb-4 text-green-700">Level {level} Complete!</h2>
          <p className="text-gray-600 mb-6">Great job learning about safe spaces!</p>
          
          <div className="flex gap-2 justify-center mb-8">
            {[1, 2, 3].map(i => (
              <Star
                key={i}
                className={`w-12 h-12 ${i <= stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
        </div>
        
        <button
          onClick={onContinue}
          className="px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all active:scale-95 shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// LEVEL 1: Home Safe Zones
function Level1HomeSafeZones({ onComplete, onBack }: any) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedBehavior, setSelectedBehavior] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const rooms = [
    { id: 'bedroom', name: 'Bedroom', icon: '🛏️', type: 'private' },
    { id: 'bathroom', name: 'Bathroom', icon: '🚿', type: 'private' },
    { id: 'living-room', name: 'Living Room', icon: '🛋️', type: 'family' },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳', type: 'family' },
  ];

  const behaviors = [
    { id: 'changing', text: 'Getting dressed', correctRoom: 'bedroom', icon: '👕' },
    { id: 'bathing', text: 'Taking a bath', correctRoom: 'bathroom', icon: '🛁' },
    { id: 'watching-tv', text: 'Watching TV with family', correctRoom: 'living-room', icon: '📺' },
    { id: 'eating', text: 'Eating dinner', correctRoom: 'kitchen', icon: '🍽️' },
  ];

  const currentBehavior = behaviors[step];

  const handleRoomSelect = (roomId: string) => {
    if (!selectedBehavior) {
      setSelectedBehavior(roomId);
      playNeutral();
    }
  };

  const handleSubmit = () => {
    if (selectedBehavior === currentBehavior.correctRoom) {
      playSuccess();
      setScore(score + 1);
      setFeedback('Perfect! That\'s the right place! ✨');
      
      setTimeout(() => {
        if (step < behaviors.length - 1) {
          setStep(step + 1);
          setSelectedBehavior(null);
          setFeedback(null);
        } else {
          onComplete(score + 1 >= 3 ? 3 : score + 1 >= 2 ? 2 : 1);
        }
      }, 2000);
    } else {
      playError();
      setFeedback('Let\'s think about this... Where would this be private and safe?');
      setSelectedBehavior(null);
      
      setTimeout(() => {
        setFeedback(null);
      }, 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h2 className="text-blue-700">Home Safe Zones</h2>
        <div className="flex gap-1">
          {behaviors.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${i < step ? 'bg-green-500' : i === step ? 'bg-blue-500' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl mb-6">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{currentBehavior.icon}</div>
          <h3 className="mb-2">{currentBehavior.text}</h3>
          <p className="text-gray-600">Tap the best room for this activity</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => handleRoomSelect(room.id)}
              className={`p-6 rounded-2xl border-4 transition-all ${
                selectedBehavior === room.id
                  ? 'border-blue-500 bg-blue-100 scale-105'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="text-5xl mb-3">{room.icon}</div>
              <div>{room.name}</div>
              {room.type === 'private' && (
                <div className="mt-2 text-xs text-gray-500 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Private</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {selectedBehavior && !feedback && (
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all active:scale-95 shadow-lg"
          >
            Check Answer
          </button>
        )}

        {feedback && (
          <div className={`p-6 rounded-2xl text-center ${
            feedback.includes('Perfect') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            <p>{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// LEVEL 2: Community Places Explorer
function Level2CommunityPlaces({ onComplete, onBack }: any) {
  const [currentPlace, setCurrentPlace] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const places = [
    {
      name: 'School',
      icon: <School className="w-16 h-16" />,
      color: 'blue',
      scenarios: [
        {
          behavior: 'Talking about your weekend',
          icon: '💬',
          correct: true,
          explanation: 'Yes! We can share fun stories at school.'
        },
        {
          behavior: 'Changing clothes in classroom',
          icon: '👕',
          correct: false,
          explanation: 'No. We change clothes in private places like bathrooms or changing rooms.'
        }
      ]
    },
    {
      name: 'Playground',
      icon: <MapPin className="w-16 h-16" />,
      color: 'green',
      scenarios: [
        {
          behavior: 'Playing with friends',
          icon: '⚽',
          correct: true,
          explanation: 'Yes! Playgrounds are for playing together.'
        },
        {
          behavior: 'Going to the bathroom',
          icon: '🚽',
          correct: false,
          explanation: 'No. We use bathrooms for private activities, not playgrounds.'
        }
      ]
    },
    {
      name: 'Shopping Mall',
      icon: <ShoppingCart className="w-16 h-16" />,
      color: 'purple',
      scenarios: [
        {
          behavior: 'Walking with your family',
          icon: '🚶',
          correct: true,
          explanation: 'Yes! We can walk around the mall with trusted adults.'
        },
        {
          behavior: 'Getting undressed',
          icon: '👔',
          correct: false,
          explanation: 'No. We keep our clothes on in public places. We only change in fitting rooms or private spaces.'
        }
      ]
    }
  ];

  const currentScenarioData = places[currentPlace].scenarios[currentScenario];

  const handleAnswer = (answer: boolean) => {
    if (answer === currentScenarioData.correct) {
      playSuccess();
      setScore(score + 1);
      setFeedback('✨ ' + currentScenarioData.explanation);
    } else {
      playError();
      setFeedback('🤔 ' + currentScenarioData.explanation);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentScenario < places[currentPlace].scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
      } else if (currentPlace < places.length - 1) {
        setCurrentPlace(currentPlace + 1);
        setCurrentScenario(0);
      } else {
        onComplete(score + 1 >= 5 ? 3 : score + 1 >= 3 ? 2 : 1);
      }
    }, 3000);
  };

  const progress = ((currentPlace * 2 + currentScenario) / (places.length * 2)) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h2 className="text-green-700">Community Places</h2>
        <div className="w-24 bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="mb-4 text-blue-600">
            {places[currentPlace].icon}
          </div>
          <h3 className="mb-6">{places[currentPlace].name}</h3>
          
          <div className="text-6xl mb-6">{currentScenarioData.icon}</div>
          <h3 className="mb-4">{currentScenarioData.behavior}</h3>
          <p className="text-gray-600">Is this OK to do here?</p>
        </div>

        {!feedback ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(true)}
              className="p-8 bg-green-100 hover:bg-green-200 border-4 border-green-300 rounded-2xl transition-all active:scale-95"
            >
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-600" />
              <div className="text-green-700">Yes, OK</div>
            </button>
            
            <button
              onClick={() => handleAnswer(false)}
              className="p-8 bg-red-100 hover:bg-red-200 border-4 border-red-300 rounded-2xl transition-all active:scale-95"
            >
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-600" />
              <div className="text-red-700">No, Not OK</div>
            </button>
          </div>
        ) : (
          <div className="p-8 bg-blue-50 rounded-2xl text-center">
            <p className="text-blue-900">{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// LEVEL 3: Talk or Keep Private
function Level3PrivatePublic({ onComplete, onBack }: any) {
  const [currentCard, setCurrentCard] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const cards = [
    {
      topic: 'Your favorite color',
      icon: '🎨',
      correct: 'public',
      explanation: 'Yes! We can share our favorite things with others.'
    },
    {
      topic: 'Your home address',
      icon: '🏠',
      correct: 'private',
      explanation: 'Good! We only share our address with trusted adults, not strangers.'
    },
    {
      topic: 'What you like to play',
      icon: '🎮',
      correct: 'public',
      explanation: 'Yes! Talking about games and activities is fun to share.'
    },
    {
      topic: 'Your body under clothes',
      icon: '🩱',
      correct: 'private',
      explanation: 'Exactly! Our private body parts stay private.'
    },
    {
      topic: 'Your favorite food',
      icon: '🍕',
      correct: 'public',
      explanation: 'Yes! We can talk about food we like with friends.'
    },
    {
      topic: 'Someone touching you in private areas',
      icon: '🚫',
      correct: 'private',
      explanation: 'Important! If this happens, we tell a trusted adult right away.'
    }
  ];

  const currentCardData = cards[currentCard];

  const handleAnswer = (answer: 'public' | 'private') => {
    if (answer === currentCardData.correct) {
      playSuccess();
      setScore(score + 1);
      setFeedback('✨ ' + currentCardData.explanation);
    } else {
      playError();
      setFeedback('Let me help you understand: ' + currentCardData.explanation);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentCard < cards.length - 1) {
        setCurrentCard(currentCard + 1);
      } else {
        onComplete(score + 1 >= 5 ? 3 : score + 1 >= 3 ? 2 : 1);
      }
    }, 3500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h2 className="text-purple-700">Talk or Keep Private?</h2>
        <div className="flex gap-1">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i < currentCard ? 'bg-green-500' : i === currentCard ? 'bg-purple-500' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="text-7xl mb-6">{currentCardData.icon}</div>
          <h3 className="mb-4">{currentCardData.topic}</h3>
          <p className="text-gray-600">Should we share this with others or keep it private?</p>
        </div>

        {!feedback ? (
          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => handleAnswer('public')}
              className="p-8 bg-blue-100 hover:bg-blue-200 border-4 border-blue-300 rounded-2xl transition-all active:scale-95"
            >
              <Users className="w-16 h-16 mx-auto mb-3 text-blue-600" />
              <h4 className="mb-2 text-blue-700">Share with Others</h4>
              <p className="text-sm text-blue-600">OK to talk about</p>
            </button>
            
            <button
              onClick={() => handleAnswer('private')}
              className="p-8 bg-purple-100 hover:bg-purple-200 border-4 border-purple-300 rounded-2xl transition-all active:scale-95"
            >
              <Lock className="w-16 h-16 mx-auto mb-3 text-purple-600" />
              <h4 className="mb-2 text-purple-700">Keep Private</h4>
              <p className="text-sm text-purple-600">Keep to myself</p>
            </button>
          </div>
        ) : (
          <div className="p-8 bg-green-50 rounded-2xl text-center">
            <p className="text-green-900">{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// LEVEL 4: Social Story Scenarios
function Level4SocialStories({ onComplete, onBack }: any) {
  const [currentStory, setCurrentStory] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const stories = [
    {
      situation: 'A stranger asks you where you live.',
      icon: '👤',
      question: 'What should you say?',
      options: [
        {
          text: 'Tell them your address',
          correct: false,
          response: 'We only share our address with trusted adults like parents or teachers.'
        },
        {
          text: 'Say "I don\'t share that"',
          correct: true,
          response: 'Perfect! It\'s OK to say no to strangers asking personal questions.'
        }
      ]
    },
    {
      situation: 'Someone you don\'t know well wants to give you a gift.',
      icon: '🎁',
      question: 'What should you do?',
      options: [
        {
          text: 'Take it and say thank you',
          correct: false,
          response: 'We should ask a trusted adult first before taking gifts from people we don\'t know well.'
        },
        {
          text: 'Say "I need to ask my parent first"',
          correct: true,
          response: 'Great choice! Always check with trusted adults about gifts from others.'
        }
      ]
    },
    {
      situation: 'Someone asks you to keep a secret that makes you uncomfortable.',
      icon: '🤫',
      question: 'What should you do?',
      options: [
        {
          text: 'Keep the secret',
          correct: false,
          response: 'Some secrets can hurt us. We should tell a trusted adult if a secret makes us feel bad or uncomfortable.'
        },
        {
          text: 'Tell a trusted adult',
          correct: true,
          response: 'Excellent! Trusted adults can help us with uncomfortable secrets. Safe secrets are fun surprises, not things that make us worried.'
        }
      ]
    },
    {
      situation: 'You\'re playing and someone touches you in a way that feels wrong.',
      icon: '✋',
      question: 'What should you do?',
      options: [
        {
          text: 'Say "Stop!" and tell a trusted adult',
          correct: true,
          response: 'Perfect! Your body belongs to you. It\'s always OK to say stop and tell someone you trust.'
        },
        {
          text: 'Stay quiet',
          correct: false,
          response: 'It\'s important to speak up! You have the right to say stop if something feels wrong. Tell a trusted adult right away.'
        }
      ]
    }
  ];

  const currentStoryData = stories[currentStory];

  const handleAnswer = (option: any) => {
    if (option.correct) {
      playSuccess();
      setScore(score + 1);
      setFeedback('✨ ' + option.response);
    } else {
      playError();
      setFeedback('💡 ' + option.response);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentStory < stories.length - 1) {
        setCurrentStory(currentStory + 1);
      } else {
        onComplete(score >= 3 ? 3 : score >= 2 ? 2 : 1);
      }
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h2 className="text-orange-700">Safety Stories</h2>
        <div className="flex gap-1">
          {stories.map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < currentStory ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="text-7xl mb-6">{currentStoryData.icon}</div>
          <div className="bg-blue-50 p-6 rounded-2xl mb-6">
            <p className="text-blue-900">{currentStoryData.situation}</p>
          </div>
          <h3 className="mb-6 text-gray-700">{currentStoryData.question}</h3>
        </div>

        {!feedback ? (
          <div className="space-y-4">
            {currentStoryData.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className="w-full p-6 bg-orange-50 hover:bg-orange-100 border-4 border-orange-200 rounded-2xl transition-all active:scale-98 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-700">{idx + 1}</span>
                  </div>
                  <p className="text-orange-900">{option.text}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-green-50 rounded-2xl">
            <p className="text-green-900">{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// LEVEL 5: My Safe Routine Builder
function Level5RoutineBuilder({ onComplete, onBack }: any) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [routine, setRoutine] = useState<{ [key: string]: string[] }>({
    morning: [],
    school: [],
    home: []
  });
  const [currentPhase, setCurrentPhase] = useState<'morning' | 'school' | 'home'>('morning');
  const [showPreview, setShowPreview] = useState(false);

  const activities = {
    morning: [
      { id: 'wake', text: 'Wake up and get dressed in private', icon: '🌅' },
      { id: 'breakfast', text: 'Eat breakfast with family', icon: '🥐' },
      { id: 'brush', text: 'Brush teeth in bathroom', icon: '🪥' },
    ],
    school: [
      { id: 'learn', text: 'Learn in classroom', icon: '📚' },
      { id: 'play', text: 'Play with friends at recess', icon: '⚽' },
      { id: 'lunch', text: 'Eat lunch in cafeteria', icon: '🍱' },
    ],
    home: [
      { id: 'homework', text: 'Do homework', icon: '✏️' },
      { id: 'family', text: 'Spend time with family', icon: '👨‍👩‍👧' },
      { id: 'bedtime', text: 'Get ready for bed in private', icon: '🌙' },
    ]
  };

  const handleActivitySelect = (activityId: string) => {
    playNeutral();
    const activity = activities[currentPhase].find(a => a.id === activityId);
    if (activity && !routine[currentPhase].includes(activityId)) {
      setRoutine({
        ...routine,
        [currentPhase]: [...routine[currentPhase], activityId]
      });
    }
  };

  const handleNext = () => {
    if (currentPhase === 'morning') {
      setCurrentPhase('school');
    } else if (currentPhase === 'school') {
      setCurrentPhase('home');
    } else {
      setShowPreview(true);
    }
  };

  const handleComplete = () => {
    const totalActivities = routine.morning.length + routine.school.length + routine.home.length;
    const stars = totalActivities >= 8 ? 3 : totalActivities >= 6 ? 2 : 1;
    onComplete(stars);
  };

  const isPhaseComplete = routine[currentPhase].length >= 2;

  if (showPreview) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h2 className="text-pink-700">My Daily Routine</h2>
          <div className="w-24"></div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl mb-6">
          <h3 className="text-center mb-8">Your Safe Routine!</h3>
          
          <div className="space-y-6">
            {(['morning', 'school', 'home'] as const).map(phase => (
              <div key={phase} className="bg-pink-50 rounded-2xl p-6">
                <h4 className="mb-4 text-pink-700 capitalize">{phase} Time</h4>
                <div className="space-y-3">
                  {routine[phase].map((actId, idx) => {
                    const activity = activities[phase].find(a => a.id === actId);
                    return activity ? (
                      <div key={actId} className="flex items-center gap-3 bg-white p-4 rounded-xl">
                        <div className="text-3xl">{activity.icon}</div>
                        <div className="flex-1">{activity.text}</div>
                        <div className="text-pink-500">{idx + 1}</div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleComplete}
            className="w-full mt-8 py-4 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-all active:scale-95 shadow-lg"
          >
            Complete Level! ⭐
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h2 className="text-pink-700">Build Your Routine</h2>
        <div className="flex gap-2">
          <div className={`w-3 h-3 rounded-full ${currentPhase === 'morning' ? 'bg-pink-500' : 'bg-green-500'}`} />
          <div className={`w-3 h-3 rounded-full ${currentPhase === 'school' ? 'bg-pink-500' : routine.school.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
          <div className={`w-3 h-3 rounded-full ${currentPhase === 'home' ? 'bg-pink-500' : routine.home.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h3 className="mb-2 capitalize">{currentPhase} Time</h3>
          <p className="text-gray-600">Tap to add activities to your routine</p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          {activities[currentPhase].map(activity => {
            const isSelected = routine[currentPhase].includes(activity.id);
            return (
              <button
                key={activity.id}
                onClick={() => handleActivitySelect(activity.id)}
                className={`p-6 rounded-2xl border-4 transition-all flex items-center gap-4 ${
                  isSelected
                    ? 'border-pink-500 bg-pink-100'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="text-5xl">{activity.icon}</div>
                <div className="flex-1 text-left">
                  <p>{activity.text}</p>
                </div>
                {isSelected && (
                  <CheckCircle className="w-8 h-8 text-pink-600" />
                )}
              </button>
            );
          })}
        </div>

        {routine[currentPhase].length > 0 && (
          <div className="mb-6 p-4 bg-pink-50 rounded-2xl">
            <p className="text-sm text-pink-700 text-center">
              {routine[currentPhase].length} {routine[currentPhase].length === 1 ? 'activity' : 'activities'} added
            </p>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={!isPhaseComplete}
          className={`w-full py-4 rounded-full transition-all ${
            isPhaseComplete
              ? 'bg-pink-500 text-white hover:bg-pink-600 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentPhase === 'home' ? 'Preview My Routine' : 'Next'}
        </button>
      </div>
    </div>
  );
}
