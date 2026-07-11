import React, { useState, useEffect } from 'react';
import { Bus, Armchair, ArrowRight } from 'lucide-react';
import SeatVisualizer from './SeatVisualizer';
import TicketDrawer from './TicketDrawer';

const API_URL = 'http://localhost:8000';

function ShuttleDashboard() {
    const [shuttles, setShuttles] = useState([]);
    const [sort, setSort] = useState('seats_remaining');
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [bookedTicket, setBookedTicket] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/api/shuttles?sort_by=${sort}`)
            .then(res => res.json())
            .then(data => setShuttles(data))
            .catch(err => console.error("Failed to fetch shuttles:", err));
    }, [sort]);

    const handleBooking = (seatNumber) => {
        // Mock user details
        const bookingDetails = {
            sacco_id: selectedVehicle.sacco_id,
            vehicle_id: selectedVehicle.id,
            seat_number: seatNumber,
            phone_number: "254712345678",
            name: "Test Passenger"
        };

        fetch(`${API_URL}/api/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingDetails)
        })
        .then(res => res.json())
        .then(ticket => {
            setBookedTicket(ticket);
            setSelectedVehicle(null); // Close seat visualizer
            // Refresh shuttle list
            fetch(`${API_URL}/api/shuttles?sort_by=${sort}`).then(res => res.json()).then(setShuttles);
        })
        .catch(err => console.error("Booking failed:", err));
    };

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {bookedTicket && <TicketDrawer ticket={bookedTicket} onClose={() => setBookedTicket(null)} />}
            {selectedVehicle && (
                <SeatVisualizer 
                    vehicle={selectedVehicle} 
                    onClose={() => setSelectedVehicle(null)}
                    onBookSeat={handleBooking}
                />
            )}

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Available Shuttles</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Sort by:</span>
                    <button onClick={() => setSort('seats_remaining')} className={`px-3 py-1 text-sm rounded-full ${sort === 'seats_remaining' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}>Fastest Filling</button>
                    <button onClick={() => setSort('lowest_price')} className={`px-3 py-1 text-sm rounded-full ${sort === 'lowest_price' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'}`}>Cheapest</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shuttles.map(shuttle => (
                    <div key={shuttle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-indigo-700">{shuttle.sacco_name}</h3>
                                {shuttle.available_seats <= 3 && (
                                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                                        {shuttle.available_seats} seats left!
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">{shuttle.reg} - {shuttle.type}</p>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                            <div className="flex items-center">
                                <Armchair className="h-5 w-5 text-gray-500 mr-2" />
                                <span className="font-semibold">{shuttle.available_seats} Available</span>
                            </div>
                            <div className="font-bold text-lg text-green-600">
                                KSh {shuttle.base_fare}
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200">
                             <div className="flex items-center text-sm text-gray-500">
                                <Bus className="h-4 w-4 mr-2" />
                                <span>Nairobi <ArrowRight className="h-4 w-4 mx-1" /> Nakuru</span>
                                <span className="ml-auto font-semibold">Bay: {shuttle.departure_bay}</span>
                            </div>
                        </div>
                         <button 
                            onClick={() => setSelectedVehicle(shuttle)}
                            className="w-full bg-indigo-600 text-white font-bold py-2 hover:bg-indigo-700 transition-colors"
                         >
                            View Seats
                         </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ShuttleDashboard;
