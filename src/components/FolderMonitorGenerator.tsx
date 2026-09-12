import React, { useState } from 'react';
import { Copy, CheckCircle, FolderSync, Terminal, Laptop } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function FolderMonitorGenerator() {
  const [copied, setCopied] = useState(false);
  const [inputFolder, setInputFolder] = useLocalStorage('vp_monitor_in', 'tuwrzucam');
  const [outputFolder, setOutputFolder] = useLocalStorage('vp_monitor_out', 'gotowe');
  const [webhookUrl, setWebhookUrl] = useLocalStorage('vp_webhook_url', 'https://hook.eu1.make.com/xxxxxx');
  const [osTab, setOsTab] = useState<'standard' | 'chromebook'>('standard');

  const pythonCode = `import os
import time
import subprocess
import requests
import json
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Konfiguracja
WATCH_FOLDER = "${inputFolder}"
OUTPUT_FOLDER = "${outputFolder}"
MAKE_WEBHOOK_URL = "${webhookUrl}"

# Upewnij się, że foldery istnieją
os.makedirs(WATCH_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def process_media(input_path):
    filename = os.path.basename(input_path)
    name, ext = os.path.splitext(filename)
    output_path = os.path.join(OUTPUT_FOLDER, f"{name}_processed.mp4")
    
    print(f"\\n[+] Rozpoczynam przetwarzanie pliku: {filename}")
    
    # Jeśli to zdjęcie, zróbmy z niego krótkie 5-sekundowe wideo (efekt zoom/pan)
    if ext.lower() in ['.jpg', '.jpeg', '.png']:
        cmd = [
            "ffmpeg", "-y", "-loop", "1", "-i", input_path,
            "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.0015,1.5)':d=125",
            "-c:v", "libx264", "-t", "5", "-pix_fmt", "yuv420p",
            output_path
        ]
    # Jeśli to wideo, wykonaj standardową unikalizację z lekkim przycięciem i zmianą prędkości
    elif ext.lower() in ['.mp4', '.mov']:
        cmd = [
            "ffmpeg", "-y", "-i", input_path,
            "-vf", "crop=in_w*0.98:in_h*0.98,eq=brightness=0.01:saturation=1.03,setpts=0.98*PTS",
            "-filter:a", "atempo=1.02",
            "-map_metadata", "-1",
            "-c:v", "libx264", "-preset", "fast", "-crf", "23",
            "-c:a", "aac", "-b:a", "128k",
            output_path
        ]
    else:
        print(f"[-] Pomijam nieobsługiwany format: {ext}")
        return False
        
    process = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if process.returncode == 0:
        print(f"[+] Zakończono sukcesem: {output_path}")
        return output_path
    else:
        print(f"[-] Błąd FFmpeg:\\n{process.stderr.decode('utf-8')}")
        return False

def trigger_webhook(file_path):
    print("[+] Wysyłam powiadomienie do automatyzacji (Make.com)...")
    payload = {
        "event": "new_content_ready",
        "file_name": os.path.basename(file_path),
        "file_path": os.path.abspath(file_path),
        "timestamp": int(time.time())
    }
    
    try:
        headers = {'Content-Type': 'application/json'}
        response = requests.post(MAKE_WEBHOOK_URL, data=json.dumps(payload), headers=headers)
        if response.status_code == 200:
            print("[+] Pomyślnie ztriggerowano webhook!")
        else:
            print(f"[-] Błąd webhooka: HTTP {response.status_code}")
    except Exception as e:
        print(f"[-] Błąd sieci: {str(e)}")

class MonitorHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory:
            filepath = event.src_path
            # Czekamy chwilę, by upewnić się, że plik został w pełni skopiowany
            time.sleep(1.5)
            
            output_file = process_media(filepath)
            if output_file:
                trigger_webhook(output_file)

if __name__ == "__main__":
    print(f"[*] Uruchamiam nasłuchiwanie folderu: ./{WATCH_FOLDER}")
    print(f"[*] Przetworzone pliki wylądują w: ./{OUTPUT_FOLDER}")
    print("[*] Naciśnij Ctrl+C aby zatrzymać.\\n")
    
    event_handler = MonitorHandler()
    observer = Observer()
    observer.schedule(event_handler, WATCH_FOLDER, recursive=False)
    observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Monitor Lokalnego Folderu</h2>
        <p className="mt-2 text-gray-600">
          Uruchom ten skrypt Python na swoim komputerze. Będzie on nasłuchiwał zmian w wybranym folderze. Gdy wrzucisz zdjęcie, automatycznie przerobi je na dynamiczne wideo (efekt Zoom) za pomocą FFmpeg i wyśle sygnał do Make.com.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setOsTab('standard')}
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${osTab === 'standard' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Terminal className="w-4 h-4" /> Windows / macOS
          </button>
          <button 
            onClick={() => setOsTab('chromebook')}
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${osTab === 'chromebook' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Laptop className="w-4 h-4" /> Chromebook (Linux)
          </button>
        </div>

        <div className="p-4 bg-yellow-50 text-sm text-yellow-800">
          {osTab === 'standard' ? (
            <div className="space-y-1">
              <strong>Wymagania lokalne:</strong> Aby skrypt zadziałał na Twoim komputerze, musisz mieć zainstalowanego Pythona, program FFmpeg (dodany do zmiennych środowiskowych PATH) oraz pakiety Pythona.
              <br/>Uruchom w terminalu: <code className="bg-yellow-100 px-1 rounded font-mono">pip install watchdog requests</code>
            </div>
          ) : (
            <div className="space-y-2">
              <strong>Uruchomienie na Chromebooku:</strong> Chromebooki obsługują to doskonale dzięki wbudowanemu kontenerowi Linux!
              <ol className="list-decimal pl-5 mt-1 space-y-1">
                <li>Włącz Linuxa: <strong>Ustawienia {'>'} Zaawansowane {'>'} Deweloperzy {'>'} Środowisko programistyczne Linux</strong>.</li>
                <li>Otwórz aplikację <strong>Terminal</strong> (pingwin) i wpisz: <code className="bg-yellow-100 px-1 rounded font-mono">sudo apt update && sudo apt install ffmpeg python3-pip python3-venv -y</code></li>
                <li>Utwórz środowisko i zainstaluj paczki: <code className="bg-yellow-100 px-1 rounded font-mono">python3 -m venv env && source env/bin/activate && pip install watchdog requests</code></li>
                <li>W aplikacji Pliki (Files) w ChromeOS, kliknij prawym na folder "{inputFolder}" i wybierz <strong>"Udostępnij w systemie Linux"</strong>. Folder pojawi się w Terminalu w ścieżce <code className="bg-yellow-100 px-1 rounded font-mono">/mnt/chromeos/MyFiles/Downloads/{inputFolder}</code>.</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Folder nasłuchiwany (np. wrzucasz tu foto)</label>
            <input 
              type="text" 
              value={inputFolder}
              onChange={e => setInputFolder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              placeholder={osTab === 'chromebook' ? '/mnt/chromeos/MyFiles/Downloads/tuwrzucam' : 'tuwrzucam'}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Folder na gotowe wideo</label>
            <input 
              type="text" 
              value={outputFolder}
              onChange={e => setOutputFolder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              placeholder={osTab === 'chromebook' ? '/mnt/chromeos/MyFiles/Downloads/gotowe' : 'gotowe'}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Webhook automatyzacji (Make.com)</label>
            <input 
              type="text" 
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <FolderSync className="w-4 h-4" /> auto_monitor.py
            </h3>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Skopiowano' : 'Kopiuj Kod'}
            </button>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-[500px]">
            <code className="text-sm text-green-400 whitespace-pre">
              {pythonCode}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
