import { ImprovementEntry } from '../types';
import { googleSheetsService } from '../services/googleSheets';

interface SheetRow {
  [key: string]: string;
}

export function convertSheetDataToEntries(sheetData: SheetRow[]): ImprovementEntry[] {
  return sheetData.map((row, index) => {
    // Extract month from Date and Time field
    const dateTime = row['Date and Time'] || '';
    const month = extractMonthFromDateTime(dateTime);
    
    return {
      id: `entry-${index + 1}`,
      controlNumber: row['Control Number'] || '',
      recordNumber: row['Record Number'] || '',
      areaCode: row['Area Code'] || '',
      category: row['Category'] || '',
      entryTitle: row['Entry Title'] || '',
      description: row['Description'] || '',
      beforeImage: row['Before Image'] || '',
      improvement: row['Improvement'] || '',
      afterImage: row['After Image'] || '',
      improvementEffect: row['Improvement Effect'] || '',
      dateTime: dateTime,
      month: month
    };
  });
}

function extractMonthFromDateTime(dateTime: string): string {
  if (!dateTime) return '';
  
  try {
    // Try to parse various date formats
    const date = new Date(dateTime);
    if (!isNaN(date.getTime())) {
      return date.toLocaleString('en-US', { month: 'long' });
    }
    
    // If direct parsing fails, try to extract month from common formats
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    for (const monthName of monthNames) {
      if (dateTime.toLowerCase().includes(monthName.toLowerCase())) {
        return monthName;
      }
    }
    
    // Try to extract from MM/DD/YYYY or DD/MM/YYYY format
    const dateMatch = dateTime.match(/(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/);
    if (dateMatch) {
      const monthNum = parseInt(dateMatch[1]);
      if (monthNum >= 1 && monthNum <= 12) {
        return monthNames[monthNum - 1];
      }
    }
    
    return '';
  } catch (error) {
    console.error('Error parsing date:', error);
    return '';
  }
}

export function filterEntriesByMonth(entries: ImprovementEntry[], month: string): ImprovementEntry[] {
  return entries.filter(entry => 
    entry.month.toLowerCase() === month.toLowerCase()
  );
}

export async function fetchEntriesFromSheet(): Promise<ImprovementEntry[]> {
  try {
    const sheetData = await googleSheetsService.fetchSheetData();
    return convertSheetDataToEntries(sheetData);
  } catch (error) {
    console.error('Error fetching entries from sheet:', error);
    throw error;
  }
}

export async function checkIdAlreadyUsed(idNumber: string, month: string): Promise<boolean> {
  try {
    return await googleSheetsService.checkIdUsedForMonth(idNumber, month);
  } catch (error) {
    console.error('Error checking ID usage:', error);
    return false;
  }
}

export async function recordTimestampToSpreadsheet(idNumber: string, month: string): Promise<void> {
  try {
    await googleSheetsService.recordTimestamp(idNumber, month);
  } catch (error) {
    console.error('Error recording timestamp:', error);
    throw error;
  }
}

export function formatDateTime(dateTime: string): string {
  try {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateTime; // Return original if parsing fails
  }
}