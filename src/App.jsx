import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RoundPage from './pages/RoundPage';
import PlayerPage from './pages/PlayerPage';
import ScoringPage from './pages/ScoringPage';
import { useSheetData } from './hooks/useSheetData';

export default function App() {
  const { data, loading, error } = useSheetData();

  return (
    <HashRouter>
      <Layout>
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-masters-green border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 mt-3">Loading scores...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            Error loading data: {error}
          </div>
        )}
        {!loading && !error && (
          <Routes>
            <Route path="/" element={<HomePage data={data} />} />
            <Route path="/round/:roundId" element={<RoundPage data={data} />} />
            <Route path="/player/:playerId" element={<PlayerPage data={data} />} />
            <Route path="/scoring" element={<ScoringPage />} />
          </Routes>
        )}
      </Layout>
    </HashRouter>
  );
}
