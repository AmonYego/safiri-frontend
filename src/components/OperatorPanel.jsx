import React, { useState, useEffect } from 'react';
import { Briefcase, ToggleLeft, ToggleRight } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000';

// Mock Saccos for the operator dropdown
const OPERATOR_SACCOS = [
    { id: 'mololine', name: 'Mololine' },
    { id: '2nk', name: '2NK Shuttle' },
    { id: 'prestige', name: 'Prestige Shuttle' },
    { id: 'great_rift', name: 'Great Rift Shuttles' },
];

const OperatorPanel = () => {
    const [selectedSacco, setSelectedSacco] = useState(OPERATOR_SACCOS[0].id);
    const [saccoVehicles, setSaccoVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSaccoVehicles = async (saccoId) => {
        setLoading(true);
        setError(null);
        try {
            // We fetch all shuttles and then filter by the selected Sacco
            const response = await fetch(`${API_URL}/api/shuttles`);
            if (!response.ok) throw new Error('Failed to fetch data.');
            const allShuttles = await response.json();
            const filteredVehicles = allShuttles.filter(shuttle => 
                shuttle.sacco_name.toLowerCase().replace(' shuttle', '').replace(' ', '_') === saccoId
            );
            setSaccoVehicles(filteredVehicles);
        } catch (err) {
            setError('Failed to load vehicle data. Is the backend server running?');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSaccoVehicles(selectedSacco);
    }, [selectedSacco]);

    const handleToggleSeat = async (vehicle_id, seat_number, current_status) => {
        const newStatus = current_status === 'available' ? 'cash_booked' : 'available';
        
        try {
            const response = await fetch(`${API_URL}/api/operator/toggle-seat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sacco_id: selectedSacco,
                    vehicle_id,
                    seat_number,
                    status: newStatus,
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.detail || 'Failed to toggle seat status');
            }
            // Refresh the view to show the change
            fetchSaccoVehicles(selectedSacco);
        } catch (err) {
            alert(`Error: ${err.message}`);
            console.error(err);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Sacco Operator Panel</h1>

            {/* Sacco Selector */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm flex items-center">
                <Briefcase className="mr-2 text-indigo-600" />
                <label htmlFor="sacco-select" className="font-semibold text-gray-700 mr-3">
                    Managing Sacco:
                </label>
                <select
                    id="sacco-select"
                    value={selectedSacco}
                    onChange={(e) => setSelectedSacco(e.target.value)}
                    className="p-2 border rounded-lg bg-indigo-50 font-semibold text-indigo-800"
                >
                    {OPERATOR_SACCOS.map(sacco => (
                        <option key={sacco.id} value={sacco.id}>{sacco.name}</option>
                    ))}
                </select>
            </div>

            {loading && <p>Loading vehicles...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Vehicle Manifests */}
            <div className="space-y-8">
                {saccoVehicles.map(vehicle => (
                    <div key={vehicle.vehicle_id} className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h3 className="text-xl font-bold text-gray-800">{vehicle.vehicle_reg}</h3>
                            <p className="text-gray-600">{vehicle.vehicle_type}</p>
                        </div>
                        
                        <h4 className="font-semibold mb-3">Live Manifest:</h4>
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2">
                            {Object.entries(vehicle.manifest_status).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([seat, status]) => (
                                <div
                                    key={seat}
                                    className={`p-2 rounded text-center text-sm font-semibold cursor-pointer transition-all ${
                                        status === 'available' ? 'bg-green-100 text-green-800' : 
                                        status === 'booked' ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 
                                        'bg-yellow-200 text-yellow-800'
                                    }`}
                                    onClick={() => status !== 'booked' && handleToggleSeat(vehicle.vehicle_id, seat, status)}
                                >
                                    <p>Seat {seat}</p>
                                    <p className="text-xs capitalize">
                                        {status.replace('_', ' ')}
                                    </p>
                                    {status !== 'booked' && (
                                        <div className="flex justify-center mt-1">
                                            {status === 'available' ? <ToggleLeft size={16} /> : <ToggleRight size={16} />}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OperatorPanel;
