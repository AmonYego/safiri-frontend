import React, { useState } from 'react';
import ShuttleDashboard from './components/ShuttleDashboard';
import OperatorPanel from './components/OperatorPanel';

function App() {
    const [view, setView] = useState('passenger'); // 'passenger' or 'operator'

    return (
        <div className="bg-gray-100 min-h-screen">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-gray-800">Safiri</h1>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => setView('passenger')}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${view === 'passenger' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                            >
                                Passenger View
                            </button>
                            <button
                                onClick={() => setView('operator')}
                                className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${view === 'operator' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                            >
                                Sacco Operator Panel
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                {view === 'passenger' ? <ShuttleDashboard /> : <OperatorPanel />}
            </main>
        </div>
    );
}

export default App;
