import { useApp } from '../contexts/AppContext';

export default function BottomNav() {
  const { currentView, setCurrentView } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass shadow-lg border-t border-gray-200 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-around gap-2">
          <button
            onClick={() => setCurrentView('fridge')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentView === 'fridge'
                ? 'text-indigo-500 bg-indigo-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="2" width="16" height="20" rx="2"/>
              <line x1="4" y1="10" x2="20" y2="10"/>
              <line x1="8" y1="6" x2="8" y2="8"/>
              <line x1="8" y1="14" x2="8" y2="16"/>
            </svg>
            <span className="text-xs font-semibold">My Fridge</span>
          </button>
          
          <button
            onClick={() => setCurrentView('scan')}
            className="flex flex-col items-center gap-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-500/40 transform hover:scale-105 active:scale-95 transition-all"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7V5a2 2 0 0 1 2-2h2M21 7V5a2 2 0 0 0-2-2h-2M3 17v2a2 2 0 0 0 2 2h2M21 17v2a2 2 0 0 1-2 2h-2"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
            </svg>
            <span className="text-xs font-bold">Scan</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
