import React, { useState } from 'react';
import { User, AlertCircle } from 'lucide-react'; // Add missing imports
import InputForm from './components/InputForm';
import SlideViewer from './components/SlideViewer';
import CompletionScreen from './components/CompletionScreen';
import { ImprovementEntry } from './types';
import {
  filterEntriesByMonth,
  fetchEntriesFromSheet,
  recordTimestampToSpreadsheet,
} from './utils/dataUtils';

type AppState = 'input' | 'viewing' | 'completed';

function App() {
  const [appState, setAppState] = useState<AppState>('input');
  const [sessionData, setSessionData] = useState<{
    idNumber: string;
    month: string;
    entries: ImprovementEntry[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (idNumber: string, month: string) => {
    setIsLoading(true);
    setError('');

    try {
      const allEntries = await fetchEntriesFromSheet();
      const filteredEntries = filterEntriesByMonth(allEntries, month);

      if (filteredEntries.length === 0) {
        setError(
          `No entries found for ${month}. Please try a different month or check if the data is available in the spreadsheet.`
        );
        setIsLoading(false);
        return;
      }

      setSessionData({
        idNumber,
        month,
        entries: filteredEntries,
      });
      setAppState('viewing');
    } catch (error) {
      console.error('Error fetching entries:', error);
      setError(
        'Failed to load entries from Google Sheets. Please check your internet connection and API configuration.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewingComplete = async () => {
    if (sessionData) {
      try {
        await recordTimestampToSpreadsheet(
          sessionData.idNumber,
          sessionData.month
        );
        setAppState('completed');
      } catch (error) {
        console.error('Error recording timestamp:', error);
        // Still proceed to completion screen even if timestamp fails
        setAppState('completed');
      }
    }
  };

  const handleReset = () => {
    setSessionData(null);
    setError('');
    setAppState('input');
  };

  const handleBackToInput = () => {
    setSessionData(null);
    setError('');
    setAppState('input');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Loading Entries...
          </h2>
          <p className="text-gray-600">Fetching data from Google Sheets</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full animate-pulse"
              style={{ width: '60%' }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && appState === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => setError('')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (appState === 'input') {
    return <InputForm onSubmit={handleFormSubmit} />;
  }

  if (appState === 'viewing' && sessionData) {
    return (
      <SlideViewer
        entries={sessionData.entries}
        idNumber={sessionData.idNumber}
        month={sessionData.month}
        onComplete={handleViewingComplete}
        onComplete={handleViewingComplete}
        onBack={handleBackToInput}
      />
    );
  }

  if (appState === 'completed' && sessionData) {
    return (
      <CompletionScreen
        idNumber={sessionData.idNumber}
        month={sessionData.month}
        entriesCount={sessionData.entries.length}
        onReset={handleReset}
      />
    );
  }

  return null;
}

export default App;
