interface GoogleSheetsConfig {
  webAppUrl: string;
}

interface SheetRow {
  [key: string]: string;
}

interface RegistrationResult {
  success: boolean;
  message: string;
  data?: any;
}

class GoogleSheetsService {
  private config: GoogleSheetsConfig;

  constructor() {
    this.config = {
      webAppUrl:
        import.meta.env.VITE_GOOGLE_WEB_APP_URL ||
        'https://script.google.com/macros/s/AKfycbxX6SOJAaH_HSVpt-RwqNnYhpF7tg2kOFkpRNf0eF5Yt55wlPEzLSb7UyMY31n2p9ee/exec',
    };

    console.log(
      'GoogleSheetsService initialized with URL:',
      this.config.webAppUrl
    );
  }

  private async makeGetRequest(
    action: string,
    params: Record<string, string> = {}
  ): Promise<any> {
    try {
      const urlParams = new URLSearchParams({ action, ...params });
      const url = `${this.config.webAppUrl}?${urlParams}`;

      console.log(`📤 Making GET request: ${action}`, url);

      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const result = await response.json();
        console.log('📥 JSON response:', result);

        if (result.error) {
          throw new Error(result.error);
        }
        return result;
      } else {
        // Handle plain text or other responses
        const text = await response.text();
        console.log('📥 Text response:', text);

        // Try to parse as JSON if possible
        try {
          const result = JSON.parse(text);
          if (result.error) {
            throw new Error(result.error);
          }
          return result;
        } catch (parseError) {
          console.error('Could not parse response as JSON:', parseError);
          throw new Error('Invalid response from Google Apps Script');
        }
      }
    } catch (error) {
      console.error(`❌ GET request failed for action: ${action}`, error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing Web App connection...');
      const result = await this.makeGetRequest('test');
      console.log('✅ Connection test successful:', result);
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }

  async fetchSheetData(): Promise<SheetRow[]> {
    try {
      console.log('📊 Fetching sheet data...');
      const result = await this.makeGetRequest('fetchData');
      console.log('📊 Sheet data result:', result);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data || [];
    } catch (error) {
      console.error('❌ Error fetching sheet data:', error);
      throw new Error(
        'Failed to fetch data from Google Sheets. Please check your connection and configuration.'
      );
    }
  }

  async checkIdUsedForMonth(idNumber: string, month: string): Promise<boolean> {
    try {
      console.log('🔍 Checking ID usage:', idNumber, month);
      const result = await this.makeGetRequest('checkId', { idNumber, month });
      console.log('🔍 ID check result:', result);

      if (result.error) {
        console.warn('Error checking ID usage:', result.error);
        return false; // Allow access if there's an error
      }

      return result.used || false;
    } catch (error) {
      console.error('❌ Error checking ID usage:', error);
      return false; // Allow access if we can't check
    }
  }

  // Original recordTimestamp method (without duplicate check)
  private async recordTimestampUnsafe(
    idNumber: string,
    month: string
  ): Promise<void> {
    try {
      console.log('📝 Recording timestamp:', idNumber, month);
      const result = await this.makeGetRequest('recordTimestamp', {
        id: idNumber,
        monthData: month,
      });
      console.log('📝 Timestamp result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to record timestamp');
      }

      console.log(`✅ Timestamp recorded: ID ${idNumber}, Month ${month}`);
    } catch (error) {
      console.error('❌ Error recording timestamp:', error);
      throw new Error('Failed to record timestamp to Google Sheets.');
    }
  }

