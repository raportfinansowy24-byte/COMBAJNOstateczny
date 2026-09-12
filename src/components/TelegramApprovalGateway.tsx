import React, { useState } from 'react';
import { ShieldCheck, Send, CheckCircle2, AlertCircle, Smartphone, Eye, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function TelegramApprovalGateway() {
  const [chatId, setChatId] = useLocalStorage('vpm_tg_chat_id', '1531918870');
  const [botToken, setBotToken] = useLocalStorage('vpm_tg_bot_token', '');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  const handleSendTestApproval = async () => {
    if (!botToken) {
      setStatus({
        success: false,
        message: 'Wklej swój Bot Token od @BotFather poniżej, aby wysłać powiadomienie testowe na telefon.'
      });
      return;
    }

    setIsSending(true);
    setStatus(null);

    try {
      const text = `🎬 *KOMBAJN V2: Nowy materiał czeka na Twoją akceptację!*\n\n` +
        `📁 *Plik:* \`lv_76750073937_processed.mp4\`\n` +
        `🎯 *Oferta:* Top Dating Smartlink CPL (PL)\n` +
        `📱 *Formaty:* TikTok (9:16), Reels (9:16), FB (4:5)\n` +
        `⏱ *Długość:* 8 sekund (Mute-Proof)\n\n` +
        `📝 *Opis posta:*\n` +
        `_"Ten jeden błąd na profilu niszczy wszystko 😳 Zobacz jak to naprawić w bio!"_\n\n` +
        `Wybierz akcję poniżej, aby zdecydować o publikacji:`;

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🟢 ZATWIERDŹ I PUBLIKUJ', callback_data: 'approve_publish' },
                { text: '🔴 ODRZUĆ MATERIAŁ', callback_data: 'reject_publish' }
              ],
              [
                { text: '👁 Otwórz podgląd wideo', url: sampleVideoUrl }
              ]
            ]
          }
        })
      });

      const data = await response.json();

      if (data.ok) {
        setStatus({
          success: true,
          message: 'Powiadomienie zostało wysłane na Twój telefon! Sprawdź aplikację Telegram (czat z @KombajnAkceptacjaBot).'
        });
      } else {
        setStatus({
          success: false,
          message: `Telegram API zwrócił błąd: ${data.description || 'Niepoprawny token lub bot nie został wystartowany'}`
        });
      }
    } catch (err: any) {
      setStatus({
        success: false,
        message: `Błąd połączenia: ${err.message}`
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
          <ShieldCheck className="w-4 h-4" /> BRAMKA KONTROLI JAKOŚCI (HUMAN-IN-THE-LOOP)
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">Akceptacja Wideo na Telefonie (Telegram)</h2>
        <p className="mt-2 text-gray-600 text-sm">
          Zanim gotowy film trafi na TikToka, Instagrama czy YouTube, automat wysyła powiadomienie z podglądem na Twój telefon. Publikacja rusza dopiero, gdy klikniesz zielony przycisk.
        </p>
      </div>

      {/* Podgląd jak to wygląda na Telegramie */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-lg border border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-400" />
            <span className="font-semibold text-sm">Tak wygląda powiadomienie na Twoim smartfonie:</span>
          </div>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-mono">
            Chat ID: {chatId}
          </span>
        </div>

        <div className="max-w-md mx-auto my-5 bg-slate-800/90 rounded-xl p-4 border border-slate-700 space-y-3 text-xs shadow-inner">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span>🎬 KOMBAJN V2: Nowy materiał czeka na akceptację!</span>
          </div>
          <p className="text-slate-300">
            📁 <strong>Plik:</strong> lv_76750073937_processed.mp4<br/>
            🎯 <strong>Oferta:</strong> Top Dating Smartlink CPL (PL)<br/>
            📱 <strong>Platformy:</strong> TikTok (9:16) • Reels (9:16) • FB (4:5)<br/>
            ⏱ <strong>Czas:</strong> 8s (Mute-Proof Hook + CTA)
          </p>
          <div className="p-2 bg-slate-900/60 rounded border border-slate-700/50 text-slate-300 italic">
            "Ten jeden błąd na profilu niszczy wszystko 😳 Zobacz jak to naprawić w bio!"
          </div>

          <div className="pt-2 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-center flex items-center justify-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5" /> ZATWIERDŹ
              </button>
              <button className="py-2 px-3 bg-red-600/80 hover:bg-red-500 text-white rounded-lg font-bold text-center flex items-center justify-center gap-1">
                <ThumbsDown className="w-3.5 h-3.5" /> ODRZUĆ
              </button>
            </div>
            <button className="w-full py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-center flex items-center justify-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Zobacz podgląd wideo
            </button>
          </div>
        </div>
      </div>

      {/* Konfiguracja i Test */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-gray-900">Konfiguracja Powiadomień</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">Twój Telegram Chat ID</label>
            <input
              type="text"
              value={chatId}
              onChange={e => setChatId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="1531918870"
            />
            <p className="text-[11px] text-gray-500">Twój zweryfikowany identyfikator z @userinfobot.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">Bot Token (z @BotFather)</label>
            <input
              type="text"
              value={botToken}
              onChange={e => setBotToken(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="np. 7123456789:AAFn_example_xYz..."
            />
            <p className="text-[11px] text-gray-500">Z czatu z @BotFather dla @KombajnAkceptacjaBot.</p>
          </div>
        </div>

        {status && (
          <div className={`p-4 rounded-xl text-xs flex items-start gap-2.5 border ${
            status.success
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {status.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
            <div>{status.message}</div>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Pamiętaj, aby przed wysłaniem kliknąć <strong>START</strong> w czacie ze swoim botem <code>@KombajnAkceptacjaBot</code>!
          </div>

          <button
            onClick={handleSendTestApproval}
            disabled={isSending}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {isSending ? 'Wysyłanie na telefon...' : 'Wyślij Testową Akceptację na Telefon'}
          </button>
        </div>
      </div>
    </div>
  );
}
