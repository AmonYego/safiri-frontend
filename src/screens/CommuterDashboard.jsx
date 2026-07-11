import React, { useState, useEffect, useMemo } from 'react';
import { Filter, Users, DollarSign, ArrowRight, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext.jsx';
import SeatVisualizer from '../components/SeatVisualizer.jsx';
import MpesaModal from '../components/MpesaModal.jsx';
import E_Ticket from '../components/E_Ticket.jsx';

const CommuterDashboard = () => {
  const { API_URL } = useAppContext();
  const [shuttles, setShuttles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('');

  // State for the booking flow
  const [selectedShuttle, setSelectedShuttle] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null); // Holds data for the final API call
  const [finalTicket, setFinalTicket] = useState(null);

  const fetchShuttles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/shuttles`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setShuttles(data);
    } catch (err) {
      setError('Failed to fetch shuttles. Is the FastAPI server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShuttles();
  }, []);

  const sortedShuttles = useMemo(() => {
    let sorted = [...shuttles];
    if (sortOption === 'lowest_price') {
      sorted.sort((a, b) => a.base_fare - b.base_fare);
    } else if (sortOption === 'fastest_filling') {
      sorted.sort((a, b) => (a.available_seats / a.capacity) - (b.available_seats / b.capacity));
    }
    return sorted;
  }, [shuttles, sortOption]);

  // --- Booking Flow Handlers ---
  const handleSelectShuttle = (shuttle) => setSelectedShuttle(shuttle);
  const handleCloseVisualizer = () => setSelectedShuttle(null);

  const handleSeatSelection = (seatNumber, passengerName, passengerPhone) => {
    setBookingDetails({
      vehicle_id: selectedShuttle.id,
      seat_number: seatNumber,
      name: passengerName,
      phone_number: passengerPhone,
    });
    setSelectedShuttle(null); // Close visualizer
  };

  const handleMpesaConfirm = async () => {
    try {
      const response = await fetch(`${API_URL}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingDetails),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'Booking failed');
      setFinalTicket(result);
      setBookingDetails(null); // Clear booking details
    } catch (err) {
      alert(`Booking Error: ${err.message}`);
    }
  };

  const handleNewBooking = () => {
    setFinalTicket(null);
    fetchShuttles(); // Refresh shuttle list
  };

  // --- Render Logic ---
  if (loading) return <div className="text-center p-8">Loading available shuttles...</div>;
  if (error) return <div className="text-center p-8 text-red-400 font-semibold">{error}</div>;

  if (finalTicket) {
    return <E_Ticket ticket={finalTicket} onNewBooking={handleNewBooking} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-gray-100">Find Your Ride</h1>
      <p className="text-gray-300 mb-6">Compare and book seats across all top Saccos.</p>

      <div className="mb-6 bg-blue-900 p-4 rounded-lg shadow-lg flex items-center gap-4 border border-blue-800">
        <Filter className="text-gray-300" />
        <label htmlFor="sort" className="font-semibold text-gray-200">Filter by:</label>
        <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="p-2 border bg-blue-800 border-blue-700 text-white rounded-lg">
          <option value="">Recommended</option>
          <option value="lowest_price">Cheapest Across All Saccos</option>
          <option value="fastest_filling">Fastest Filling Overall</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedShuttles.map(shuttle => (
          <ShuttleCard key={shuttle.id} shuttle={shuttle} onSelect={handleSelectShuttle} />
        ))}
      </div>

      {selectedShuttle && (
        <SeatVisualizer
          shuttle={selectedShuttle}
          onClose={handleCloseVisualizer}
          onSelectSeat={handleSeatSelection}
        />
      )}

      {bookingDetails && (
        <MpesaModal
          details={bookingDetails}
          fare={shuttles.find(s => s.id === bookingDetails.vehicle_id)?.base_fare}
          onClose={() => setBookingDetails(null)}
          onConfirm={handleMpesaConfirm}
        />
      )}
    </div>
  );
};

const ShuttleCard = ({ shuttle, onSelect }) => (
  <div className="bg-blue-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col border border-blue-800">
    <div className="p-6 flex-grow">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold text-gray-100">{shuttle.sacco_name}</h2>
        <span className="font-mono bg-orange-600 text-white px-2 py-1 rounded text-sm">{shuttle.vehicle_reg}</span>
      </div>
      <p className="text-sm text-gray-300">{shuttle.route}</p>

      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div className="flex flex-col items-center justify-center bg-blue-800 p-2 rounded-lg">
          <Users className="text-orange-500" />
          <span className="text-lg font-semibold text-gray-100">{shuttle.available_seats} seats</span>
          <span className="text-xs text-gray-400">Available</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-blue-800 p-2 rounded-lg">
          <DollarSign className="text-orange-500" />
          <span className="text-lg font-bold text-gray-100">KSh {shuttle.base_fare}</span>
           <span className="text-xs text-gray-400">Per Seat</span>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-400 flex items-center justify-center">
        <Clock size={14} className="mr-1" />
        <span>Departs around {shuttle.departure_time}</span>
      </div>

      {shuttle.available_seats < 4 && shuttle.available_seats > 0 && (
        <div className="mt-3 text-sm font-bold text-red-400 animate-pulse-fast text-center">
          Filling fast - {shuttle.available_seats} seat{shuttle.available_seats > 1 ? 's' : ''} left!
        </div>
      )}
    </div>
    <div className="p-4 bg-blue-950">
      <button
        onClick={() => onSelect(shuttle)}
        className="w-full bg-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
      >
        Select Seat <ArrowRight size={16} className="ml-2" />
      </button>
    </div>
  </div>
);

export default CommuterDashboard;
