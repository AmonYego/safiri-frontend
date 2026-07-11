import React, { useState } from 'react';
import { Users, Briefcase, ArrowRight, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext.jsx';

const AuthScreen = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('passenger'); // 'passenger' or 'operator'
  const { API_URL } = useAppContext();

  // State for forms
  const [phone, setPhone] = useState('');
  const [passengerPassword, setPassengerPassword] = useState('');
  const [saccoId, setSaccoId] = useState('mololine');
  const [saccoPassword, setSaccoPassword] = useState('password123'); // Pre-fill for convenience
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const loginType = activeTab;
    const payload = loginType === 'passenger'
      ? { login_type: 'passenger', phone_number: phone, password: passengerPassword }
      : { login_type: 'operator', sacco_id: saccoId, password: saccoPassword };

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed.');
      }
      onLogin(data); // Pass the user data up to the App component
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 p-4 flex items-center justify-center font-semibold border-b-4 transition-colors ${
        activeTab === id
          ? 'border-orange-500 text-orange-500'
          : 'border-transparent text-gray-400 hover:text-orange-400'
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="max-w-md w-full bg-blue-900 rounded-xl shadow-2xl overflow-hidden border border-blue-800">
        <div className="flex">
          <TabButton id="passenger" label="Passenger Access" icon={<Users />} />
          <TabButton id="operator" label="Sacco Portal" icon={<Briefcase />} />
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin}>
            {activeTab === 'passenger' ? (
              <div>
                <h2 className="text-2xl font-bold text-center text-gray-100 mb-1">Welcome Back!</h2>
                <p className="text-center text-gray-300 mb-6">Enter your details to start booking.</p>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-blue-800 border border-blue-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., 0712345678"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="passenger-password"className="block text-sm font-medium text-gray-300">Password</label>
                  <input
                    type="password"
                    id="passenger-password"
                    value={passengerPassword}
                    onChange={(e) => setPassengerPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-blue-800 border border-blue-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-center text-gray-100 mb-1">Operator Login</h2>
                <p className="text-center text-gray-300 mb-6">Access your Sacco's dashboard.</p>
                <div className="mb-4">
                  <label htmlFor="sacco" className="block text-sm font-medium text-gray-300">Sacco</label>
                  <select
                    id="sacco"
                    value={saccoId}
                    onChange={(e) => setSaccoId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-blue-800 border border-blue-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="mololine">Mololine</option>
                    <option value="2nk">2NK Shuttle</option>
                    <option value="prestige">Prestige Shuttle</option>
                    <option value="great_rift">Great Rift Shuttles</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="sacco-password"className="block text-sm font-medium text-gray-300">Password</label>
                  <input
                    type="password"
                    id="sacco-password"
                    value={saccoPassword}
                    onChange={(e) => setSaccoPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-blue-800 border border-blue-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="bg-blue-800 border-l-4 border-blue-500 text-blue-200 p-2 text-xs mb-6 flex items-center">
                    <Info size={16} className="mr-2 flex-shrink-0" />
                    <span>For this demo, the password for any Sacco is: <strong>password123</strong></span>
                </div>
              </div>
            )}

            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center disabled:bg-gray-500"
            >
              {loading ? 'Logging in...' : 'Continue'}
              {!loading && <ArrowRight size={20} className="ml-2" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
