import { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import request from '../utils/api';

function UrlShortenerForm({ onUrlShortened }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await request('/shorten', {
        method: 'POST',
        body: JSON.stringify({ originalUrl }),
      });

      onUrlShortened(data);
      setOriginalUrl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div
        className={`flex flex-col sm:flex-row gap-3 p-2 bg-white dark:bg-zinc-900 rounded-xl border-2 transition-colors ${
            error ? 'border-red-300 dark:border-red-500/50' : 'border-zinc-200 dark:border-zinc-800 focus-within:border-lime-400'
        }`}
        >
        <input
            type="text"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="Paste a long URL to shorten it..."
            className="flex-1 px-4 py-3 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 bg-transparent outline-none"
        />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-lime-400 text-zinc-950 font-semibold rounded-lg hover:bg-lime-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Shortening
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Shorten
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
        )}
      </form>
    </div>
  );
}

export default UrlShortenerForm;