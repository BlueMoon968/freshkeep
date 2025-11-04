import { AppProvider, useApp } from './contexts/AppContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import FridgeView from './components/FridgeView';
import ScanView from './components/ScanView';
import AddProductView from './components/AddProductView';

function AppContent() {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen pb-24">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {currentView === 'fridge' && <FridgeView />}
        {currentView === 'scan' && <ScanView />}
        {currentView === 'add' && <AddProductView />}
      </main>

      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
