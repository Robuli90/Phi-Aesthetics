import React, { useState, useEffect } from 'react';
import { X, Mail, CheckCircle2, AlertCircle, RefreshCw, LogOut } from 'lucide-react';
import { fetchGmailStatus, connectPracticeGmail, disconnectPracticeGmail, GmailStatus } from '../services/gmailAuth';

interface GmailAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GmailAdminModal: React.FC<GmailAdminModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<GmailStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadStatus = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const s = await fetchGmailStatus();
      setStatus(s);
    } catch {
      setErrorMessage('Status konnte nicht geladen werden.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnect = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await connectPracticeGmail();
      if (res.success) {
        setSuccessMessage(`Erfolgreich mit Google Workspace autorisiert (${res.email || 'info.phiaesthetics@gmail.com'})!`);
        await loadStatus();
      } else {
        setErrorMessage(res.error || 'Verbindung mit Google fehlgeschlagen.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verbindung fehlgeschlagen.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await disconnectPracticeGmail();
      setSuccessMessage('Verbindung getrennt.');
      await loadStatus();
    } catch {
      setErrorMessage('Trennen fehlgeschlagen.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#3E3335]/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[#FBF8F6] border border-[#E9DDDB] rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E9DDDB]">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#775B5D]" />
            <h4 className="font-serif text-xl text-[#3E3335]">
              Praxis Gmail-Integration
            </h4>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#775B5D] hover:bg-[#D8C4C2]/20"
            aria-label="Schließen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#3E3335]/85">
          <p className="leading-relaxed">
            Terminanfragen werden serverseitig verarbeitet und per <strong>Google Gmail API (gmail.send)</strong> an die Praxisadresse übermittelt.
          </p>

          <div className="p-4 rounded-xl bg-[#F0EAE8] border border-[#E9DDDB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#775B5D]">Gmail API Status:</span>
              <span className="flex items-center gap-1.5 font-medium">
                {status?.connected ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Aktiv & bereit</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-amber-700">Autorisierung erforderlich</span>
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#775B5D]">
              <span>Praxis-Empfänger:</span>
              <span className="font-mono">{status?.practiceEmail || 'info.phiaesthetics@gmail.com'}</span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#D69292]/20 border border-[#D69292] text-xs text-[#775B5D] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            {!status?.connected ? (
              <button
                type="button"
                onClick={handleConnect}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-white border border-[#E9DDDB] shadow-xs hover:bg-[#FBF8F6] text-[#3E3335] font-medium text-xs flex items-center justify-center gap-3 transition-colors cursor-pointer"
              >
                {/* Google "G" Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{isLoading ? 'Verbinde mit Google...' : 'Sign in with Google (Praxis autorisieren)'}</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={loadStatus}
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#E9DDDB] text-xs font-medium text-[#775B5D] hover:bg-[#E9DDDB]/20 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Aktualisieren</span>
                </button>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  disabled={isLoading}
                  className="py-2.5 px-3 rounded-xl border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Trennen</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#775B5D] text-[#FBF8F6] text-xs uppercase tracking-wider font-medium hover:bg-[#3E3335] transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
