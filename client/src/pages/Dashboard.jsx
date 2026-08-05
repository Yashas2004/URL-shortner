import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import Header from '../components/Header';
import StatsBar from '../components/StatsBar';
import UrlShortenerForm from '../components/UrlShortenerForm';
import UrlList from '../components/UrlList';
import Pagination from '../components/Pagination';
import AnimatedBackground from '../components/AnimatedBackground';
import request from '../utils/api';

const PAGE_SIZE = 5;

function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const fetchUrls = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, limit: PAGE_SIZE });
        if (search) params.set('search', search);

        const data = await request(`/urls?${params.toString()}`);

        if (data.urls.length === 0 && page > 1 && page > data.totalPages) {
          setPage(data.totalPages);
          return;
        }

        setUrls(data.urls);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Failed to fetch URLs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, [search, page, refreshIndex]);

  const handleUrlShortened = () => {
    if (search || page !== 1) {
      setSearchInput('');
      setSearch('');
      setPage(1);
    } else {
      setRefreshIndex((i) => i + 1);
    }
  };

  const handleUrlDeleted = () => {
    setRefreshIndex((i) => i + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="relative min-h-screen bg-white dark:bg-zinc-950 transition-colors"
    >
      <AnimatedBackground />
      <Header />

      <main className="max-w-2xl mx-auto px-4 pb-24">
        <div className="text-center mb-8 mt-6">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-3">
            Shorten links.
            <br />
            <span className="text-lime-600 dark:text-lime-400">
              Share with confidence.
            </span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Fast, reliable link shortening with real-time click tracking.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <UrlShortenerForm onUrlShortened={handleUrlShortened} />
        </div>

        <div className="mb-10">
          <StatsBar />
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search your links..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:ring-2 focus:ring-lime-400 transition-colors"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-lime-400 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <UrlList urls={urls} onDelete={handleUrlDeleted} hasSearch={Boolean(search)} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </main>
    </motion.div>
  );
}

export default Dashboard;