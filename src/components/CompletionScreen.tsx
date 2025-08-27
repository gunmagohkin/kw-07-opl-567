import React from 'react';
import { CheckCircle, RefreshCw, Calendar, User } from 'lucide-react';

interface CompletionScreenProps {
  idNumber: string;
  month: string;
  entriesCount: number;
  onReset: () => void;
}

export default function CompletionScreen({ idNumber, month, entriesCount, onReset }: CompletionScreenProps) {
  const currentTime = new Date().toLocaleString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center transform transition-all duration-300">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">Session Complete!</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          You have successfully viewed all {entriesCount} improvement entries for {month}.
        </p>

        {/* Session Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 space-y-4">
          <h3 className="font-semibold text-gray-800 mb-4">Session Summary</h3>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="w-4 h-4" />
              <span>ID Number</span>
            </div>
            <span className="font-medium text-gray-800">{idNumber}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Month</span>
            </div>
            <span className="font-medium text-gray-800">{month}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Entries Viewed</span>
            <span className="font-medium text-gray-800">{entriesCount}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Completed At</span>
            <span className="font-medium text-gray-800">{currentTime}</span>
          </div>
        </div>

        {/* Timestamp Confirmation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            ✅ Timestamp recorded to tracking spreadsheet (KW-07 sheet)
          </p>
        </div>

        <button
          onClick={onReset}
          className="flex items-center space-x-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 hover:shadow-md transition-all duration-200 transform hover:scale-105"
        >
          <RefreshCw className="w-5 h-5" />
          <span>View More Entries</span>
        </button>
      </div>
    </div>
  );
}