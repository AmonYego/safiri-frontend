import React, { useState, useEffect } from 'react';
import { Bus, ArrowRight, Users, DollarSign, Filter } from 'lucide-react';
import SeatVisualizer from './SeatVisualizer';
import MpesaModal from './MpesaModal';

const API_URL = 'http://127.0.0.1:8000';

const CommuterDashboard = () => {
  const [shuttles, setShuttles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('');
  
  const [selectedShuttle, setSelectedShuttle] = useState(null);
  const [isSeatModalOpen, setSeatModalOpen] = useState(false);
  const [isMpesaModalOpen, setMpesaModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [finalTicket, setFinalTicket] = useState(null);


  const fetchShuttles = async (sortBy = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/shuttles?sort_by=${sortBy}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setShuttles(data);
    } catch (err) {
      setError('Failed to fetch shuttles. Is the FastAPI server running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShuttles();
  }, []);

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    fetchShuttles(newSortOption);
  };

  const handleSelectShuttle = (shuttle) => {
    setSelectedShuttle(shuttle);
    setSeatModalOpen(true);
  };

  const handleSeatSelection = (seatNumber, passengerName, passengerPhone) => {
    setBookingDetails({
      sacco_id: selectedShuttle.sacco_name.toLowerCase().replace(' shuttle', '').replace(' ', '_'),
      vehicle_id: selectedShuttle.vehicle_id,
      seat_number: seatNumber,
      name: passengerName,
      phone_number: passengerPhone,
    });
    setSeatModalOpen(false);
    setMpesaModalOpen(true);
  };

  const handleMpesaPayment = async () => {
    // In a real app, you'd have a callback from your payment gateway
    // For this simulation, we'll just call the booking endpoint directly
    try {
      const response = await fetch(`${API_URL}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingDetails),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || 'Booking failed');
      }
      setFinalTicket(result.ticket);
      setMpesaModalOpen(false);
    } catch (err) {
      alert(`Booking Error: ${err.message}`);
      console.error(err);
    }
  };


  if (loading) return <div className="text-center p-8">Loading shuttles...</div>;
  if (error) return <div className="text-center p-8 text-red-500 font-semibold">{error}</div>;
  
  if (finalTicket) {
    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl my-8">
            <div className="p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-green-600">Booking Confirmed!</h2>
                    <p className="text-gray-600">Your e-ticket is ready.</p>
                </div>
                <div className="mt-6 border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-800">{finalTicket.sacco_branding}</h3>
                        <div className="text-right">
                            <p className="font-mono bg-gray-800 text-white px-2 py-1 rounded">{finalTicket.vehicle_plate}</p>
                            <p className="text-sm text-gray-600">Vehicle Reg</p>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Passenger</p>
                            <p className="font-semibold">{finalTicket.passenger_name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Seat Number</p>
                            <p className="font-semibold text-lg text-green-600">Seat {finalTicket.seat_number}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Route</p>
                            <p className="font-semibold">{finalTicket.route}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Boarding Bay</p>
                            <p className="font-semibold">{finalTicket.boarding_bay}</p>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">Total Fare</p>
                        <p className="text-3xl font-bold">KSh {finalTicket.fare}</p>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <button 
                        onClick={() => { setFinalTicket(null); fetchShuttles(sortOption); }}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    >
                        Book Another Ticket
                    </button>
                </div>
            </div>
        </div>
    );
  }


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Commuter Discovery Dashboard</h1>
      
      {/* Filter Controls */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm flex items-center">
        <Filter className="mr-2 text-gray-600" />
        <label htmlFor="sort" className="font-semibold text-gray-700 mr-3">Sort by:</label>
        <select id="sort" value={sortOption} onChange={handleSortChange} className="p-2 border rounded-lg">
          <option value="">Default</option>
          <option value="lowest_price">Cheapest Across All Saccos</option>
          <option value="seats_remaining">Fastest Filling Overall</option>
        </select>
      </div>

      {/* Shuttle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shuttles.map(shuttle => (
          <div key={shuttle.vehicle_id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-900">{shuttle.sacco_name}</h2>
                <span className="font-mono bg-gray-800 text-white px-2 py-1 rounded text-sm">{shuttle.vehicle_reg}</span>
              </div>
              <p className="text-sm text-gray-600">{shuttle.vehicle_type}</p>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                  <Users className="text-green-600 mr-2" />
                  <span className="text-lg font-semibold">{shuttle.available_seats} seats left</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="text-green-600 mr-1" />
                  <span className="text-lg font-bold">KSh {shuttle.base_fare}</span>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <span>Nairobi</span>
                <ArrowRight className="inline mx-2 h-4 w-4" />
                <span>Nakuru</span>
              </div>

              {shuttle.available_seats === 1 && (
                <div className="mt-3 text-sm font-bold text-red-600 animate-pulse">
                  1 seat left - leaving soon!
                </div>
              )}

              <button
                onClick={() => handleSelectShuttle(shuttle)}
                disabled={shuttle.available_seats === 0}
                className="mt-6 w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {shuttle.available_seats > 0 ? 'Select Seat' : 'Fully Booked'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {isSeatModalOpen && selectedShuttle && (
        <SeatVisualizer
          shuttle={selectedShuttle}
          onClose={() => setSeatModalOpen(false)}
          onSelectSeat={handleSeatSelection}
        />
      )}

      {isMpesaModalOpen && bookingDetails && (
        <MpesaModal
          details={bookingDetails}
          fare={shuttles.find(s => s.vehicle_id === bookingDetails.vehicle_id)?.base_fare}
          onClose={() => setMpesaModalOpen(false)}
          onConfirm={handleMpesaPayment}
        />
      )}
    </div>
  );
};

export default CommuterDashboard;
