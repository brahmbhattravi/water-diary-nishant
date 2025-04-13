import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n')
      : '';

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: 'v4', auth: client });

    // Get today's date in the format DD-MM-YYYY
    const today = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).split(',')[0].replace(/\//g, '-');

    // Get all values from the sheet
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:B',
    });

    const rows = response.data.values || [];
    
    // Calculate total water intake for today
    const todayTotal = rows.reduce((total, row) => {
      if (!row || row.length < 2) return total;
      
      const date = row[0].split(',')[0].trim();
      const amount = parseInt(row[1]);
      
      if (date === today && !isNaN(amount)) {
        return total + amount;
      }
      return total;
    }, 0);

    return res.status(200).json({ total: todayTotal });

  } catch (err) {
    console.error('Error fetching today\'s total:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s total',
      error: err.message
    });
  }
} 