import React, { useState } from 'react';
import { Copy, CheckCircle, Terminal, Layers } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function FFmpegGenerator() {
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  
  const [params, setParams] = useLocalStorage('vp_ffmpeg', {
    input: 'input.mp4',
    output: 'output_unique.mp4',
    cropScale: '0.98',
    brightness: '0.01',
    saturation: '1.03',
    speed: '0.98',
    audioSpeed: '1.02',
    batchFolder: 'wideo_baza'
  });

  const updateParam = (key: string, value: string) => {
    setParams({ ...params, [key]: value });
  };

  const singleCommand = `ffmpeg -i ${params.input} -vf "crop=in_w*${params.cropScale}:in_h*${params.cropScale},eq=brightness=${params.brightness}:saturation=${params.saturation},setpts=${params.speed}*PTS" -filter:a "atempo=${params.audioSpeed}" -map_metadata -1 -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k ${params.output}`;

  const batchPythonCode = `import os
import random
import subprocess
from pathlib import Path

# Folder z oryginalnymi filmami (np. pobranymi)
INPUT_DIR = "${params.batchFolder}"
OUTPUT_DIR = "${params.batchFolder}_unique"

os.makedirs(OUTPUT_DIR, exist_ok=True)

for file in os.listdir(INPUT_DIR):
    if not file.lower().endswith(('.mp4', '.mov')):
        continue
        
    in_path = os.path.join(INPUT_DIR, file)
    out_path = os.path.join(OUTPUT_DIR, f"uniq_{file}")
    
    # Randomizacja parametrów (ZABÓJCZE dla algorytmów wykrywających duplikaty!)
    # Crop pomiędzy 1% a 4% (0.96 - 0.99)
    crop = round(random.uniform(0.96, 0.99), 3) 
    
    # Jasność lekko w górę/w dół
    bright = round(random.uniform(-0.02, 0.03), 3)
    sat = round(random.uniform(1.01, 1.05), 3)
    
    # Prędkość wideo i audio +/- 3%
    vid_speed_mod = random.uniform(-0.03, 0.03)
    vid_speed = round(1.0 - vid_speed_mod, 3)
    aud_speed = round(1.0 + vid_speed_mod, 3)
    
    print(f"[*] Procesowanie: {file} | Crop: {crop}, Speed: {vid_speed}")
    
    cmd = [
        "ffmpeg", "-y", "-i", in_path,
        "-vf", f"crop=in_w*{crop}:in_h*{crop},eq=brightness={bright}:saturation={sat},setpts={vid_speed}*PTS",
        "-filter:a", f"atempo={aud_speed}",
        "-map_metadata", "-1",
        "-c:v", "libx264", "-preset", "fast", "-crf", "23",
        "-c:a", "aac", "-b:a", "128k",
        out_path
    ]
    
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"[+] Zapisano: {out_path}")

print("\\n[!] Unikalizacja całego folderu zakończona sukcesem!")
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mode === 'single' ? singleCommand : batchPythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Unikalizacja FFmpeg</h2>
        <p className="mt-2 text-gray-600">
          Generuj komendy do czyszczenia cyfrowego odcisku palca wideo (hash) lub twórz masowe skrypty randomizujące całe foldery materiałów.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setMode('single')}
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${mode === 'single' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Terminal className="w-4 h-4" /> Pojedynczy Plik
          </button>
          <button 
            onClick={() => setMode('batch')}
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${mode === 'batch' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Layers className="w-4 h-4" /> Masowa Randomizacja (Skrypt)
          </button>
        </div>

        <div className="p-6 space-y-6">
          {mode === 'single' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Plik wejściowy</label>
                <input type="text" value={params.input} onChange={e => updateParam('input', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Plik wyjściowy</label>
                <input type="text" value={params.output} onChange={e => updateParam('output', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Skala Crop (przycięcie)</label>
                <input type="number" step="0.01" value={params.cropScale} onChange={e => updateParam('cropScale', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Prędkość wideo (PTS)</label>
                <input type="number" step="0.01" value={params.speed} onChange={e => updateParam('speed', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 mb-2">
                Ten skrypt Python automatycznie przetworzy <strong>każdy plik MP4</strong> w podanym folderze. Każdemu plikowi nada inne, losowe mikrozmiany ucięcia, kolorów i prędkości!
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Folder z plikami wideo</label>
                <input type="text" value={params.batchFolder} onChange={e => updateParam('batchFolder', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> {mode === 'single' ? 'Komenda FFmpeg' : 'batch_randomizer.py'}
              </h3>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Skopiowano' : 'Kopiuj'}
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-[400px]">
              <code className="text-sm text-green-400 whitespace-pre">
                {mode === 'single' ? singleCommand : batchPythonCode}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
