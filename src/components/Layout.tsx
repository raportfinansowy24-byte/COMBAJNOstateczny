import React, { useState } from 'react';
import { Film, Code, Globe, PlaySquare, FolderSync, MessageCircle, HardDrive, TableProperties } from 'lucide-react';
import FFmpegGenerator from './FFmpegGenerator';
import PreLanderGenerator from './PreLanderGenerator';
import ApiScriptGenerator from './ApiScriptGenerator';
import FolderMonitorGenerator from './FolderMonitorGenerator';
import TelegramBotGenerator from './TelegramBotGenerator';
import GoogleDriveIntegration from './GoogleDriveIntegration';
import GoogleSheetsIntegration from './GoogleSheetsIntegration';

export default function Layout() {
  const [activeTab, setActiveTab] = useState<'ffmpeg' | 'prelander' | 'api' | 'monitor' | 'telegram' | 'drive' | 'sheets'>('ffmpeg');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8 text-indigo-600">
            <PlaySquare className="w-8 h-8" />
            <h1 className="text-xl font-bold leading-tight">VP&M<br/>Studio</h1>
          </div>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('ffmpeg')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'ffmpeg'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Film className="w-5 h-5" />
              FFmpeg Unikalizacja
            </button>
            <button
              onClick={() => setActiveTab('drive')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'drive'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <HardDrive className="w-5 h-5" />
              Dysk Google
            </button>
            <button
              onClick={() => setActiveTab('sheets')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'sheets'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <TableProperties className="w-5 h-5" />
              Arkusze Google
            </button>
            <button
              onClick={() => setActiveTab('monitor')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'monitor'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <FolderSync className="w-5 h-5" />
              Monitor Folderu
            </button>
            <button
              onClick={() => setActiveTab('telegram')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'telegram'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              Bot Telegram
            </button>
            <button
              onClick={() => setActiveTab('prelander')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'prelander'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Globe className="w-5 h-5" />
              Pre-Landery CPA
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'api'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Code className="w-5 h-5" />
              API & Automatyzacja
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'ffmpeg' && <FFmpegGenerator />}
          {activeTab === 'drive' && <GoogleDriveIntegration />}
          {activeTab === 'sheets' && <GoogleSheetsIntegration />}
          {activeTab === 'monitor' && <FolderMonitorGenerator />}
          {activeTab === 'telegram' && <TelegramBotGenerator />}
          {activeTab === 'prelander' && <PreLanderGenerator />}
          {activeTab === 'api' && <ApiScriptGenerator />}
        </div>
      </main>
    </div>
  );
}

