import { Settings } from 'lucide-react';

interface MainMenuProps {
  onNavigate: (screen: string) => void;
}

const modules = [
  {
    id: 'module1',
    title: 'Relationship Rainbow',
    description: 'Learn about different people in your life',
    emoji: '🌈',
    color: 'from-purple-400 to-pink-400',
    borderColor: 'border-purple-400',
    hoverColor: 'hover:from-purple-500 hover:to-pink-500'
  },
  {
    id: 'module2',
    title: 'Safety Decisions',
    description: 'Learn to stay safe and make good choices',
    emoji: '🛡️',
    color: 'from-green-400 to-blue-400',
    borderColor: 'border-green-400',
    hoverColor: 'hover:from-green-500 hover:to-blue-500'
  },
  {
    id: 'module3',
    title: 'My Body Space',
    description: 'Learn about personal space and boundaries',
    emoji: '🫧',
    color: 'from-orange-400 to-yellow-400',
    borderColor: 'border-orange-400',
    hoverColor: 'hover:from-orange-500 hover:to-yellow-500'
  },
];

export function MainMenu({ onNavigate }: MainMenuProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8 flex items-center justify-center relative">
      {/* Parent Settings Button */}
      <button
        className="absolute top-6 right-6 p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
        onClick={() => onNavigate('parentSettings')}
        title="Parent Settings"
      >
        <Settings className="w-7 h-7 text-gray-600 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl mb-4" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            Understanding Relationships
          </h1>
          <div className="text-7xl mb-6">👦👧🌟</div>
          <p className="text-2xl text-gray-700 mb-2">Learning About Boundaries & Safety</p>
          <p className="text-xl text-gray-600">Choose a module to start learning!</p>
        </div>

        {/* Module Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => onNavigate(module.id)}
              className={`group relative bg-gradient-to-br ${module.color} ${module.hoverColor} rounded-[2.5rem] p-8 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl border-8 ${module.borderColor}`}
            >
              {/* Emoji */}
              <div className="text-8xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {module.emoji}
              </div>
              
              {/* Title */}
              <h2 className="text-white mb-3 drop-shadow-lg" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                {module.title}
              </h2>
              
              {/* Description */}
              <p className="text-white/90 text-sm drop-shadow">
                {module.description}
              </p>

              {/* Shine effect */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 text-center shadow-lg border-4 border-white">
          <p className="text-gray-700 mb-2">
            <strong>🎮 How to Play:</strong> Tap a colorful module above to start!
          </p>
          <p className="text-gray-600 text-sm">
            Each module has fun games to help you learn about relationships, safety, and boundaries!
          </p>
        </div>
      </div>
    </div>
  );
}