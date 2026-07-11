import React from 'react';
import { CheckCircle, ArrowDownToLine, Ticket as TicketIcon } from 'lucide-react';

const E_Ticket = ({ ticket, onNewBooking }) => {
  if (!ticket) return null;

  return (
    <div className="max-w-md mx-auto my-8 animate-fade-in">
      <div className="text-center mb-6">
        <CheckCircle size={64} className="mx-auto text-orange-500" />
        <h1 className="text-3xl font-bold mt-4 text-gray-100">Booking Confirmed!</h1>
        <p className="text-gray-300">Your e-ticket is ready. Safe travels!</p>
      </div>

      <div className="bg-blue-900 rounded-xl shadow-2xl overflow-hidden border border-blue-800">
        <div className="p-6 bg-blue-800 border-b-4 border-orange-500">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-100">{ticket.sacco_branding}</h2>
            <TicketIcon className="text-orange-400" size={32} />
          </div>
          <p className="font-mono bg-orange-600 text-white px-2 py-1 rounded inline-block mt-1 text-sm">{ticket.vehicle_plate}</p>
        </div>

        <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
          <div>
            <p className="text-sm text-gray-400">Passenger</p>
            <p className="font-semibold text-lg text-gray-100">{ticket.passenger_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Seat Number</p>
            <p className="font-semibold text-lg text-orange-500">Seat {ticket.seat_number}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Route</p>
            <p className="font-semibold text-gray-200">{ticket.route}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Boarding</p>
            <p className="font-semibold text-gray-200">{ticket.boarding_bay}</p>
          </div>
          <div className="col-span-2 text-center border-t border-blue-800 pt-4 mt-2">
            <p className="text-sm text-gray-400">Total Fare Paid</p>
            <p className="text-3xl font-bold text-white">KSh {ticket.fare}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => alert('Ticket download feature coming soon!')}
          className="flex-1 bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
        >
          <ArrowDownToLine size={20} className="mr-2" />
          Download Ticket
        </button>
        <button
          onClick={onNewBooking}
          className="flex-1 bg-gray-700 text-gray-200 font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Book Another Trip
        </button>
      </div>
    </div>
  );
};

export default E_Ticket;
