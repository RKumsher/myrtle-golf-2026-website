// Google Sheets configuration
// Replace SPREADSHEET_ID with your actual published Google Sheet ID
export const SHEET_ID = '1prmP5W0NhPVquKSvrCtY-W7wEQOEBkYFcCFAOFAeiAI';

export const SHEET_NAMES = {
  players: 'Players',
  schedule: 'Schedule',
  courseHoles: 'CourseHoles',
  individualScores: 'IndividualScores',
  scrambleTeams: 'ScrambleTeams',
  scrambleScores: 'ScrambleScores',
  bonusPoints: 'BonusPoints',
};

export function sheetUrl(sheetName) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
}

// Use mock data when sheet ID is not configured
export const USE_MOCK = SHEET_ID === 'YOUR_SPREADSHEET_ID_HERE';

// Individual round trip points by finish position (1st through 8th)
export const INDIVIDUAL_POINTS = [10, 7, 5, 3, 2, 1, 1, 1];

// Scramble points
export const SCRAMBLE_2v2v2v2_POINTS = [8, 5, 3, 1]; // per player: 1st, 2nd, 3rd, 4th
export const SCRAMBLE_4v4_POINTS = { win: 6, lose: 2 };

// Bonus points
export const CTP_POINTS = 2;
export const LD_POINTS = 2;

// Stableford scoring
export const STABLEFORD = {
  '-2': 5, // albatross (double eagle)
  '-1': 4, // eagle (on par 3, this would be ace)
  '0':  4, // eagle
  '1':  3, // birdie
  // Adjusted: relative to par
};

export function calcStablefordPoints(strokes, par) {
  const diff = strokes - par;
  if (diff <= -3) return 5; // albatross or better
  if (diff === -2) return 4; // eagle
  if (diff === -1) return 3; // birdie
  if (diff === 0) return 2;  // par
  if (diff === 1) return 1;  // bogey
  return 0; // double bogey or worse
}
