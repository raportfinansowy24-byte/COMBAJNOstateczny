import React, { useState } from 'react';
import { Copy, CheckCircle, Globe } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function PreLanderGenerator() {
  const [copied, setCopied] = useState(false);
  const [redirectUrl, setRedirectUrl] = useLocalStorage('vp_smartlink', 'https://twojsmartlink.com/oferta');
  const [delay, setDelay] = useLocalStorage('vp_delay', '3');
  const [template, setTemplate] = useLocalStorage('vp_template', 'age');

  const templates = {
    age: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weryfikacja Wieku</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #111; color: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; text-align: center; }
        .card { background-color: #222; padding: 2rem; border-radius: 12px; max-width: 90%; width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        h1 { font-size: 1.5rem; margin-top: 0; }
        p { color: #aaa; font-size: 0.95rem; line-height: 1.5; margin-bottom: 2rem; }
        .btn { background-color: #e50914; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 1rem; font-weight: bold; cursor: pointer; width: 100%; transition: background 0.2s; }
        .btn:hover { background-color: #f40612; }
        .spinner { display: none; margin: 1rem auto; border: 3px solid rgba(255,255,255,0.1); width: 24px; height: 24px; border-radius: 50%; border-left-color: #fff; animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="card" id="card">
        <h1>Wymagana Weryfikacja</h1>
        <p>Ta strona zawiera materiały przeznaczone tylko dla osób pełnoletnich. Czy masz ukończone 18 lat?</p>
        <button class="btn" onclick="verify()">TAK, MAM 18 LAT</button>
        <div class="spinner" id="spinner"></div>
    </div>
    <script>
        function verify() {
            document.querySelector('.btn').style.display = 'none';
            document.getElementById('spinner').style.display = 'block';
            setTimeout(function() { window.location.href = "${redirectUrl}"; }, ${parseInt(delay) * 1000});
        }
    </script>
</body>
</html>`,
    quiz: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prywatny Profil</title>
    <style>
        body { font-family: -apple-system, sans-serif; background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%); color: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; text-align: center; }
        .card { background-color: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 2rem; border-radius: 15px; max-width: 90%; width: 350px; border: 1px solid rgba(255,255,255,0.2); }
        h1 { font-size: 1.5rem; margin-top: 0; }
        p { color: #ffe; font-size: 1rem; margin-bottom: 2rem; }
        .btn { display: block; background-color: #fff; color: #ff758c; border: none; padding: 12px; margin-bottom: 10px; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; width: 100%; transition: transform 0.1s; }
        .btn:active { transform: scale(0.98); }
        .step { display: none; }
        .step.active { display: block; }
    </style>
</head>
<body>
    <div class="card">
        <div class="step active" id="step1">
            <h1>Cześć! 👋</h1>
            <p>Szukasz kogoś na niezobowiązujące spotkanie czy stały związek?</p>
            <button class="btn" onclick="nextStep(2)">Niezobowiązująco 🔥</button>
            <button class="btn" onclick="nextStep(2)">Związek ❤️</button>
        </div>
        <div class="step" id="step2">
            <h1>Pytanie 2</h1>
            <p>Jaki jest Twój wiek?</p>
            <button class="btn" onclick="nextStep(3)">Poniżej 25</button>
            <button class="btn" onclick="nextStep(3)">25 - 35</button>
            <button class="btn" onclick="nextStep(3)">Powyżej 35</button>
        </div>
        <div class="step" id="step3">
            <h1>Znaleziono dopasowania! 🎉</h1>
            <p>Twoje konto jest gotowe do aktywacji.</p>
            <button class="btn" onclick="finish()">Odbierz darmowy dostęp</button>
        </div>
    </div>
    <script>
        function nextStep(step) {
            document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
            document.getElementById('step' + step).classList.add('active');
        }
        function finish() {
            window.location.href = "${redirectUrl}";
        }
    </script>
</body>
</html>`,
    locker: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Player</title>
    <style>
        body { font-family: sans-serif; background-color: #000; color: #fff; margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; }
        .bg-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; filter: blur(15px) brightness(0.4); z-index: -1; background: #333; }
        .player-box { position: relative; width: 90%; max-width: 600px; background: rgba(0,0,0,0.5); border-radius: 12px; padding: 2rem; text-align: center; border: 1px solid rgba(255,255,255,0.1); }
        .play-btn { width: 80px; height: 80px; background: rgba(255, 0, 0, 0.8); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 1.5rem; cursor: pointer; animation: pulse 2s infinite; }
        .play-btn svg { width: 40px; height: 40px; fill: white; margin-left: 5px; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255,0,0, 0.4); } 70% { box-shadow: 0 0 0 20px rgba(255,0,0, 0); } 100% { box-shadow: 0 0 0 0 rgba(255,0,0, 0); } }
        .modal { display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #111; padding: 2rem; border-radius: 12px; width: 80%; border: 1px solid #333; z-index: 10; }
        .btn { background: #007bff; color: white; border: none; padding: 12px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%; margin-top: 1rem; }
    </style>
</head>
<body>
    <div class="bg-img"></div>
    <div class="player-box" id="pbox">
        <div class="play-btn" onclick="showModal()">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <h2>Prywatne Wideo</h2>
        <p style="color:#aaa">Odtwarzanie zabezpieczone</p>
    </div>
    
    <div class="modal" id="modal">
        <h2>Weryfikacja Anty-Bot</h2>
        <p>Aby odtworzyć to wideo, musisz zweryfikować swoje urządzenie w naszej sieci partnerskiej (darmowa rejestracja).</p>
        <button class="btn" onclick="window.location.href='${redirectUrl}'">Zweryfikuj teraz</button>
    </div>

    <script>
        function showModal() {
            document.getElementById('pbox').style.opacity = '0.1';
            document.getElementById('modal').style.display = 'block';
        }
    </script>
</body>
</html>`
  };

  const htmlCode = templates[template as keyof typeof templates];

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pre-Landery CPA</h2>
        <p className="mt-2 text-gray-600">
          Wygeneruj kod HTML dla Pre-landera (Quiz, Locker) przed przekierowaniem do Smartlinka. Podnosi CR i chroni Twoje konta przed banami.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        
        {/* Template Selector */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => setTemplate('age')}
            className={`p-3 rounded-lg border text-sm font-medium transition-all ${template === 'age' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-200 text-gray-700'}`}
          >
            Weryfikacja Wieku (18+)
          </button>
          <button 
            onClick={() => setTemplate('quiz')}
            className={`p-3 rounded-lg border text-sm font-medium transition-all ${template === 'quiz' ? 'border-pink-600 bg-pink-50 text-pink-700' : 'border-gray-200 hover:border-pink-200 text-gray-700'}`}
          >
            Dating Quiz (Zwiększa CR)
          </button>
          <button 
            onClick={() => setTemplate('locker')}
            className={`p-3 rounded-lg border text-sm font-medium transition-all ${template === 'locker' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-200 text-gray-700'}`}
          >
            Video Locker (Blur)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Docelowy Smartlink (URL)</label>
            <input 
              type="text" 
              value={redirectUrl}
              onChange={e => setRedirectUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {template === 'age' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Opóźnienie przekierowania (s)</label>
              <input 
                type="number" 
                value={delay}
                onChange={e => setDelay(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Globe className="w-4 h-4" /> index.html ({template})
            </h3>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Skopiowano' : 'Kopiuj Kod'}
            </button>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-[400px]">
            <code className="text-sm text-green-400 whitespace-pre">
              {htmlCode}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
