import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';
import { Mail, ArrowLeft } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
    'https://www.naturalhairmarket.com/reset-password',
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Email sent!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          We've sent a reset link to <strong>{email}</strong>
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Check your inbox and click the link to reset your password.
            The link expires in 1 hour.
          </p>
        </div>
        <button
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('common.back')} to login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <div className="flex items-center justify-center mb-6">
        <Mail className="w-12 h-12 text-emerald-600" />
      </div>
      <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
        {t('auth.forgotPassword')}
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your email to receive a reset link
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.email')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
            placeholder="votre@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? `${t('common.loading')}` : t('auth.sendResetLink')}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onBack}
          className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')} to login
        </button>
      </div>
    </div>
  );
}
