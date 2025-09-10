import React, { useRef, useEffect, useState } from 'react';
import { X, Camera, AlertCircle } from 'lucide-react';
import QrScanner from 'qr-scanner';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function QRScanner({ onScan, onClose, isOpen }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [error, setError] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          onScan(result.data);
          onClose();
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment',
        }
      );

      setQrScanner(scanner);

      scanner.start().then(() => {
        setHasPermission(true);
        setError('');
      }).catch((err) => {
        setHasPermission(false);
        setError('Camera access denied or not available');
        console.error('QR Scanner error:', err);
      });

      return () => {
        scanner.stop();
        scanner.destroy();
      };
    }
  }, [isOpen, onScan, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-md mx-auto">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 p-4">
          <div className="flex items-center justify-between text-white">
            <h3 className="text-lg font-semibold">Scan QR Code</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-white/80 text-sm mt-2">
            Point your camera at a QR code to scan payment details
          </p>
        </div>

        {/* Video Container */}
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
          
          {/* Scan Frame */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 border-2 border-white/30 rounded-2xl"></div>
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-2xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-2xl"></div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="absolute bottom-20 left-4 right-4 bg-red-600 text-white p-4 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            <div>
              <p className="font-medium">Camera Error</p>
              <p className="text-sm text-red-100">{error}</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-white mb-2">
            <Camera size={20} />
            <span className="font-medium">Position QR code in the frame</span>
          </div>
          <p className="text-white/80 text-sm">
            Make sure the QR code is well-lit and clearly visible
          </p>
        </div>
      </div>
    </div>
  );
}