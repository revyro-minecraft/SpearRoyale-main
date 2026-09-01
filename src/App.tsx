import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import HowToPlayPage from '@/pages/HowToPlayPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import RulesPage from '@/pages/RulesPage';
import StaffPage from '@/pages/StaffPage';
import StorePage from '@/pages/StorePage';
import PunishmentsPage from '@/pages/PunishmentsPage';
import NewsPage from '@/pages/NewsPage';
import FaqPage from '@/pages/FaqPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-to-play" element={<HowToPlayPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/punishments" element={<PunishmentsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/faq" element={<FaqPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
