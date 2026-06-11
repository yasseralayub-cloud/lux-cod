/**
 * Clean and format any phone number to be 100% WhatsApp web compatible.
 * It handles Arabic numerals, leading zeros, optional '+' sign, spaces, and
 * prefixed double zero, with sensible Saudi (966) phone normalization.
 */
export function cleanMobileForWhatsApp(phoneStr: string): string {
  if (!phoneStr) return '';

  // 1. Convert Arabic/Eastern Indic numerals (٠١٢٣٤٥٦٧٨٩) to standard English ones (0123456789)
  const arabicDigits = /[٠١٢٣٤٥٦٧٨٩]/g;
  let converted = phoneStr.replace(arabicDigits, (d) => {
    return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  });

  // 2. Remove all non-digit characters
  let digits = converted.replace(/\D/g, '');

  // 3. Remove leading double zero "00" if present
  if (digits.startsWith('00')) {
    digits = digits.substring(2);
  }

  // 4. Handle Saudi local mobile formats:
  // Usually, a Saudi number has 9 digits starting with 5 (e.g. 5xxxxxxx)
  // or 10 digits starting with 05 (e.g. 05xxxxxxx)
  if (digits.startsWith('05') && digits.length === 10) {
    digits = '966' + digits.substring(1); // Converts 05xxxxxxx to 9665xxxxxxx
  } else if (digits.startsWith('5') && digits.length === 9) {
    digits = '966' + digits; // Converts 5xxxxxxx to 9665xxxxxxx
  }

  return digits;
}

/**
 * Sends a notification message to a Telegram chat using a bot token through our backend API helper.
 */
export async function sendTelegramNotification(
  token: string,
  chatId: string,
  message: string
): Promise<boolean> {
  if (!token || !chatId || !message) return false;
  
  try {
    const response = await fetch('/api/send-telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        chatId,
        message
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Error sending Telegram notification via server:', error);
    return false;
  }
}

