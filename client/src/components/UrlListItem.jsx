import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, MousePointerClick, ExternalLink, Trash2, X, QrCode, BarChart3 } from 'lucide-react';
import QrCodeModal from './QrCodeModal';
import AnalyticsModal from './AnalyticsModal';
import request from '../utils/api';

function UrlListItem({ url, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  const shortUrl = `${import.meta.env.VITE_SERVER_URL}/${url.shortCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await request(`/urls/${url._id}`, { method: 'DELETE' });
      onDelete(url._id);
    } catch (err) {
      console.error(err);
      setDeleting(false);
      setConfirmingDelete(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group flex items-center justify-between gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-400 dark:text-zinc-500 truncate mb-0.5">
          {url.originalUrl}
        </p>
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-lime-600 dark:text-lime-400 font-semibold hover:text-lime-700 dark:hover:text-lime-300"
        >
          {shortUrl.replace('http://', '')}
          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-sm text-zinc-600 dark:text-zinc-300">
          <MousePointerClick className="w-3.5 h-3.5" />
          {url.clicks}
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            copied
              ? 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>

        <button
          onClick={() => setShowQrModal(true)}
          className="p-1.5 text-zinc-400 hover:text-lime-600 dark:hover:text-lime-400 hover:bg-lime-50 dark:hover:bg-lime-400/10 rounded-lg transition-colors"
          aria-label="Show QR code"
        >
          <QrCode className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowAnalyticsModal(true)}
          className="p-1.5 text-zinc-400 hover:text-lime-600 dark:hover:text-lime-400 hover:bg-lime-50 dark:hover:bg-lime-400/10 rounded-lg transition-colors"
          aria-label="Show analytics"
        >
          <BarChart3 className="w-4 h-4" />
        </button>

        {confirmingDelete ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? '...' : 'Confirm'}
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showQrModal && (
          <QrCodeModal
            url={shortUrl}
            shortCode={url.shortCode}
            onClose={() => setShowQrModal(false)}
          />
        )}

        {showAnalyticsModal && (
          <AnalyticsModal
            urlId={url._id}
            shortCode={url.shortCode}
            onClose={() => setShowAnalyticsModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default UrlListItem;