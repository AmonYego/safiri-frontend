import React, { useState } from 'react';
import { X, Armchair, User, Phone } from 'lucide-react';

const Seat = ({ number, status, isSelected, onSelect }) => {
  const isAvailable = status === 'available';
  let seatClass = 'border-2 rounded-lg flex flex-col items-center justify-center p-1.5 transition-all duration-200 aspect-square';

  if (isAvailable) {
    seatClass += isSelected
      ? 'bg-orange-600 text-white border-orange-500 ring-2 ring-offset-1 ring-orange-600'
      : 'bg-blue-800 text-gray-200 border-blue-700 hover:border-orange-500 cursor-pointer';
  } else {
    seatClass += `bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed ${status === 'cash_booked' ? 'opacity-80' : ''}`;
  }

  return (
    <div className={seatClass} onClick={() => isAvailable && onSelect(number)}>
      <Armchair size={20} />
      <span className="text-xs font-bold mt-1">{number}</span>
    </div>
  );
};

const SeatVisualizer = ({ shuttle, onClose, onSelectSeat }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [error, setError] = useState('');

  const seats = Object.entries(shuttle.seats).sort(([a], [b]) => parseInt(a) - parseInt(b));

  const handleConfirmSelection = () => {
    if (!selectedSeat) {
      setError('Please select a seat.');
      return;
    }
    if (!passengerName.trim() || !passengerPhone.trim()) {
      setError('Please enter your name and phone number.');
      return;
    }
    if (!/^\d{10,12}$/.test(passengerPhone)) {
        setError('Please enter a valid phone number (e.g., 0712345678).');
        return;
    }
    onSelectSeat(selectedSeat, passengerName, passengerPhone);
  };

  const renderLayout = () => {
    const seatComponents = seats.map(([number, status]) => (
      <Seat
        key={number}
        number={number}
        status={status}
        isSelected={selectedSeat === number}
        onSelect={setSelectedSeat}
      />
    ));
    return (
      <div className="grid grid-cols-5 gap-2.5 text-center items-center">
        <div className="col-span-2"></div>
        <div className="col-span-1"></div>
        {seatComponents[0]}
        {seatComponents[1]}
        {seatComponents[2]}
        {seatComponents[3]}
        <div className="col-span-1"></div>
        {seatComponents[4]}
        {seatComponents[5]}
        {seatComponents.slice(6)}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-blue-900 rounded-lg shadow-2xl max-w-md w-full animate-fade-in border border-blue-800">
        <div className="p-4 border-b border-blue-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-100">Select Your Seat</h2>
            <p className="text-sm text-gray-300">{shuttle.sacco_name} - {shuttle.vehicle_reg}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-blue-800"><X size={24} /></button>
        </div>

        <div className="p-6">
          <div className="bg-blue-950 p-4 rounded-lg border border-blue-800">
            {renderLayout()}
          </div>
          <div className="flex justify-center space-x-4 my-4 text-xs text-gray-400">
            <div className="flex items-center"><div className="w-3 h-3 border-2 border-blue-700 rounded mr-1.5"></div>Available</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-orange-600 rounded mr-1.5"></div> Selected</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded mr-1.5"></div>Cash Booked</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-gray-700 rounded mr-1.5"></div>Online Booked</div>
          </div>

          {selectedSeat && (
            <div className="mt-4 p-4 bg-blue-800 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-lg text-center mb-3 text-gray-100">Confirm Details for Seat {selectedSeat}</h3>
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                  <input type="text" placeholder="Full Name" value={passengerName} onChange={e => setPassengerName(e.target.value)} className="pl-10 block w-full px-3 py-2 bg-blue-700 border border-blue-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"/>
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                  <input type="tel" placeholder="M-Pesa Phone (07...)" value={passengerPhone} onChange={e => setPassengerPhone(e.target.value)} className="pl-10 block w-full px-3 py-2 bg-blue-700 border border-blue-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"/>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
        </div>

        <div className="p-4 bg-blue-950 border-t border-blue-800 text-right">
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedSeat || !passengerName || !passengerPhone}
            className="bg-orange-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatVisualizer;
