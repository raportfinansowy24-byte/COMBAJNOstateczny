import React, { useState } from 'react';
import { Sparkles, Eye, VolumeX, Flame, Zap, MessageSquare, ArrowRight, Copy, CheckCircle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface HookTemplate {
  category: 'mistake' | 'contrarian' | 'ranking' | 'curiosity';
  name: string;
  hook: string;
  onScreenText: string[];
  payoff: string;
  cta: string;
}

const DATING_HOOKS: HookTemplate[] = [
  {
    category: 'mistake',
    name: 'Ostrzeżenie o Błędzie Profilowym',
    hook: 'Stop! Przez ten 1 błąd na profilu nikt do Ciebie nie pisze.',
    onScreenText: [
      'Błąd #1: Złe pierwsze zdjęcie',
      'Nie pokazujesz pasji ani energii',
      'Wystarczy zmienić ten jeden kadr'
    ],
    payoff: 'Sprawdź jak zmienić profil w 60 sekund',
    cta: 'Darmowy test w bio 🔞'
  },
  {
    category: 'contrarian',
    name: 'Obalanie Mitu o Randkowaniu',
    hook: 'Wszyscy mówią: bądź miły. Prawda o randkach w 2026 jest inna...',
    onScreenText: [
      'Miły = Niewidzialny',
      'Algorytm i ludzie szukają polaryzacji',
      'Pokaż konkretny typ charakteru'
    ],
    payoff: 'Oto co faktycznie działa w wiadomościach',
    cta: 'Sprawdź profil w bio 👇'
  },
  {
    category: 'ranking',
    name: 'Ranking 3 Typów Zdjęć',
    hook: 'Ranking: 3 zdjęcia, które gwarantują natychmiastowe dopasowanie',
    onScreenText: [
      '#3: Zdjęcie z pasją/hobby',
      '#2: Naturalny uśmiech w kawiarni',
      '#1: Prawdziwy game-changer...'
    ],
    payoff: 'Numer 1 podwaja liczbę wiadomości',
    cta: 'Zobacz prywatną listę w bio 🔥'
  },
  {
    category: 'curiosity',
    name: 'Luka Ciekawości (Curiosity Gap)',
    hook: 'Ten jeden szczegół zmienia całe pierwsze wrażenie w 1 sekundę.',
    onScreenText: [
      'Ludzie oceniają profil w 0.8 sekundy',
      'Nie chodzi o wygląd, tylko o ten detal',
      'Zobacz jak to wygląda w praktyce'
    ],
    payoff: 'Różnica jest kolosalna',
    cta: 'Link do pełnego materiału w bio'
  }
];

export default function ContentEngine() {
  const [selectedHook, setSelectedHook] = useState<HookTemplate>(DATING_HOOKS[0]);
  const [assetType, setAssetType] = useState<'image' | 'video'>('image');
  const [duration, setDuration] = useState<number>(8);
  const [copied, setCopied] = useState(false);

  const generatedFFmpegCommand = assetType === 'image'
    ? `ffmpeg -loop 1 -i "input.jpg" -t ${duration} -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.0018,1.3)':d=${duration*25}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)',drawtext=text='${selectedHook.hook}':fontsize=52:fontcolor=yellow:box=1:boxcolor=black@0.7:boxborderw=15:x=(w-text_w)/2:y=280:enable='between(t,0,3)',drawtext=text='${selectedHook.cta}':fontsize=48:fontcolor=white:box=1:boxcolor=red@0.8:boxborderw=12:x=(w-text_w)/2:y=h-350:enable='between(t,${duration-3},${duration})'" -c:v libx264 -pix_fmt yuv420p output_viral_dating.mp4`
    : `ffmpeg -i "input.mp4" -t ${duration} -vf "crop=in_w*0.98:in_h*0.98,eq=brightness=0.01:saturation=1.03,drawtext=text='${selectedHook.hook}':fontsize=52:fontcolor=yellow:box=1:boxcolor=black@0.7:boxborderw=15:x=(w-text_w)/2:y=280:enable='between(t,0,3)',drawtext=text='${selectedHook.cta}':fontsize=48:fontcolor=white:box=1:boxcolor=red@0.8:boxborderw=12:x=(w-text_w)/2:y=h-350:enable='between(t,${duration-3},${duration})'" -map_metadata -1 -c:v libx264 -preset fast -crf 22 output_viral_dating.mp4`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedFFmpegCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
          <Sparkles className="w-4 h-4" /> KROK 3 W LEJKU: CONTENT & VIRAL ENGINE
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">Content Engine (Dating Viral Strategy)</h2>
        <p className="mt-2 text-gray-600 text-sm">
          Zgodnie z audytem: pełna adaptacja psychologii hooków na Dating. <strong>Zero voice-over/TTS</strong> — silnik generuje 100% wizualną mechanikę uwagi (Visual Hook w 1. sekundzie + On-screen Text + CTA), działającą w pełni bez dźwięku.
        </p>
      </div>

      {/* Wytyczne bez dźwięku */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 flex items-start gap-3">
        <VolumeX className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Zasada 100% Mute-Proof:</strong> Ponad 75% odbiorców TikToka i Shorts ogląda pierwsze 2 sekundy bez dźwięku. Ten silnik nie generuje sztucznych lektorów AI — cała siła opiera się na dynamicznym ruchu kadru, kontrastowym tekście i natychmiastowym hooku.
        </div>
      </div>

      {/* Wybór Szablonu Hooka */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          Wybierz Mechanizm Psychologiczny Hooka:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DATING_HOOKS.map((h, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedHook(h)}
              className={`cursor-pointer p-4 rounded-xl border text-left transition-all ${
                selectedHook.name === h.name
                  ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">{h.name}</span>
                <span className="text-[10px] font-semibold bg-gray-200 px-2 py-0.5 rounded text-gray-700">
                  {h.category}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900">"{h.hook}"</p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>CTA: <strong className="text-red-600">{h.cta}</strong></span>
                <span className="text-indigo-600 font-medium">Wybierz &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Konfiguracja Montażu i Czasu */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-600" />
          Parametry Dynamicznego Czasu Trwania (Audyt: Nie sztywne 18s)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Typ pliku wejściowego</label>
            <div className="flex gap-3">
              <button
                onClick={() => { setAssetType('image'); setDuration(8); }}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold transition-all ${
                  assetType === 'image' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                Zdjęcie (Dynamic Ken Burns)
              </button>
              <button
                onClick={() => { setAssetType('video'); setDuration(10); }}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold transition-all ${
                  assetType === 'video' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                Wideo (Unikalizacja + Text)
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Długość klipu: <strong>{duration} sekund</strong> ({assetType === 'image' ? 'optymalnie 7-10s' : 'optymalnie 6-15s'})
            </label>
            <input
              type="range"
              min={assetType === 'image' ? 5 : 5}
              max={assetType === 'image' ? 12 : 20}
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        {/* Struktura Wizualna Klipu */}
        <div className="bg-gray-900 text-white p-5 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Oś czasu montażu (Timeline bez narracji):
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <div className="text-amber-400 font-bold mb-1">0s – 3s: VISUAL HOOK</div>
              <p className="text-gray-300">"{selectedHook.hook}"</p>
              <div className="text-[10px] text-gray-500 mt-1">Żółty tekst na czarnym tle, natychmiastowe zatrzymanie scrolla.</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <div className="text-indigo-400 font-bold mb-1">3s – {duration - 3}s: ON-SCREEN PAYOFF</div>
              <p className="text-gray-300">{selectedHook.onScreenText.join(' • ')}</p>
              <div className="text-[10px] text-gray-500 mt-1">Dynamiczne przybliżenie (ZoomPan), stopniowe odkrywanie treści.</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <div className="text-red-400 font-bold mb-1">{duration - 3}s – {duration}s: VISUAL CTA</div>
              <p className="text-gray-300 font-bold">"{selectedHook.cta}"</p>
              <div className="text-[10px] text-gray-500 mt-1">Czerwona belka z wezwaniem do akcji kierująca do bio / Smartlinka.</div>
            </div>
          </div>
        </div>

        {/* Generowana komenda FFmpeg Content Renderera */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700">Komenda Content Renderera (FFmpeg):</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded transition-colors"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Skopiowano' : 'Kopiuj komendę'}
            </button>
          </div>
          <div className="bg-gray-950 rounded-lg p-3 overflow-x-auto text-xs font-mono text-emerald-400">
            {generatedFFmpegCommand}
          </div>
        </div>
      </div>
    </div>
  );
}
