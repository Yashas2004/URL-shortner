import { useState, useEffect } from 'react';
import { Link2, MousePointerClick } from 'lucide-react';
import request from '../utils/api';

function StatsBar() {
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await request('/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex gap-4 justify-center flex-wrap">
      <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-5 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div className="p-2 bg-lime-50 dark:bg-lime-400/10 rounded-lg">
          <Link2 className="w-5 h-5 text-lime-600 dark:text-lime-400" />
        </div>
        <div>
          <p className="text-xl font-bold text-zinc-900 dark:text-white leading-none">
            {stats.totalLinks}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Links created</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-5 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div className="p-2 bg-cyan-50 dark:bg-cyan-400/10 rounded-lg">
          <MousePointerClick className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        </div>
        <div>
          <p className="text-xl font-bold text-zinc-900 dark:text-white leading-none">
            {stats.totalClicks}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Total clicks</p>
        </div>
      </div>
    </div>
  );
}

export default StatsBar;
