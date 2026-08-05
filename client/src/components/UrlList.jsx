import { AnimatePresence } from 'motion/react';
import { Link2 } from 'lucide-react';
import UrlListItem from './UrlListItem';

function UrlList({ urls, onDelete, hasSearch }) {
  if (urls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-full mb-4">
          <Link2 className="w-6 h-6 text-zinc-400" />
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">
          {hasSearch ? 'No links match your search' : 'No links yet'}
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
          {hasSearch
            ? 'Try a different search term'
            : 'Shorten your first URL above to get started'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <AnimatePresence mode="popLayout">
        {urls.map((url) => (
          <UrlListItem key={url._id} url={url} onDelete={onDelete} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default UrlList;