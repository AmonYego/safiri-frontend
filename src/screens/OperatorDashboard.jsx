import React, { useState, useEffect } from 'react';
import { Plus, Bus, Armchair, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext.jsx';

const OperatorDashboard = () => {
  const { user, API_URL } = useAppContext();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchOperatorVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/operator/vehicles`, {
        headers: { 'X-Sacco-Id': user.sacco_id },
      });
      if (!response.ok) throw new Error('Failed to fetch vehicle data.');
      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.sacco_id) {
      fetchOperatorVehicles();
    }
  }, [user]);

  const handleToggleSeat = async (vehicle_id, seat_number, current_status) => {
    const newStatus = current_status === 'available' ? 'cash_booked' : 'available';
    try {
      const response = await fetch(`${API_URL}/api/operator/toggle-seat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Sacco-Id': user.sacco_id,
        },
        body: JSON.stringify({ vehicle_id, seat_number, status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update seat.');
      fetchOperatorVehicles();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="text-center p-8">Loading your fleet...</div>;
  if (error) return <div className="text-center p-8 text-red-400">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-100">
          {user.saccoName} - Fleet Management
        </h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center hover:bg-orange-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          {showAddForm ? 'Cancel' : 'Add Vehicle'}
        </button>
      </div>

      {showAddForm && <AddVehicleForm saccoId={user.sacco_id} onVehicleAdded={() => {
        setShowAddForm(false);
        fetchOperatorVehicles();
      }} />}

      <div className="space-y-8">
        {vehicles.length > 0 ? vehicles.map(v => (
          <VehicleManifest key={v.id} vehicle={v} onToggleSeat={handleToggleSeat} />
        )) : (
          <div className="text-center py-16 bg-blue-900 rounded-lg shadow-lg border border-blue-800">
            <Bus size={48} className="mx-auto text-gray-500" />
            <h3 className="mt-4 text-xl font-semibold text-gray-300">No vehicles found in your active fleet.</h3>
            <p className="mt-1 text-gray-400">Use the "Add Vehicle" button to post a new trip.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AddVehicleForm = ({ saccoId, onVehicleAdded }) => {
  const { API_URL } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    vehicle_reg: '',
    destination: 'Nairobi to Nakuru',
    capacity: 11,
    base_fare: 600,
    departure_time: '',
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/operator/add-vehicle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Sacco-Id': saccoId,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to add vehicle.');
      onVehicleAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-900 p-6 rounded-lg shadow-lg mb-8 border border-blue-800">
      <h2 className="text-xl font-bold text-gray-100 mb-4">Post New Vehicle Trip</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input name="vehicle_reg" value={formData.vehicle_reg} onChange={handleChange} placeholder="Vehicle Plate (e.g., KDA 123B)" required className="p-2 bg-blue-800 border border-blue-700 text-white rounded"/>
        <input name="departure_time" value={formData.departure_time} onChange={handleChange} placeholder="Departure (e.g., 11:30 AM)" required className="p-2 bg-blue-800 border border-blue-700 text-white rounded"/>
        <input name="base_fare" type="number" value={formData.base_fare} onChange={handleChange} placeholder="Fare (KSh)" required className="p-2 bg-blue-800 border border-blue-700 text-white rounded"/>
        <select name="capacity" value={formData.capacity} onChange={handleChange} className="p-2 bg-blue-800 border border-blue-700 text-white rounded">
          <option value={11}>11-Seater</option>
          <option value={14}>14-Seater</option>
        </select>
        <input name="destination" value={formData.destination} onChange={handleChange} placeholder="Destination" required className="p-2 bg-blue-800 border border-blue-700 text-white rounded"/>
        <button type="submit" disabled={loading} className="bg-orange-600 text-white p-2 rounded hover:bg-orange-700 disabled:bg-gray-500">
          {loading ? 'Adding...' : 'Add to Fleet'}
        </button>
      </form>
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
  );
};

const VehicleManifest = ({ vehicle, onToggleSeat }) => {
  const sortedSeats = Object.entries(vehicle.seats).sort(([a], [b]) => parseInt(a) - parseInt(b));

  return (
    <div className="bg-blue-900 rounded-xl shadow-lg p-6 border border-blue-800">
      <div className="flex justify-between items-center border-b border-blue-800 pb-3 mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-100">{vehicle.vehicle_reg}</h3>
          <p className="text-gray-300">{vehicle.route} @ {vehicle.departure_time}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-xl text-gray-100">KSh {vehicle.base_fare}</p>
          <p className="text-sm text-gray-400">{vehicle.capacity}-Seater</p>
        </div>
      </div>
      <h4 className="font-semibold text-gray-200 mb-3">Live Seat Inventory:</h4>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {sortedSeats.map(([seat, status]) => (
          <div
            key={seat}
            onClick={() => status !== 'booked' && onToggleSeat(vehicle.id, seat, status)}
            className={`p-2 rounded-lg text-center font-semibold cursor-pointer transition-all border-2 ${
              status === 'available' ? 'bg-gray-700 text-gray-200 border-gray-600 hover:border-orange-500' :
              status === 'booked' ? 'bg-gray-500 text-gray-400 cursor-not-allowed border-gray-600' :
              'bg-yellow-500 text-yellow-900 border-yellow-600 hover:border-yellow-400'
            }`}
          >
            <p className="text-lg"><Armchair className="inline-block mb-1" /></p>
            <p className="text-xs">Seat {seat}</p>
            <p className="text-xs capitalize mt-1 flex items-center justify-center">
              {status !== 'booked' && (status === 'available' ? <ToggleLeft size={14} className="mr-1"/> : <ToggleRight size={14} className="mr-1"/>)}
              {status.replace('_', ' ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperatorDashboard;
