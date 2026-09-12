import React, { useState } from 'react';
import { Copy, CheckCircle, Code } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function ApiScriptGenerator() {
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useLocalStorage('vp_webhook_api', 'https://hook.eu1.make.com/xxxxxx');

  const pythonCode = `import requests
import json
import os
import subprocess
import time

# Konfiguracja Webhooka Make.com
MAKE_WEBHOOK_URL = "${webhookUrl}"

def process_video(input_path, output_path):
    print(f"Rozpoczynam unikalizację wideo: {input_path}")
    # Przykładowa komenda FFmpeg dla unikalizacji
    cmd = [
        "ffmpeg", "-y", "-i", input_path,
        "-vf", "crop=in_w*0.98:in_h*0.98,eq=brightness=0.01:saturation=1.03,setpts=0.98*PTS",
        "-filter:a", "atempo=1.02",
        "-map_metadata", "-1",
        "-c:v", "libx264", "-preset", "fast", "-crf", "23",
        "-c:a", "aac", "-b:a", "128k",
        output_path
    ]
    
    process = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if process.returncode == 0:
        print("Wideo pomyślnie przetworzone.")
        return True
    else:
        print(f"Błąd przetwarzania: {process.stderr.decode('utf-8')}")
        return False

def trigger_webhook(video_id, file_path):
    print("Wysyłam powiadomienie do Make.com...")
    payload = {
        "event": "video_processed",
        "video_id": video_id,
        "file_name": os.path.basename(file_path),
        "status": "ready_for_upload",
        "timestamp": int(time.time())
    }
    
    headers = {'Content-Type': 'application/json'}
    response = requests.post(MAKE_WEBHOOK_URL, data=json.dumps(payload), headers=headers)
    
    if response.status_code == 200:
        print("Pomyślnie ztriggerowano webhook.")
    else:
        print(f"Błąd webhooka: HTTP {response.status_code}")

if __name__ == "__main__":
    input_file = "raw_tiktok_1.mp4"
    output_file = "processed_tiktok_1.mp4"
    
    if process_video(input_file, output_file):
        trigger_webhook("video_001", output_file)
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Skrypty API (Python)</h2>
        <p className="mt-2 text-gray-600">
          Wygeneruj skrypt Python do automatyzacji FFmpeg i wysyłania Webhooków do Make.com lub Zapier.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Webhook URL (Make.com)</label>
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
              <Code className="w-4 h-4" /> auto_process.py
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
