// English to Bengali number mapping
const enToBnDigits: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export function toBanglaNumber(val: number | string): string {
  const str = String(val);
  return str.replace(/[0-9]/g, (digit) => enToBnDigits[digit] || digit);
}

// Days and Months in Bengali
const bnDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
const bnMonths = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

export function getBengaliFormattedToday(): {
  gregorian: string;
  banglaEra: string;
  hijri: string;
  time: string;
} {
  const now = new Date();
  const dayName = bnDays[now.getDay()];
  const dateNum = toBanglaNumber(now.getDate());
  const monthName = bnMonths[now.getMonth()];
  const yearNum = toBanglaNumber(now.getFullYear());

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const timeStr = `${hours}:${minutes} ${ampm}`;

  return {
    gregorian: `${dayName}, ${dateNum} ${monthName} ${yearNum}`,
    banglaEra: timeStr,
    hijri: '',
    time: timeStr,
  };
}

// Convert English time to Bengali
export function formatBanglaTime(timeStr?: string): string {
  if (!timeStr) return '৩১ অক্টোবর ২০২৬, ০২:৩৮ পিএম';
  return timeStr
    .replace(/[0-9]/g, (d) => enToBnDigits[d] || d)
    .replace(/AM/gi, 'এএম')
    .replace(/PM/gi, 'পিএম');
}
