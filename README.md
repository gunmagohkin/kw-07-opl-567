# Improvement Entry Slide Viewer Application

A professional web application for viewing improvement entries from Google Sheets with timestamp tracking functionality.

## Features

- **ID-based Access Control**: Each ID number can only view entries once per month
- **Real-time Data**: Fetches data directly from Google Sheets
- **Slide Presentation**: Clean, professional slide-based viewing experience
- **Automatic Timestamp**: Records completion timestamps to tracking spreadsheet
- **Responsive Design**: Works perfectly on all devices

## Setup Instructions

### 1. Google Sheets API Configuration

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API
4. Create credentials (API Key)
5. Update the `.env` file with your credentials

### 2. Environment Variables

Update the `.env` file with your actual values:

```env
VITE_GOOGLE_SHEETS_API_KEY=your_actual_api_key_here
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_client_secret_here

# Spreadsheet IDs (already configured)
VITE_DATA_SPREADSHEET_ID=1L8ybrI7DDjE3IdRlE71XuIlDmi6OC7lnTMD-suumeQ0
VITE_TRACKING_SPREADSHEET_ID=1SE8WKe37hsBXwvNyMxJBch6iU4t7qffCCT-pXQCgqoA
VITE_TRACKING_SHEET_NAME=KW-07
```

### 3. Spreadsheet Permissions

Make sure both spreadsheets are:

- Publicly readable (for the data spreadsheet)
- Writable via API (for the tracking spreadsheet)

### 4. Data Format

The data spreadsheet should have these columns:

- Control Number
- Record Number
- Area Code
- Category
- Entry Title
- Description
- Before Image
- Improvement
- After Image
- Improvement Effect
- Date and Time

### 5. Tracking Sheet Format

The tracking spreadsheet (KW-07 sheet) will automatically populate with:

- Column A: ID Number
- Column B: Month
- Column C: Completion Timestamp

## Usage

1. Enter your ID number
2. Select the month you want to view
3. Browse through the improvement entries
4. Complete viewing to record your timestamp

## Security Features

- ID numbers are validated against previous usage
- Each ID can only view entries once per month
- All data fetching is done securely via Google Sheets API
- Timestamps are automatically recorded for audit purposes

## Technical Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Google Sheets API v4
- Vite for development and building
- Lucide React for icons
