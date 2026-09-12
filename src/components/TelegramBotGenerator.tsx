import React, { useState } from 'react';
import { Copy, CheckCircle, Send } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function TelegramBotGenerator() {
  const [copied, setCopied] = useState(false);
  const [botToken, setBotToken] = useLocalStorage('vp_botToken', 'TWÓJ_TOKEN_Z_BOTFATHER');
  const [smartlink, setSmartlink] = useLocalStorage('vp_tg_smartlink', 'https://twojsmartlink.com');
  const [botMessage, setBotMessage] = useLocalStorage('vp_tg_msg', 'Hej! 🥰\\nAby zobaczyć moje prywatne materiały, musisz założyć darmowe konto tutaj:');

  const pythonCode = `import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton
import time

# Konfiguracja
BOT_TOKEN = "${botToken}"
SMARTLINK = "${smartlink}"
MESSAGE_TEXT = """${botMessage}"""

bot = telebot.TeleBot(BOT_TOKEN)

def get_keyboard():
    markup = InlineKeyboardMarkup()
    markup.add(InlineKeyboardButton("👉 Zobacz prywatne wideo 🔞", url=SMARTLINK))
    return markup

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    print(f"Nowy użytkownik: {message.from_user.id}")
    bot.reply_to(
        message, 
        MESSAGE_TEXT,
        reply_markup=get_keyboard()
    )

@bot.message_handler(func=lambda message: True)
def echo_all(message):
    # Odpowiada tym samym na każdą inną wiadomość, aby przypomnieć o linku
    bot.reply_to(
        message,
        "Aby przejść dalej, użyj przycisku poniżej! 👇",
        reply_markup=get_keyboard()
    )

if __name__ == "__main__":
    print("[*] Bot Telegram uruchomiony...")
    while True:
        try:
            bot.polling(none_stop=True)
        except Exception as e:
            print(f"Błąd bota: {e}")
            time.sleep(15)
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Generator Bota Telegram</h2>
        <p className="mt-2 text-gray-600">
          Wygeneruj skrypt automatycznego bota. Kieruj ruch z TikToka/Reels najpierw na Telegram, a bot wyśle im wiadomość ze Smartlinkiem. To najbezpieczniejszy lejek!
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        <strong>Wymagania lokalne:</strong> Zainstaluj bibliotekę <code className="bg-yellow-100 px-1 rounded">pip install pyTelegramBotAPI</code>. Token zdobędziesz od @BotFather na Telegramie.
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Token Bota (od @BotFather)</label>
            <input 
              type="text" 
              value={botToken}
              onChange={e => setBotToken(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Docelowy Smartlink (URL)</label>
            <input 
              type="text" 
              value={smartlink}
              onChange={e => setSmartlink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Wiadomość powitalna</label>
            <textarea 
              rows={3}
              value={botMessage}
              onChange={e => setBotMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Send className="w-4 h-4" /> bot_telegram.py
            </h3>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Skopiowano' : 'Kopiuj Kod'}
            </button>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-[400px]">
            <code className="text-sm text-green-400 whitespace-pre">
              {pythonCode}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