  // Enhanced method with duplicate prevention
  async recordTimestamp(
    idNumber: string,
    month: string
  ): Promise<RegistrationResult> {
    try {
      // Validate inputs
      if (!idNumber || !month) {
        return {
          success: false,
          message: 'ID Number and Month are required.',
        };
      }

      // Trim whitespace and normalize inputs
      const normalizedId = idNumber.toString().trim();
      const normalizedMonth = month.toString().trim();

      console.log(
        `🔍 Attempting to register: ID ${normalizedId}, Month ${normalizedMonth}`
      );

      // Check if this ID has already been used for this month
      const isAlreadyUsed = await this.checkIdUsedForMonth(
        normalizedId,
        normalizedMonth
      );

      if (isAlreadyUsed) {
        const message = `Registration denied: ID ${normalizedId} has already been registered for ${normalizedMonth}`;
        console.warn(`❌ ${message}`);
        return {
          success: false,
          message: `This ID has already been registered for ${normalizedMonth}. Duplicate registrations are not allowed.`,
        };
      }

      // If not used, proceed with recording the timestamp
      console.log(
        `✅ ID ${normalizedId} is available for ${normalizedMonth}, proceeding with registration...`
      );
      await this.recordTimestampUnsafe(normalizedId, normalizedMonth);

      const successMessage = `Successfully registered ID ${normalizedId} for ${normalizedMonth}`;
      console.log(`✅ ${successMessage}`);
      return {
        success: true,
        message: `Registration successful for ID ${normalizedId} in ${normalizedMonth}.`,
        data: {
          id: normalizedId,
          month: normalizedMonth,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('❌ Registration failed:', error);
      return {
        success: false,
        message: `Registration failed: ${
          error instanceof Error ? error.message : 'Unknown error occurred'
        }`,
      };
    }
  }

  // Method to get all registrations for a specific ID
  async getRegistrationsByID(idNumber: string): Promise<SheetRow[]> {
    try {
      const allData = await this.fetchSheetData();
      return allData.filter(
        (row) => row.id === idNumber || row.ID === idNumber
      );
    } catch (error) {
      console.error('❌ Error fetching registrations by ID:', error);
      throw new Error('Failed to fetch registration history.');
    }
  }

  // Method to get all registrations for a specific month
  async getRegistrationsByMonth(month: string): Promise<SheetRow[]> {
    try {
      const allData = await this.fetchSheetData();
      return allData.filter(
        (row) =>
          row.month === month || row.Month === month || row.monthData === month
      );
    } catch (error) {
      console.error('❌ Error fetching registrations by month:', error);
      throw new Error('Failed to fetch monthly registration data.');
    }
  }

  // Method to check registration status with detailed info
  async getRegistrationStatus(
    idNumber: string,
    month: string
  ): Promise<{
    isRegistered: boolean;
    registrationDate?: string;
    message: string;
  }> {
    try {
      const normalizedId = idNumber.toString().trim();
      const normalizedMonth = month.toString().trim();

      const isUsed = await this.checkIdUsedForMonth(
        normalizedId,
        normalizedMonth
      );

      if (isUsed) {
        // Try to get the actual registration data
        const registrations = await this.getRegistrationsByID(normalizedId);
        const monthRegistration = registrations.find(
          (reg) =>
            reg.month === normalizedMonth ||
            reg.Month === normalizedMonth ||
            reg.monthData === normalizedMonth
        );

        return {
          isRegistered: true,
          registrationDate:
            monthRegistration?.timestamp || monthRegistration?.date,
          message: `ID ${normalizedId} is already registered for ${normalizedMonth}`,
        };
      } else {
        return {
          isRegistered: false,
          message: `ID ${normalizedId} is available for registration in ${normalizedMonth}`,
        };
      }
    } catch (error) {
      console.error('❌ Error checking registration status:', error);
      return {
        isRegistered: false,
        message: 'Unable to verify registration status due to connection error',
      };
    }
  }
}

// Usage examples and helper functions
class RegistrationHandler {
  private sheetsService: GoogleSheetsService;

  constructor() {
    this.sheetsService = new GoogleSheetsService();
  }

  // Handle form submission with validation and user feedback
  async handleRegistrationForm(formData: {
    idNumber: string;
    month: string;
  }): Promise<RegistrationResult> {
    const { idNumber, month } = formData;

    // Additional client-side validation
    if (!this.validateIdNumber(idNumber)) {
      return {
        success: false,
        message: 'Invalid ID number format. Please check and try again.',
      };
    }

    if (!this.validateMonth(month)) {
      return {
        success: false,
        message: 'Invalid month format. Please select a valid month.',
      };
    }

    // Attempt registration
    return await this.sheetsService.recordTimestamp(idNumber, month);
  }

  // Validate ID number format (customize as needed)
  private validateIdNumber(idNumber: string): boolean {
    const trimmed = idNumber?.toString().trim();
    return trimmed.length > 0 && trimmed.length <= 50; // Adjust validation rules as needed
  }

  // Validate month format
  private validateMonth(month: string): boolean {
    const trimmed = month?.toString().trim();
    return trimmed.length > 0 && trimmed.length <= 20; // Adjust validation rules as needed
  }

  // Check if user can register
  async canUserRegister(
    idNumber: string,
    month: string
  ): Promise<{
    canRegister: boolean;
    reason?: string;
    existingRegistration?: any;
  }> {
    try {
      const status = await this.sheetsService.getRegistrationStatus(
        idNumber,
        month
      );

      if (status.isRegistered) {
        return {
          canRegister: false,
          reason: status.message,
          existingRegistration: {
            date: status.registrationDate,
            id: idNumber,
            month: month,
          },
        };
      }

      return { canRegister: true };
    } catch (error) {
      return {
        canRegister: false,
        reason: 'Unable to verify eligibility due to system error',
      };
    }
  }

  // Get registration history for an ID
  async getRegistrationHistory(idNumber: string): Promise<RegistrationResult> {
    try {
      const history = await this.sheetsService.getRegistrationsByID(idNumber);
      return {
        success: true,
        message: `Found ${history.length} registration(s) for ID ${idNumber}`,
        data: history,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to retrieve registration history: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      };
    }
  }
}

// Export the enhanced service and handler
export const googleSheetsService = new GoogleSheetsService();
export const registrationHandler = new RegistrationHandler();
export {
  GoogleSheetsService,
  RegistrationHandler,
  type RegistrationResult,
  type SheetRow,
};
