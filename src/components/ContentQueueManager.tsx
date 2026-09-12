import React, { useState } from 'react';
import { Layers, Clock, AlertCircle, Play, CheckCircle, RefreshCw, FolderInput, HardDrive, Plus } from 'lucide-react';
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
    id: 'q-3',
    fileName: 'photo_brunette_coffee_03.jpg',
    fileType: 'image',
    source: 'google_drive',
    status: 'processing',
    dateAdded: '2026-09-12 12:45'
  },
  {
    id: 'q-4',
    fileName: 'video_night_club_04.mp4',
    fileType: 'video',
    source: 'local',
    status: 'queued',
    dateAdded: '2026-09-12 13:00'
  },
  {
    id: 'q-5',
    fileName: 'photo_car_sunset_05.jpg',
    fileType: 'image',
    source: 'google_drive',
    status: 'queued',
    dateAdded: '2026-09-12 13:10'
  }
];

export default function ContentQueueManager() {
  const [queue, setQueue] = useLocalStorage<QueueItem[]>('vpm_content_queue', INITIAL_QUEUE);
  const [dailyLimit] = useState(4);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'image' | 'video'>('image');

  // Obliczenie wykorzystania limitu dziennego
  const processedToday = queue.filter(item => item.status === 'ready' || item.status === 'sent_to_make').length;
  const inProcessing = queue.filter(item => item.status === 'processing').length;
  const availableSlots = Math.max(0, dailyLimit - (processedToday + inProcessing));

  const handleProcessNext = (id: string) => {
    if (availableSlots <= 0) {
      alert('Osiągnięto dzienny limit (4 materiały/dzień). Kolejne assety poczekają na jutrzejszy cykl.');
      return;
    }

    setQueue(queue.map(item => {
      if (item.id === id) {
        return { ...item, status: 'processing' };
      }
      return item;
    }));

    setTimeout(() => {
      setQueue(prev => prev.map(item => {
        if (item.id === id) {
          return { ...item, status: 'ready', processedUrl: `render_9_16_${item.fileName}.mp4` };
        }
        return item;
      }));
    }, 1500);
  };

  const handleAddToQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName) return;

    const newItem: QueueItem = {
      id: `q-${Date.now()}`,
      fileName: newFileName,
      fileType: newFileType,
      source: 'google_drive',
      status: availableSlots > 0 ? 'queued' : 'queued',
      dateAdded: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setQueue([...queue, newItem]);
    setNewFileName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
          <Layers className="w-4 h-4" /> KROK 2 W LEJKU: KOLEJKA & LIMIT DZIENNY
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">Content Queue & /TUWRZUCAM</h2>
        <p className="mt-2 text-gray-600 text-sm">
          Główny monitor zasobów: pliki wykryte w folderze <code>/TUWRZUCAM</code> (Dysk Google / Local) są kolejkowane z twardym limitem <strong>4 publikacji dziennie</strong>.
        </p>
      </div>

      {/* Pasek Limitu Dziennego */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase">Status Limitu Dziennego</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-600">{processedToday + inProcessing}</span>
            <span className="text-gray-400 font-medium text-lg">/ {dailyLimit} max</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all ${
                processedToday + inProcessing >= dailyLimit ? 'bg-amber-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(100, ((processedToday + inProcessing) / dailyLimit) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase">Wolne sloty na dzisiaj</div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600">
            {availableSlots} {availableSlots === 1 ? 'slot' : 'sloty'}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {availableSlots === 0 ? 'Limit wyczerpany na dziś. Kolejne pliki czekają w kolejce.' : 'Gotowe do natychmiastowego montażu.'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase">W kolejce oczekującej</div>
          <div className="mt-2 text-3xl font-extrabold text-gray-700">
            {queue.filter(q => q.status === 'queued').length}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Automatycznie przetworzone w kolejnym oknie publikacji.
          </p>
        </div>
      </div>

      {/* Lista Elementów w Kolejce */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
            <FolderInput className="w-4 h-4 text-indigo-600" />
            Zawartość monitorowanego folderu (/TUWRZUCAM)
          </div>
          <span className="text-xs text-gray-500">
            Źródło: Dysk Google (API) oraz lokalny folder fallback
          </span>
        </div>

        <div className="divide-y divide-gray-100">
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
                    <span className="text-[11px] font-normal text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <HardDrive className="w-3 h-3" /> {item.source}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Dodano: {item.dateAdded}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {item.status === 'ready' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5" /> Gotowy do wysłania
                  </span>
                )}
                {item.status === 'processing' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Renderowanie...
                  </span>
                )}
                {item.status === 'queued' && (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      <Clock className="w-3.5 h-3.5" /> W kolejce
                    </span>
                    <button
                      onClick={() => handleProcessNext(item.id)}
                      disabled={availableSlots <= 0}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold transition-colors disabled:opacity-40"
                    >
                      Renderuj teraz
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Symulacja dodania assetu do /TUWRZUCAM */}
        <form onSubmit={handleAddToQueue} className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Nazwa nowego pliku w /TUWRZUCAM (np. sesja_kawiarnia_01.jpg)"
            value={newFileName}
            onChange={e => setNewFileName(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            required
          />
          <select
            value={newFileType}
            onChange={e => setNewFileType(e.target.value as any)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
          >
            <option value="image">Zdjęcie (JPG/PNG)</option>
            <option value="video">Wideo (MP4/MOV)</option>
          </select>
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Dodaj do /TUWRZUCAM
          </button>
        </form>
      </div>
    </div>
  );
}
