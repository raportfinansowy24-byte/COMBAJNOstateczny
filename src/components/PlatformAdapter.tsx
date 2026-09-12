import React, { useState } from 'react';
import { Share2, Send, CheckCircle, Copy, Laptop, Smartphone, AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function PlatformAdapter() {
  const [webhookUrl, setWebhookUrl] = useLocalStorage('vp_make_webhook_v2', 'https://hook.eu1.make.com/twoj-scenariusz-v2');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['tiktok', 'reels', 'shorts', 'fb_feed']);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const togglePlatform = (p: string) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(item => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const payloadExample = {
    event: "content_ready_for_publishing",
    batch_id: `vpm_${new Date().toISOString().slice(0,10).replace(/-/g,'')}_01`,
    active_offer: {
      name: "Top Dating Smartlink CPL",
      smartlink_url: "https://smartlink-pl.mylead.global/tracker?sid=vpm_01",
      geo: "PL"
    },
    variants: {
      ...(selectedPlatforms.includes('tiktok') ? {
        tiktok: {
          aspect_ratio: "9:16",
          resolution: "1080x1920",
          video_url: "https://storage.googleapis.com/vpm-renders/final_tiktok_9_16.mp4",
          caption: "Ten jeden błąd na profilu niszczy wszystko 😳 Zobacz jak to naprawić w bio!",
          hashtags: ["#dating", "#relacje", "#singiel", "#viral", "#fyp"]
        }
      } : {}),
      ...(selectedPlatforms.includes('reels') ? {
        instagram_reels: {
          aspect_ratio: "9:16",
          resolution: "1080x1920",
          video_url: "https://storage.googleapis.com/vpm-renders/final_reels_9_16.mp4",
          caption: "Czy też popełniasz ten błąd na swoim profilu? 🚩 Szczegóły i darmowy test w bio profilu.",
          hashtags: ["#reelspl", "#randki", "#lifestyle", "#warszawa"]
        }
      } : {}),
      ...(selectedPlatforms.includes('shorts') ? {
        youtube_shorts: {
          aspect_ratio: "9:16",
          resolution: "1080x1920",
          video_url: "https://storage.googleapis.com/vpm-renders/final_shorts_9_16.mp4",
          title: "Stop! Ten 1 błąd na profilu randkowym niszczy zasięgi #shorts",
          description: "Sprawdź darmowy poradnik w przypiętym komentarzu i opisie!"
        }
      } : {}),
      ...(selectedPlatforms.includes('fb_feed') ? {
        facebook_post: {
          aspect_ratio: "4:5",
          resolution: "1080x1350",
          video_url: "https://storage.googleapis.com/vpm-renders/final_fb_4_5.mp4",
          caption: "Oto dlaczego większość profili nie przynosi żadnych odpowiedzi. Przeczytaj koniecznie i sprawdź bezpłatny test w pierwszym komentarzu!",
          cta_link: "https://smartlink-pl.mylead.global/tracker?sid=vpm_01"
        }
      } : {})
    },
    meta: {
      audio_type: "mute_safe_visual_only",
      duration_seconds: 8,
      daily_slot: "1/4"
    }
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(payloadExample, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTestWebhook = async () => {
    setSending(true);
    setStatusMessage(null);
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadExample)
      });
      if (response.ok) {
        setStatusMessage('Pomyślnie wysłano testowy sygnał do Make.com!');
      } else {
        setStatusMessage(`Make.com zwrócił kod błędu: HTTP ${response.status}`);
      }
    } catch (err: any) {
      setStatusMessage(`Błąd połączenia (sprawdź czy webhook jest aktywny): ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
          <Share2 className="w-4 h-4" /> KROK 4 W LEJKU: PLATFORM ADAPTER & MAKE.COM
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">Platform Adapter (Multi-Publishing)</h2>
        <p className="mt-2 text-gray-600 text-sm">
          Zgodnie z audytem V2: <strong>Kombajn to Content & Media Engine, a Make.com to warstwa publikacji (Publishing Layer).</strong> Tutaj generowany jest kompletny wieloplatformowy payload (formaty, opisy, tagi, link do oferty) przesyłany jednym Webhookiem.
        </p>
      </div>

      {/* Wybór docelowych platform */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900">Docelowe Platformy w Pakiecie Publikacyjnym:</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'tiktok', label: 'TikTok (9:16)', tag: 'Pion 1080x1920' },
            { id: 'reels', label: 'Instagram Reels (9:16)', tag: 'Pion 1080x1920' },
            { id: 'shorts', label: 'YouTube Shorts (9:16)', tag: 'Pion 1080x1920' },
            { id: 'fb_feed', label: 'Facebook / IG Feed (4:5)', tag: 'Maks. Ekranu' }
          ].map(plat => (
            <button
              key={plat.id}
              onClick={() => togglePlatform(plat.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedPlatforms.includes(plat.id)
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                  : 'border-gray-200 hover:border-gray-300 opacity-60'
              }`}
            >
              <div className="font-semibold text-xs text-gray-900">{plat.label}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">{plat.tag}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Konfiguracja Webhooka i Payloadu dla Make.com */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Webhook URL (Scenariusz Make.com V2)</label>
          <input
            type="url"
            value={webhookUrl}
            onChange={e => setWebhookUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm font-mono"
            placeholder="https://hook.eu1.make.com/..."
          />
        </div>

        {statusMessage && (
          <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-200">
            {statusMessage}
          </div>
        )}

        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" /> Payload JSON przesyłany do Make.com:
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCopyPayload}
                className="flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-indigo-600 bg-gray-100 px-2.5 py-1 rounded transition-colors"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Skopiowano' : 'Kopiuj JSON'}
              </button>
              <button
                onClick={handleSendTestWebhook}
                disabled={sending}
                className="flex items-center gap-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {sending ? 'Wysyłanie...' : 'Wyślij Testowy Webhook'}
              </button>
            </div>
          </div>

          <div className="bg-gray-950 rounded-xl p-4 overflow-x-auto max-h-[350px]">
            <pre className="text-xs font-mono text-emerald-400">
              {JSON.stringify(payloadExample, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
