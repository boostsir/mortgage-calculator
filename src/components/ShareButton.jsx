import React, { useState } from 'react';
import QRCode from 'qrcode';

export function ShareButton({ generateUrl, params }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const shareableUrl = generateUrl ? generateUrl(params) : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const generateQRCode = async () => {
    try {
      const qrUrl = await QRCode.toDataURL(shareableUrl);
      setQrCodeUrl(qrUrl);
      setShowQR(true);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    }
  };

  if (!shareableUrl) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Share Your Results</h3>
      
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={copyToClipboard}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          
          <button
            onClick={generateQRCode}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Show QR Code
          </button>
        </div>

        <div className="bg-gray-50 p-3 rounded border text-sm text-gray-600 break-all">
          {shareableUrl}
        </div>

        {showQR && qrCodeUrl && (
          <div className="flex flex-col items-center space-y-3 pt-4">
            <img src={qrCodeUrl} alt="QR Code for sharing mortgage calculation" className="border rounded" />
            <button
              onClick={() => setShowQR(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Hide QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}