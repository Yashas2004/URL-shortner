import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, MonitorSmartphone, AppWindow, Globe } from 'lucide-react';
import request from '../utils/api';

const POLL_INTERVAL_MS = 4000;

function AnalyticsModal({ urlId, shortCode, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchClicks = async (isInitial) => {
      if (isInitial) setLoading(true);
      try {
        const result = await request(`/urls/${urlId}/clicks`);
        if (!cancelled) setData(result);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        if (isInitial && !cancelled) setLoading(false);
      }
    };

    fetchClicks(true);
    const interval = setInterval(() => fetchClicks(false), POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [urlId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-sm font-semibold text-zinc-900 dark:text-white">
              Analytics for /{shortCode}
            </h2>
            <span className="flex items-center gap-1 text-xs text-lime-600 dark:text-lime-400">
              <span className="relative flex w-1.5 h-1.5">
                <span className="animate-ping absolute inline-flex w-full h-full rounded-full bg-lime-400 opacity-75" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-lime-500" />
              </span>
              Live
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-lime-400 rounded-full animate-spin" />
          </div>
        ) : data.clicks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">No clicks yet</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
              Analytics will appear here once people start clicking your link
            </p>
          </div>
        ) : (
          <>
            <div className="flex gap-3 mb-4">
              <div className="flex-1 flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 px-3 py-2.5 rounded-xl">
                <MonitorSmartphone className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Top device</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                    {data.summary.topDevice}
                  </p>
                </div>
              </div>

              <div className="flex-1 flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 px-3 py-2.5 rounded-xl">
                <AppWindow className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Top browser</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                    {data.summary.topBrowser}
                  </p>
                </div>
              </div>

              <div className="flex-1 flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 px-3 py-2.5 rounded-xl">
                <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Top country</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                    {data.summary.topCountry}
                  </p>
                </div>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2">
              {data.clicks.map((click) => (
                <div
                  key={click._id}
                  className="flex items-center justify-between gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-sm"
                >
                  <div className="min-w-0">
                    <p className="text-zinc-900 dark:text-white font-medium truncate">
                      {click.device} &middot; {click.browser} &middot; {click.os}
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs truncate mt-0.5">
                      {click.city}, {click.country} &middot; {click.referrer}
                      {click.lat != null && click.lon != null && (
                        <>
                          {' '}
                          &middot;{' '}
                          <a
                            href={`https://www.google.com/maps?q=${click.lat},${click.lon}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lime-600 dark:text-lime-400 hover:underline"
                          >
                            View on map
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                  <p className="text-zinc-400 dark:text-zinc-500 text-xs whitespace-nowrap shrink-0">
                    {new Date(click.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default AnalyticsModal;
