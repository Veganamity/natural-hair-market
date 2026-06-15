import { Home, ArrowLeft, Search } from 'lucide-react';

interface NotFoundProps {
  onGoHome: () => void;
  onGoBack: () => void;
}

export function NotFound({ onGoHome, onGoBack }: NotFoundProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/file_0000000094ac71f49db79e27f27b239c.png"
            alt="Natural Hair Market"
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* 404 */}
        <div className="relative mb-6">
          <span className="text-[10rem] font-black text-stone-100 leading-none select-none block">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-16 h-16 text-amber-300" strokeWidth={1.5} />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-stone-800 mb-3">
          Page introuvable
        </h1>
        <p className="text-stone-500 mb-10 leading-relaxed">
          Cette page n&apos;existe pas ou a &eacute;t&eacute; d&eacute;plac&eacute;e.<br />
          Retournez &agrave; l&apos;accueil pour continuer votre navigation.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onGoHome}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            Retour &agrave; l&apos;accueil
          </button>
          <button
            onClick={onGoBack}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-stone-50 text-stone-700 font-semibold rounded-xl border border-stone-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Page pr&eacute;c&eacute;dente
          </button>
        </div>

        {/* Footer */}
        <p className="mt-12 text-sm text-stone-400">
          Natural Hair Market &mdash; La marketplace de r&eacute;f&eacute;rence pour les cheveux naturels
        </p>
      </div>
    </div>
  );
}
