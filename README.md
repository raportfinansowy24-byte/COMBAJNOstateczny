# 🎬 Video Processing & Monetization Studio

Kompleksowe narzędzie (Dashboard) stworzone z myślą o automatyzacji marketingu afiliacyjnego (CPA, Smartlink) oraz generowaniu ruchu z platform takich jak TikTok, Instagram Reels i YouTube Shorts. 

Aplikacja pozwala na omijanie algorytmów duplikacji treści poprzez masową unikalizację wideo (FFmpeg), a także oferuje gotowe skrypty do budowy wysoko konwertujących lejków sprzedażowych (Pre-landery, Boty Telegram) i integrację z narzędziami automatyzacji (Make.com / Zapier).

## ✨ Główne funkcjonalności

*   🎥 **Unikalizacja FFmpeg (Single & Batch)** - Generowanie komend do czyszczenia cyfrowego odcisku palca (hash). Obejmuje masową randomizację całych folderów (losowy crop, modyfikacje jasności/saturacji oraz prędkości wideo i audio), co czyni każdy plik unikalnym dla algorytmów.
*   📁 **Monitor Lokalnego Folderu** - Skrypt Python nasłuchujący zmian w folderze na Twoim PC/Chromebooku. Automatycznie przerabia wrzucone zdjęcia na krótkie wideo (Ken Burns zoom), unikalizuje gotowe materiały i wysyła sygnał Webhook do Make.com po ukończeniu renderu.
*   🤖 **Generator Bota Telegram** - Narzędzie do szybkiego tworzenia botów Telegram pełniących rolę "bezpiecznego bufora" między TikTokiem a ofertą CPA (omijanie banów za linki w bio).
*   🌐 **Szablony Pre-Landerów** - Generator lekkich stron HTML (Weryfikacja Wieku, Dating Quiz, Video Content Locker), które "rozgrzewają" ruch i drastycznie podnoszą współczynnik konwersji (CR) na Smartlinkach.
*   💾 **Local Storage Persistence** - Aplikacja automatycznie zapisuje Twoje tokeny, linki i adresy webhooków w pamięci przeglądarki. Po odświeżeniu strony nie tracisz swojej konfiguracji.
*   🚀 **Docker & Railway Ready** - Wbudowany `Dockerfile` i konfiguracja `railway.json` (Nginx). Projekt jest gotowy do wdrożenia jednym kliknięciem (One-Click Deploy) na platformie Railway.app.

## 🛠️ Stack Technologiczny

*   **Frontend:** React 19, TypeScript, Vite
*   **Styling:** Tailwind CSS v4, Lucide React (ikony)
*   **Architektura:** Single Page Application (SPA)
*   **Deployment:** Docker, Nginx, konfiguracja Railway
*   **Skrypty (Generowane):** Python 3 (Telebot, Watchdog), FFmpeg, Vanilla HTML/JS

## 🚀 Jak uruchomić projekt

### Opcja 1: Wdrożenie w chmurze (Railway.app) - *Zalecane*
Dzięki zawartym plikom konfiguracyjnym, wdrożenie jest w pełni zautomatyzowane:
1. Wrzuć kod na swoje repozytorium GitHub.
2. Zaloguj się do [Railway.app](https://railway.app/).
3. Wybierz `New Project` -> `Deploy from GitHub repo`.
4. Railway automatycznie wykryje `Dockerfile`, zbuduje zoptymalizowaną wersję aplikacji opartą na Nginx i udostępni link.

### Opcja 2: Uruchomienie lokalnie (Dev Mode)
1. Sklonuj repozytorium: `git clone <twoj-link>`
2. Zainstaluj zależności: `npm install`
3. Uruchom serwer deweloperski: `npm run dev`
4. Aplikacja będzie dostępna pod adresem `http://localhost:3000` (lub wskazanym przez Vite).

## 💻 Wymagania do skryptów lokalnych (Python)
Wygenerowane w aplikacji skrypty (np. Monitor Folderu, Bot Telegram) wymagają uruchomienia na lokalnym komputerze (Windows, macOS lub Linux/Chromebook Crostini).
Wymagania:
*   Zainstalowany **Python 3.x**
*   **FFmpeg** dodany do zmiennych środowiskowych (`PATH`)
*   Biblioteki Python: `pip install watchdog requests pyTelegramBotAPI`

---
*Disclaimer: Aplikacja została stworzona do celów automatyzacji własnych procesów marketingowych i zarządzania bazą wideo. Użytkownik ponosi pełną odpowiedzialność za zgodność generowanych działań z regulaminami platform społecznościowych (TikTok, Meta, Google) oraz sieci afiliacyjnych.*
