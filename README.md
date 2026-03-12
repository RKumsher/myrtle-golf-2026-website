# Myrtle Beach 2026 Golf Trip

Scoring website for the Myrtle Beach 2026 golf trip (Mar 20–24). Tracks individual Stableford and team scramble scores across 9 rounds with live leaderboard standings.

**Live site:** https://rkumsher.github.io/myrtle-golf-2026-website/

## Features

- Overall leaderboard with individual, scramble, and bonus point breakdowns
- Round detail pages with full 18-hole scorecards and color-coded Stableford indicators
- Player stats: scoring distribution, par-3/4/5 averages, best/worst rounds
- Supports both scramble formats (2v2v2v2 and 4v4)
- Bonus point tracking (CTP on par 3s, longest drive)
- Masters Golf aesthetic with responsive design

## Tech Stack

- React + Vite + Tailwind CSS
- Google Sheets as data store (fetched as CSV via PapaParse)
- GitHub Pages for hosting

## Development

```bash
npm install
npm run dev
```

## Scoring

Enter scores in the [Google Sheet](https://docs.google.com/spreadsheets/d/1prmP5W0NhPVquKSvrCtY-W7wEQOEBkYFcCFAOFAeiAI/edit). The website computes all Stableford points, rankings, and trip point allocations automatically.

## Deploy

```bash
npm run deploy
```
