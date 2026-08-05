import { useRef } from 'react';
import { motion } from 'motion/react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Download } from 'lucide-react';

function QrCodeModal({ url, shortCode, onClose }) {
  const canvasRef = useRef(null);

  const handleDownload = () => {
    const canvas = canvasRef.current.querySelector('canvas');
    const link = document.createElement('a');
    link.download = `${shortCode}-qrcode.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

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
        className="w-full max-w-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-sm font-semibold text-zinc-900 dark:text-white">QR Code</h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div ref={canvasRef} className="flex justify-center p-4 bg-white rounded-xl">
          <QRCodeCanvas value={url} size={192} />
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center truncate mt-4 mb-4">
          {url}
        </p>

        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-lime-400 text-zinc-950 font-semibold rounded-lg hover:bg-lime-300 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PNG
        </button>
      </motion.div>
    </motion.div>
  );
}

export default QrCodeModal;
