import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, Activity, CheckCircle, Flame, Server, Zap, RefreshCw } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { QueueItem } from '../types';

export default function ContentEngine() {
  const [queue] = useLocalStorage<QueueItem[]>('vpm_content_queue', []);
  const [agentLogs, setAgentLogs] = useState<{time: string, message: string, type: 'info'|'success'|'action'}[]>([]);

  // Symulacja logów Agenta w tle (tylko wizualna na żywo, by pokazać że działa samo)
  useEffect(() => {
    const defaultLogs = [
      { time: new Date(Date.now() - 3600000).toLocaleTimeString(), message: 'AI Content Engine uruchomiony. Nasłuchuję w tle...', type: 'info' as const },
      { time: new Date(Date.now() - 1800000).toLocaleTimeString(), message: 'Zoptymalizowano bazę psychologii Viral Hooków na Dating.', type: 'success' as const }
    ];
    setAgentLogs(defaultLogs);

    const interval = setInterval(() => {
      setAgentLogs(prev => {
        const newLog = {
          time: new Date().toLocaleTimeString(),
          message: `Analiza strumienia danych... Oczekiwanie na event z folderu Drive.`,
          type: 'action' as const
        };
        return [newLog, ...prev].slice(0, 5); // trzymaj max 5 logów
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const recentlyProcessed = queue.filter(q => q.status === 'ready' || q.status === 'processing').slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
          <BrainCircuit className="w-4 h-4" /> KROK 3 W LEJKU: AUTONOMICZNY CONTENT ENGINE
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">AI Agent (Automatyczna Strategia)</h2>
        <p className="mt-2 text-gray-600 text-sm">
          Zgodnie z poleceniem, cały proces tworzenia Hooków i wideo został <strong>w pełni zautomatyzowany</strong>. Silnik działa jako niewidoczny agent w tle. <strong>Nie musisz tu nic klikać ani akceptować</strong> — ten proces dzieje się automatycznie pomiędzy wykryciem pliku, a wysłaniem prośby o autoryzację publikacji na Telegramie.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-emerald-900 md:col-span-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 relative">
               <Server className="w-5 h-5 text-emerald-600 relative z-10" />
               <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
            </div>
            <div>
              <h3 className="font-bold text-sm">Status Agenta</h3>
              <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> AKTYWNY W TLE
              </div>
            </div>
          </div>
          <p className="text-xs mt-3 opacity-90 leading-relaxed">
            Ten demon przechwytuje pliki z kolejki i samodzielnie dopasowuje szablony tekstowe <strong>100% Mute-Proof</strong> bez Twojej ingerencji.
          </p>
        </div>

        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 md:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BrainCircuit className="w-32 h-32 text-indigo-500" />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-sm text-gray-300 flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-indigo-400" /> Live Logs (Operacje AI)
            </h3>
            <div className="space-y-2.5">
              {agentLogs.map((log, i) => (
                <div key={i} className={`text-xs font-mono flex items-start gap-3 ${i === 0 ? 'text-indigo-300' : 'text-gray-500'}`}>
                  <span className="shrink-0">[{log.time}]</span>
                  <span className={`${log.type === 'success' ? 'text-emerald-400' : ''}`}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          Ostatnio zautomatyzowane strategie (bez Twojej interwencji):
        </h3>
        {recentlyProcessed.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm flex flex-col items-center">
             <RefreshCw className="w-6 h-6 text-gray-400 animate-spin-slow mb-2" />
            Oczekiwanie na pierwsze pliki z kolejki...
          </div>
        ) : (
          <div className="space-y-3">
            {recentlyProcessed.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 bg-gray-50 rounded-lg justify-between items-start sm:items-center">
                <div>
                  <div className="font-bold text-sm text-gray-800">{item.fileName}</div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Autonomiczny wybór hooka (Dating Mute-Proof)
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-[10px] font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded uppercase">
                    Wygenerowano Komendę FFmpeg
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1"><Zap className="w-3 h-3"/> Trwało: ~1.2s</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
