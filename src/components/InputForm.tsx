import React, { useState } from 'react';
import { User, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { checkIdAlreadyUsed } from '../utils/dataUtils';

interface InputFormProps {
  onSubmit: (idNumber: string, month: string) => void;
}

const availableMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function InputForm({ onSubmit }: InputFormProps) {
  const [idNumber, setIdNumber] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');

  const handleIdNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits and limit to 8 characters
    const digitsOnly = value.replace(/\D/g, '').slice(0, 8);
    setIdNumber(digitsOnly);
    
    // Clear any previous error when user starts typing
    if (error) setError('');
  };

  const isValidIdNumber = (id: string) => {
    return /^\d{8}$/.test(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isValidIdNumber(idNumber)) {
      setError('ID Number must be exactly 8 digits.');
      return;
    }
    
    if (selectedMonth) {
      setIsChecking(true);
      
      try {
        const isAlreadyUsed = await checkIdAlreadyUsed(idNumber, selectedMonth);
        
        if (isAlreadyUsed) {
          setError(`ID ${idNumber} has already completed viewing entries for ${selectedMonth}. Each ID can only view entries once per month.`);
          setIsChecking(false);
          return;
        }
        
        onSubmit(idNumber, selectedMonth);
      } catch (error) {
        setError('Unable to verify ID usage. Please check your internet connection and try again.');
        console.error('Error checking ID usage:', error);
      } finally {
        setIsChecking(false);
      }
    }
  };

  const isValid = isValidIdNumber(idNumber) && selectedMonth && !isChecking;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Entry Viewer</h1>
          <p className="text-gray-600">Enter your details to view improvement entries</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="idNumber" className="block text-sm font-semibold text-gray-700 mb-2">
              ID Number
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="idNumber"
                value={idNumber}
                onChange={handleIdNumberChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 ${
                  idNumber && !isValidIdNumber(idNumber) 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                placeholder="Enter 8-digit ID number"
                maxLength={8}
                inputMode="numeric"
                required
              />
            </div>
            {idNumber && !isValidIdNumber(idNumber) && (
              <p className="text-red-600 text-sm mt-1">
                ID must be exactly 8 digits ({idNumber.length}/8 digits entered)
              </p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="month" className="block text-sm font-semibold text-gray-700 mb-2">
              Select Month
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none bg-white"
                required
              >
                <option value="">Choose a month</option>
                {availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm leading-relaxed">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 transform ${
              isValid
                ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-gray-400 cursor-not-allowed'
            } flex items-center justify-center space-x-2`}
          >
            {isChecking ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <span>View Entries</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
