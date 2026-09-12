import React, { useState } from 'react';
import { Target, CheckCircle2, Globe2, DollarSign, ShieldAlert, Sparkles, Plus, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { MyLeadOffer } from '../types';

const INITIAL_OFFERS: MyLeadOffer[] = [
  {
    id: 'ml-offer-1',
    name: 'Top Dating Smartlink CPL (PL)',
    category: 'dating',
    smartlinkUrl: 'https://smartlink-pl.mylead.global/tracker?sid=vpm_01',
    targetGeo: 'PL',
    payout: '$1.80 - $3.20 CPL',
    trafficRules: ['TikTok/Reels dozwolony', 'Wymagany pre-lander lub bufor (TG)', 'Brak spamu na forach'],
    isActive: true
  },
  {
    id: 'ml-offer-2',
    name: 'Casual Dating Exclusive Tier 1 (DE/AT)',
    category: 'adult_dating',
    smartlinkUrl: 'https://smartlink-de.mylead.global/tracker?sid=vpm_02',
    targetGeo: 'DE',
    payout: '€3.50 - €5.10 SOI',
    trafficRules: ['Wiek 18+', 'Tylko ruch organiczny z profili', 'Zakaz bezpośredniego linkowania na TikToku'],
    isActive: false
  }
];

export default function MyLeadEngine() {
  const [offers, setOffers] = useLocalStorage<MyLeadOffer[]>('vpm_mylead_offers', INITIAL_OFFERS);
  const [newOfferName, setNewOfferName] = useState('');
  const [newSmartlink, setNewSmartlink] = useState('');
  const [newGeo, setNewGeo] = useState('PL');
  const [newPayout, setNewPayout] = useState('$2.50 CPL');

  const activeOffer = offers.find(o => o.isActive) || offers[0];

  const setActiveOffer = (id: string) => {
    setOffers(offers.map(o => ({
      ...o,
      isActive: o.id === id
    })));
  };

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferName || !newSmartlink) return;

    const newOffer: MyLeadOffer = {
      id: `ml-offer-${Date.now()}`,
      name: newOfferName,
      category: 'dating',
      smartlinkUrl: newSmartlink,
      targetGeo: newGeo.toUpperCase(),
      payout: newPayout,
      trafficRules: ['Ruch Social Media', 'Zalecany Pre-lander'],
      isActive: offers.length === 0
    };

    setOffers([...offers, newOffer]);
    setNewOfferName('');
    setNewSmartlink('');
  };

  const handleDeleteOffer = (id: string) => {
    if (offers.length <= 1) return;
    const remaining = offers.filter(o => o.id !== id);
    if (activeOffer?.id === id && remaining.length > 0) {
      remaining[0].isActive = true;
    }
    setOffers(remaining);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
          <Target className="w-4 h-4" /> KROK 1 W LEJKU: SILNIK OFERT
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">MyLead Offer Engine</h2>
        <p className="mt-2 text-gray-600 text-sm">
          Zgodnie z audytem V2: oferta jest punktem wyjścia. Jedna aktywna oferta obsługuje wiele kreacji wideo z kolejki.
        </p>
      </div>

      {/* Aktywna Oferta - Główny Baner */}
      {activeOffer && (
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white p-6 rounded-2xl shadow-md border border-indigo-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> AKTYWNA OFERTA W LEJKU
              </div>
              <h3 className="text-xl font-bold">{activeOffer.name}</h3>
              <p className="text-indigo-200 text-sm mt-1 font-mono break-all">{activeOffer.smartlinkUrl}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-950/60 px-4 py-2 rounded-xl text-center border border-indigo-700/50">
                <div className="text-xs text-indigo-300">GEO</div>
                <div className="font-bold text-lg">{activeOffer.targetGeo}</div>
              </div>
              <div className="bg-indigo-950/60 px-4 py-2 rounded-xl text-center border border-indigo-700/50">
                <div className="text-xs text-indigo-300">Stawka</div>
                <div className="font-bold text-lg text-emerald-400">{activeOffer.payout}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-indigo-700/50 flex flex-wrap gap-2 text-xs text-indigo-200">
            <span className="font-medium text-white flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Zasady ruchu:
            </span>
            {activeOffer.trafficRules.map((rule, idx) => (
              <span key={idx} className="bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-700/40">
                {rule}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Lista Ofert i Przełącznik */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center justify-between">
          <span>Zdefiniowane Oferty MyLead</span>
          <span className="text-xs font-normal text-gray-500">Wybierz, którą ofertę ma zasilać dzisiejszy content</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map(offer => (
            <div
              key={offer.id}
              onClick={() => setActiveOffer(offer.id)}
              className={`cursor-pointer p-4 rounded-xl border transition-all text-left relative ${
                offer.isActive
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{offer.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1 font-medium text-gray-700">
                      <Globe2 className="w-3.5 h-3.5 text-indigo-600" /> {offer.targetGeo}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <DollarSign className="w-3.5 h-3.5" /> {offer.payout}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {offer.isActive ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-600 text-white">Aktywna</span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteOffer(offer.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Usuń ofertę"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dodaj Nową Ofertę */}
        <form onSubmit={handleAddOffer} className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Nazwa oferty (np. Dating PL CPL)"
            value={newOfferName}
            onChange={e => setNewOfferName(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
          <input
            type="url"
            placeholder="Smartlink URL (MyLead)"
            value={newSmartlink}
            onChange={e => setNewSmartlink(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="GEO (PL, DE)"
              value={newGeo}
              onChange={e => setNewGeo(e.target.value)}
              className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase"
            />
            <input
              type="text"
              placeholder="Stawka (np. $2.20)"
              value={newPayout}
              onChange={e => setNewPayout(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Dodaj Ofertę
          </button>
        </form>
      </div>
    </div>
  );
}
