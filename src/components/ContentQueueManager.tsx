import React, { useState, useEffect } from 'react';
import { Layers, Clock, AlertCircle, Play, CheckCircle, RefreshCw, FolderInput, HardDrive, Plus, Cpu, Settings2, Webhook } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { QueueItem } from '../types';

const INITIAL_QUEUE: QueueItem[] = [
  {
    id: 'q-1',
    fileName: 'photo_blonde_gym_01.jpg',
    fileType: 'image',
    source: 'google_drive',
    status: 'ready',
    dateAdded: '2026-09-12 10:15',
    processedUrl: 'processed_9_16_photo_blonde_gym_01.mp4'
  },
  {
    id: 'q-2',
    fileName: 'video_street_interview_02.mp4',
    fileType: 'video',
    source: 'google_drive',
    status: 'ready',
    dateAdded: '2026-09-12 11:30',
    processedUrl: 'processed_9_16_video_street_interview_02.mp4'
  },
  {
    id: 'q-4',
    fileName: 'video_night_club_04.mp4',
    fileType: 'video',
    source: 'google_drive',
    status: 'queued',
    dateAdded: '2026-09-12 13:00'
  }
];

export default function ContentQueueManager() {
  const [queue, setQueue] = useLocalStorage<QueueItem[]>('vpm_content_queue', INITIAL_QUEUE);
  const [dailyLimit] = useState(4);
  const [daemonLogs, setDaemonLogs] = useState<{time: string, msg: string}[]>([]);

  // Obliczenie wykorzystania limitu dziennego
  const processedToday = queue.filter(item => item.status === 'ready' || item.status === 'sent_to_make').length;
  const inProcessing = queue.filter(item => item.status === 'processing').length;
  const availableSlots = Math.max(0, dailyLimit - (processedToday + inProcessing));

  // Autonomiczny Demon Kolejki
  useEffect(() => {
    const defaultLogs = [
      { time: new Date(Date.now() - 7200000).toLocaleTimeString(), msg: 'Demon kolejki zainicjowany. Nasłuch /TUWRZUCAM aktywny.' },
      { time: new Date(Date.now() - 3600000).toLocaleTimeString(), msg: 'Połączono z Google Drive API.' }
    ];
    setDaemonLogs(defaultLogs);

    const daemonInterval = setInterval(() => {
      setDaemonLogs(prev => {
        return [{ time: new Date().toLocaleTimeString(), msg: 'Auto-Scan: Skanowanie folderu /TUWRZUCAM na Google Drive...' }, ...prev].slice(0, 4);
      });

      // Jeśli mamy wolne sloty, znajdź jeden element 'queued' i przenieś go do processing automatycznie
      setQueue(currentQueue => {
        const slotsNow = dailyLimit - (currentQueue.filter(item => item.status === 'ready' || item.status === 'sent_to_make').length + currentQueue.filter(item => item.status === 'processing').length);
        
        if (slotsNow > 0) {
          const nextIndex = currentQueue.findIndex(q => q.status === 'queued');
          if (nextIndex !== -1) {
            const newQueue = [...currentQueue];
            newQueue[nextIndex] = { ...newQueue[nextIndex], status: 'processing' };
            
            // Log informacyjny
            setDaemonLogs(prev => [{ time: new Date().toLocaleTimeString(), msg: `Znaleziono nowy plik: ${newQueue[nextIndex].fileName}. Przekazano do Agenta (Krok 3).` }, ...prev].slice(0, 4));

            // Symulacja ukończenia po 3 sekundach
            setTimeout(() => {
              setQueue(q => q.map(item => item.id === newQueue[nextIndex].id ? { ...item, status: 'ready', processedUrl: `render_9_16_${item.fileName}.mp4` } : item));
            }, 3000);

            return newQueue;
          }
        }
        return currentQueue;
      });

    }, 8000); // Co 8 sekund symulujemy interwał sprawdzenia Drive'a

    return () => clearInterval(daemonInterval);
  }, [dailyLimit, setQueue]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
          <Layers className="w-4 h-4" /> KROK 2 W LEJKU: KOLEJKA & LIMIT DZIENNY
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">Autonomous Queue Daemon (Google Drive)</h2>
        <p className="mt-2 text-gray-600 text-sm">
          Główny monitor zasobów. <strong>Brak ręcznego dodawania plików.</strong> Bot cyklicznie skanuje Google Drive (<code>/TUWRZUCAM</code>) i pobiera content dbając o to, by nie przekroczyć twardego limitu publikacji (4x/dzień). Następnie samodzielnie przekazuje je dalej.
        </p>
      </div>

      {/* Pasek Limitu Dziennego */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5">
            <Cpu className="w-20 h-20" />
          </div>
          <div className="relative z-10">
            <div className="text-xs font-semibold text-gray-500 uppercase">Status Limitu Dziennego</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-indigo-600">{processedToday + inProcessing}</span>
              <span className="text-gray-400 font-medium text-lg">/ {dailyLimit} max</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${
                  processedToday + inProcessing >= dailyLimit ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${Math.min(100, ((processedToday + inProcessing) / dailyLimit) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5">
            <Webhook className="w-20 h-20" />
          </div>
          <div className="relative z-10">
            <div className="text-xs font-semibold text-gray-500 uppercase">Wolne sloty (Auto-dispatch)</div>
            <div className="mt-2 text-3xl font-extrabold text-emerald-600">
              {availableSlots} {availableSlots === 1 ? 'slot' : 'sloty'}
            </div>
            <p className="text-[11px] font-medium text-gray-500 mt-3 flex items-center gap-1.5">
               {availableSlots === 0 ? (
                 <><AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Pobieranie wstrzymane na 24h.</>
               ) : (
                 <><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Pobieranie z Drive Aktywne</>
               )}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Settings2 className="w-3.5 h-3.5" /> Dziennik Demona
          </div>
          <div className="space-y-2 h-20 overflow-hidden relative">
            {daemonLogs.map((log, i) => (
              <div key={i} className={`text-[10px] font-mono leading-tight ${i === 0 ? 'text-white' : 'text-slate-500'}`}>
                <span className="text-slate-500">[{log.time}]</span> {log.msg}
              </div>
            ))}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-900 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Lista Elementów w Kolejce (Tylko Odczyt) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
            <FolderInput className="w-4 h-4 text-indigo-600" />
            Zawartość monitorowanego folderu (/TUWRZUCAM)
          </div>
          <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 animate-spin" /> Auto-Sync ON
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {queue.length === 0 && (
             <div className="p-8 text-center text-sm text-gray-500">Kolejka jest pusta. Demon oczekuje na nowe pliki.</div>
          )}
          {queue.map((item) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${
                  item.fileType === 'image' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.fileType === 'image' ? 'FOTO' : 'WIDEO'}
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                    {item.fileName}
                    <span className="text-[10px] font-normal text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <HardDrive className="w-3 h-3" /> {item.source}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Znaleziono: {item.dateAdded}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {item.status === 'ready' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5" /> Oczekuje na Telegram (Krok 4)
                  </span>
                )}
                {item.status === 'processing' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse">
                    <Cpu className="w-3.5 h-3.5 animate-pulse" /> W przekazaniu do Agenta...
                  </span>
                )}
                {item.status === 'queued' && (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                      <Clock className="w-3.5 h-3.5" /> Oczekuje w kolejce (Auto)
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
