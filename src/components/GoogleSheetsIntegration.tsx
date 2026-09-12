import React, { useState, useEffect } from 'react';
import { TableProperties, LogOut, FileSpreadsheet, Plus, ExternalLink, RefreshCw, CheckCircle } from 'lucide-react';
import { initAuth, googleSignIn, logout, getAccessToken } from '../lib/firebase';
import { User } from 'firebase/auth';

interface Spreadsheet {
  id: string;
  name: string;
  webViewLink: string;
}

export default function GoogleSheetsIntegration() {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [sheets, setSheets] = useState<Spreadsheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setNeedsAuth(false);
        setUser(user);
        setToken(token);
      },
      () => setNeedsAuth(true)
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!needsAuth && token) {
      fetchSheets();
    }
  }, [needsAuth, token]);

  const fetchSheets = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const accessToken = await getAccessToken();
      if (!accessToken) {
        setNeedsAuth(true);
        return;
      }

      // Fetch recent Spreadsheets using Drive API
      const res = await fetch(
        'https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.spreadsheet"&orderBy=modifiedTime desc&pageSize=10&fields=files(id,name,webViewLink)', 
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      if (!res.ok) {
        throw new Error('Nie udało się pobrać arkuszy.');
      }

      const data = await res.json();
      setSheets(data.files || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTrackerSheet = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const accessToken = await getAccessToken();
      if (!accessToken) {
        setNeedsAuth(true);
        return;
      }

      // 1. Create a new Spreadsheet
      const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            title: 'VP&M Studio - CPA Tracker'
          },
          sheets: [
            {
              properties: { title: 'Linki & Konwersje' }
            }
          ]
        })
      });

      if (!createRes.ok) {
        throw new Error('Błąd podczas tworzenia arkusza.');
      }

      const sheetData = await createRes.json();
      const spreadsheetId = sheetData.spreadsheetId;

      // 2. Add header row
      const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:E1?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range: 'A1:E1',
          majorDimension: 'ROWS',
          values: [
            ['Data', 'Konto TikTok', 'Link CPA (Smartlink)', 'Kliknięcia', 'Leady']
          ]
        })
      });

      if (!updateRes.ok) {
        throw new Error('Błąd podczas formatowania nagłówków.');
      }

      setSuccess('Pomyślnie utworzono arkusz CPA Tracker!');
      fetchSheets();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError('Błąd logowania. Spróbuj ponownie.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setNeedsAuth(true);
    setToken(null);
    setUser(null);
    setSheets([]);
  };

  if (needsAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <TableProperties className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Arkusze Google</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Połącz swoje konto, aby automatycznie tworzyć raporty, śledzić konwersje z linków CPA i zarządzać kontami TikTok w jednym arkuszu kalkulacyjnym.
          </p>
        </div>

        <button 
          onClick={handleLogin} 
          disabled={isLoggingIn}
          className="gsi-material-button bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm hover:bg-gray-50 flex items-center gap-3 transition-all disabled:opacity-50"
        >
          <div className="gsi-material-button-icon">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          </div>
          {isLoggingIn ? 'Logowanie...' : 'Zaloguj się z Google'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TableProperties className="w-6 h-6 text-green-600" />
            Tracker Arkuszy Google
          </h2>
          <p className="mt-1 text-sm text-gray-600 flex items-center gap-2">
            Zalogowano jako: <strong>{user?.email}</strong>
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={fetchSheets}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Odśwież
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
          >
            <LogOut className="w-4 h-4" />
            Wyloguj
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-700">Twoje Ostatnie Arkusze</h3>
          </div>
          
          <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
            {loading && sheets.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Ładowanie arkuszy...</div>
            ) : sheets.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Brak arkuszy kalkulacyjnych na dysku.</div>
            ) : (
              sheets.map(sheet => (
                <div key={sheet.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-gray-700">{sheet.name}</span>
                  </div>
                  <a 
                    href={sheet.webViewLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                  >
                    Otwórz <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 h-fit">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900">Nowy Tracker CPA</h3>
          <p className="text-sm text-gray-600">
            Wygeneruj nowy, gotowy arkusz z pre-definiowanymi kolumnami (Data, Konto, Link CPA, Kliki, Leady) prosto na swoim Dysku Google.
          </p>
          <button 
            onClick={createTrackerSheet}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Tworzenie...' : 'Stwórz Arkusz'}
          </button>
        </div>
      </div>
    </div>
  );
}
