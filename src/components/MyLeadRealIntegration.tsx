import React, { useState, useEffect } from 'react';
import { Key, DollarSign, CheckCircle2, AlertTriangle, ExternalLink, RefreshCw, Eye, EyeOff, ShieldCheck, TrendingUp, Link as LinkIcon, Lock } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface MyLeadProgram {
  id: string;
  name: string;
  category: string;
  payout: string;
  rateType: string;
  geos: string[];
  smartlinkUrl: string;
  status: 'active' | 'pending';
}

export default function MyLeadRealIntegration() {
  const [apiKey, setApiKey] = useLocalStorage('vpm_mylead_api_key', '');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [liveBalance, setLiveBalance] = useLocalStorage<{ balance: string; pending: string; leadsToday: number } | null>('vpm_mylead_balance', null);
  const [realPrograms, setRealPrograms] = useLocalStorage<MyLeadProgram[]>('vpm_mylead_programs', []);
  const [error, setError] = useState<string | null>(null);

  // Twój własny Smartlink z panelu MyLead (wklejony ręcznie lub pobrany przez API)
  const [activeSmartlink, setActiveSmartlink] = useLocalStorage('vpm_active_smartlink_url', '');

  const fetchMyLeadData = async () => {
    if (!apiKey) {
      setError('Wklej swój osobisty klucz API z panelu MyLead.pl (znajdziesz go w: Profil -> Ustawienia konta -> API).');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // MyLead API endpoint do pobierania statystyk i programów
      // Uwaga: MyLead API wymaga autoryzacji nagłówkiem: Authorization: Bearer <API_KEY> lub Api-Key
      const res = await fetch('https://api.mylead.global/v1/user/balance', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        // Jeśli bezpośredni fetch ma ograniczenie CORS w przeglądarce, informujemy użytkownika
        throw new Error('Klucz API wymaga autoryzacji w panelu MyLead lub skonfigurowania dozwolonego IP.');
      }

      const data = await res.json();
      setLiveBalance({
        balance: data.balance || '0.00 PLN',
        pending: data.pending || '0.00 PLN',
        leadsToday: data.leads_today || 0
      });
    } catch (err: any) {
      // Fallback edukacyjny: wyjaśnienie CORS / API
      setError(
        'Bezpośrednie odpytanie MyLead z przeglądarki zostało zablokowane (CORS lub błędny token). ' +
        'Jeśli chcesz używać swojego realnego Smartlinka, wklej go poniżej bezpośrednio ze swojego panelu MyLead!'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Alert Wyjaśniający */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs leading-relaxed">
            <h4 className="font-bold text-sm text-amber-950">
              Ważne wyjaśnienie: Link z pytania był szablonem demonstracyjnym
            </h4>
            <p>
              Adres <code>https://smartlink-de.mylead.global/tracker?sid=vpm_02</code> był <strong>szablonem poglądowym (mockupem)</strong>. 
              Aplikacja <strong>nie ma jeszcze bezpośredniego wglądu</strong> do Twojego konta MyLead, dopóki nie wprowadzisz swojego klucza API lub nie wkleisz swojego prawdziwego Smartlinka.
            </p>
          </div>
        </div>
      </div>

      {/* Konfiguracja Prawdziwego Smartlinka */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
          <LinkIcon className="w-4 h-4" /> TWÓJ PRAWDZIWY LINK AFILIACYJNY Z MYLEAD
        </div>
        <h3 className="text-xl font-bold text-gray-900">Gdzie trafiają Twoje prowizje?</h3>
        <p className="text-xs text-gray-600">
          Zaloguj się na <a href="https://mylead.global" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline">MyLead.pl</a> ➔ wejdź w <strong>Kampanie ➔ Smartlinks ➔ Randki</strong> ➔ skopiuj swój unikalny link promocyjny i wklej go tutaj:
        </p>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 block">Twój Autentyczny Smartlink z panelu MyLead:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={activeSmartlink}
              onChange={(e) => setActiveSmartlink(e.target.value)}
              placeholder="np. https://mylead.global/sl/123456?sub1=tiktok"
              className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {activeSmartlink && (
              <span className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zapisany!
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500">
            Ten link zostanie natychmiast przekazany do <strong>CPA Cloakera</strong>, <strong>Pre-landera</strong> oraz bota na Telegramie.
          </p>
        </div>
      </div>

      {/* Podłączenie Klucza API MyLead (Dla pełnego wglądu w saldo i zarobki) */}
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Połącz Konto MyLead przez API</h3>
              <p className="text-xs text-slate-400">Daje automatyczny podgląd salda, zarobionych prowizji i konwersji.</p>
            </div>
          </div>

          <a
            href="https://mylead.global/pl/panel/profile/api"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
          >
            Pobierz klucz API z MyLead <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-300 block">Klucz API MyLead (Profile ➔ Ustawienia ➔ API):</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Wklej swój prywatny token API..."
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={fetchMyLeadData}
              disabled={isLoading || !apiKey}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50 flex-shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Sprawdź Saldo
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-300">
            {error}
          </div>
        )}

        {liveBalance && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 uppercase">Dostępne Saldo</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{liveBalance.balance}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 uppercase">Oczekujące na zatwierdzenie</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">{liveBalance.pending}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 uppercase">Leady dzisiaj</div>
              <div className="text-2xl font-extrabold text-indigo-400 mt-1">{liveBalance.leadsToday}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
