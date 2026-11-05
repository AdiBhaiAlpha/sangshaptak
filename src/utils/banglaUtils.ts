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
} {
  // Fixed realistic date context based on newspaper layout (Sat, 31 Oct 2026)
  const dayName = 'শনিবার';
  const dateNum = toBanglaNumber(31);
  const monthName = 'অক্টোবর';
  const yearNum = toBanglaNumber(2026);

  return {
    gregorian: `${dayName}, ${dateNum} ${monthName} ${yearNum}`,
    banglaEra: `১৬ কার্তিক ১৪৩৩ বঙ্গাব্দ`,
    hijri: `১৯ রবিউস সানি ১৪৪৮ হিজরি`,
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
