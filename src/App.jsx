import React, { useState } from 'react';
import { AppContext } from './context/AppContext.jsx';
import AuthScreen from './screens/AuthScreen.jsx';
import CommuterDashboard from './screens/CommuterDashboard.jsx';
import OperatorDashboard from './screens/OperatorDashboard.jsx';
import { Layout, LogOut } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const API_URL = 'https://backend-safiri-production.up.railway.app';
  //const API_URL = 'http://127.0.0.1:8000';

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  const Header = () => (
    <header className="bg-blue-900 shadow-lg sticky top-0 z-40">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left side placeholder to balance the layout */}
        <div className="w-1/3"></div>

        {/* Centered Logo */}
        <div className="w-1/3 flex justify-center">
          <div className="flex items-center">
            <Layout className="text-orange-500 h-8 w-8" />
            <div className="ml-3 text-4xl font-bold text-orange-500">
              Safiri
            </div>
          </div>
        </div>

        {/* Right side user info */}
        <div className="w-1/3 flex justify-end">
          {user && (
            <div className="flex items-center">
              <span className="text-sm text-gray-300 mr-4 hidden sm:block">
                {user.role === 'operator' ? `Operator: ${user.saccoName}` : 'Passenger View'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );

  const renderContent = () => {
    if (!user) {
      return <AuthScreen onLogin={handleLogin} />;
    }
    if (user.role === 'passenger') {
      return <CommuterDashboard />;
    }
    if (user.role === 'operator') {
      return <OperatorDashboard />;
    }
    return <AuthScreen onLogin={handleLogin} />;
  };

  return (
    <AppContext.Provider value={{ user, API_URL }}>
      <div className="App min-h-screen">
        <Header />
        <main className="container mx-auto p-4 sm:p-6">
          {renderContent()}
        </main>
      </div>
    </AppContext.Provider>
  );
}

export default App;
