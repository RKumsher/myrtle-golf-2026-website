import Papa from 'papaparse';
import { SHEET_NAMES, sheetUrl, USE_MOCK } from '../config';
import {
  mockPlayers, mockSchedule, mockCourseHoles,
  mockIndividualScores, mockScrambleTeams, mockScrambleScores, mockBonusPoints,
} from './mockData';

const CACHE_TTL = 60_000; // 60 seconds
const cache = {};

function getCached(key) {
  const entry = cache[key];
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  return null;
}

function setCache(key, data) {
  cache[key] = { data, timestamp: Date.now() };
}

/**
 * Fetch and parse a CSV sheet from Google Sheets
 */
async function fetchSheet(sheetName) {
  const cached = getCached(sheetName);
  if (cached) return cached;

  const url = sheetUrl(sheetName);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch sheet ${sheetName}: ${response.status}`);
  }

  const csv = await response.text();
  const { data, errors } = Papa.parse(csv, { header: true, skipEmptyLines: true });

  if (errors.length > 0) {
    console.warn(`CSV parse warnings for ${sheetName}:`, errors);
  }

  setCache(sheetName, data);
  return data;
}

/**
 * Get mock data for development
 */
function getMockData() {
  return {
    players: mockPlayers,
    schedule: mockSchedule,
    courseHoles: mockCourseHoles,
    individualScores: mockIndividualScores,
    scrambleTeams: mockScrambleTeams,
    scrambleScores: mockScrambleScores,
    bonusPoints: mockBonusPoints,
  };
}

/**
 * Fetch all data from Google Sheets (or mock data in dev mode)
 */
export async function fetchAllData() {
  if (USE_MOCK) {
    return getMockData();
  }

  const [players, schedule, courseHoles, individualScores, scrambleTeams, scrambleScores, bonusPoints] =
    await Promise.all([
      fetchSheet(SHEET_NAMES.players),
      fetchSheet(SHEET_NAMES.schedule),
      fetchSheet(SHEET_NAMES.courseHoles),
      fetchSheet(SHEET_NAMES.individualScores),
      fetchSheet(SHEET_NAMES.scrambleTeams),
      fetchSheet(SHEET_NAMES.scrambleScores),
      fetchSheet(SHEET_NAMES.bonusPoints),
    ]);

  return { players, schedule, courseHoles, individualScores, scrambleTeams, scrambleScores, bonusPoints };
}
