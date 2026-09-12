import React, { useState } from 'react';
import { 
  Target, 
  Layers, 
  Sparkles, 
  Share2, 
  Film, 
  Code, 
  Globe, 
  PlaySquare, 
  FolderSync, 
  MessageCircle, 
  HardDrive, 
  TableProperties 
} from 'lucide-react';
import MyLeadEngine from './MyLeadEngine';
import ContentQueueManager from './ContentQueueManager';
import ContentEngine from './ContentEngine';
import PlatformAdapter from './PlatformAdapter';
import FFmpegGenerator from './FFmpegGenerator';
import PreLanderGenerator from './PreLanderGenerator';
import ApiScriptGenerator from './ApiScriptGenerator';
import FolderMonitorGenerator from './FolderMonitorGenerator';
import TelegramBotGenerator from './TelegramBotGenerator';
import GoogleDriveIntegration from './GoogleDriveIntegration';
import GoogleSheetsIntegration from './GoogleSheetsIntegration';

type TabType = 
  | 'mylead' 
  | 'queue' 
  | 'content_engine' 
  | 'adapter' 
  | 'drive' 
  | 'sheets' 
  | 'ffmpeg' 
  | 'prelander' 
  | 'telegram' 
  | 'monitor' 
  | 'api';

export default function Layout() {
  const [activeTab, setActiveTab] = useState<TabType>('mylead');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-6 text-indigo-600">
            <PlaySquare className="w-7 h-7" />
            <div>
              <h1 className="text-lg font-bold leading-tight">KOMBAJN V2</h1>
              <p className="text-[10px] text-gray-500 font-mono">Content & Media Engine</p>
            </div>
          </div>
          
          <nav className="space-y-4">
            {/* Sekcja 1: Główny Lejek V2 */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1.5">
                Lejek Główny V2
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('mylead')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'mylead'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  1. MyLead Oferty
                </button>
                <button
                  onClick={() => setActiveTab('queue')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'queue'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  2. Kolejka & /TUWRZUCAM
                </button>
                <button
                  onClick={() => setActiveTab('content_engine')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'content_engine'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  3. Content Engine (Viral)
                </button>
                <button
                  onClick={() => setActiveTab('adapter')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'adapter'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  4. Platform Adapter (Make)
                </button>
              </div>
            </div>

            {/* Sekcja 2: Google Workspace */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1.5">
                Google Workspace
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('drive')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'drive'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <HardDrive className="w-4 h-4" />
                  Dysk Google (/TUWRZUCAM)
                </button>
                <button
                  onClick={() => setActiveTab('sheets')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'sheets'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <TableProperties className="w-4 h-4" />
                  Arkusze Google (CPA)
                </button>
              </div>
            </div>

            {/* Sekcja 3: Narzędzia Studio & CPA */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1.5">
                Narzędzia & Bufor CPA
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('ffmpeg')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'ffmpeg'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  FFmpeg Renderer
                </button>
                <button
                  onClick={() => setActiveTab('telegram')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'telegram'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  Lejek Telegram
                </button>
                <button
                  onClick={() => setActiveTab('prelander')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'prelander'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  Pre-Landery
                </button>
                <button
                  onClick={() => setActiveTab('monitor')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'monitor'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FolderSync className="w-4 h-4" />
                  Monitor Lokalny (Legacy)
                </button>
                <button
                  onClick={() => setActiveTab('api')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'api'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  API & Webhooki
                </button>
              </div>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'mylead' && <MyLeadEngine />}
          {activeTab === 'queue' && <ContentQueueManager />}
          {activeTab === 'content_engine' && <ContentEngine />}
          {activeTab === 'adapter' && <PlatformAdapter />}
          {activeTab === 'drive' && <GoogleDriveIntegration />}
          {activeTab === 'sheets' && <GoogleSheetsIntegration />}
          {activeTab === 'ffmpeg' && <FFmpegGenerator />}
          {activeTab === 'telegram' && <TelegramBotGenerator />}
          {activeTab === 'prelander' && <PreLanderGenerator />}
          {activeTab === 'monitor' && <FolderMonitorGenerator />}
          {activeTab === 'api' && <ApiScriptGenerator />}
        </div>
      </main>
    </div>
  );
}


