/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import ClientSite from './components/ClientSite';
import AdminDashboard from './components/AdminDashboard';
import { Booking, StudioStats, PortfolioItem } from './types';
import { PORTFOLIO_ITEMS } from './data';
import { subscribeToPortfolio, seedPortfolioIfEmpty } from './lib/portfolioService';
import { Shield, Smartphone, ArrowRight, Award } from 'lucide-react';

// Seed Initial Data to deliver an elite populated sandbox out-of-the-box
const SEED_BOOKINGS: Booking[] = [
  {
    id: 'book-1',
    name: 'Guilherme Santos',
    whatsapp: '(66) 99231-6060',
    date: '2026-06-21',
    time: '14:00',
    style: 'Guerreira Indígena & Lobo',
    description: 'Desejo fazer uma composição grande pegando do ombro ao cotovelo. Com a guerreira com cocar nativo, olhar forte, e logo abaixo o lobo uivante na lua cheia.',
    status: 'pendente',
    value: 1800,
    createdAt: new Date().toISOString()
  },
  {
    id: 'book-2',
    name: 'Mariana Alencar',
    whatsapp: '(66) 99691-7408',
    date: '2026-06-18',
    time: '11:00',
    style: 'Crisântemo Imperial Blackwork',
    description: 'Tatuagem no estilo fineline ultra fino. Quero duas flores grandes de crisântemo com sombreado whip-shading no antebraço combinando com uma joia real de piercing separada.',
    status: 'confirmado',
    value: 950,
    createdAt: new Date().toISOString()
  },
  {
    id: 'book-3',
    name: 'Lucas Silveira',
    whatsapp: '(66) 99124-7788',
    date: '2026-06-25',
    time: '16:00',
    style: 'O Vira-lata Cangaceiro',
    description: 'Homenagem autoral para a panturrilha representando meu cão vira-lata de gibão de couro e chapéu de cangaço. Um fuzil atravessador nas costas para dar a mística.',
    status: 'confirmado',
    value: 1200,
    createdAt: new Date().toISOString()
  }
];

const SEED_BLOCKED_DATES = ['2026-06-15', '2026-06-20', '2026-06-26'];

const DEFAULT_TIME_SLOTS = ['09:00', '11:00', '14:00', '16:00', '19:00'];

const SEED_STATS: StudioStats = {
  monthlyGoal: 50000,
  baseTattooPrice: 1000
};

const SEED_MANUAL_REVENUE = 2850; // Manual offline product sales

import { InventoryItem } from './types';

const SEED_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', name: 'Agulhas RL 03', category: 'Insumo', quantity: 15, minThreshold: 10, unit: 'Caixas' },
  { id: 'inv-2', name: 'Tintas Dynamic Black', category: 'Insumo', quantity: 2, minThreshold: 3, unit: 'Frascos' },
  { id: 'inv-3', name: 'Plástico Filme', category: 'Limpeza', quantity: 1, minThreshold: 3, unit: 'Rolos' },
  { id: 'inv-4', name: 'Luvas Nitrílicas Pretas', category: 'Insumo', quantity: 8, minThreshold: 5, unit: 'Caixas' }
];

export default function App() {
  const [viewMode, setViewMode] = useState<'client' | 'ceo'>('client');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [stats, setStats] = useState<StudioStats>({ monthlyGoal: 50000, baseTattooPrice: 1000 });
  const [manualRevenue, setManualRevenue] = useState<number>(0);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(PORTFOLIO_ITEMS);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<Record<string, string[]>>({});

  // Load from LocalStorage or seed if empty
  useEffect(() => {
    const localBookings = localStorage.getItem('rocha_bookings');
    const localBlocked = localStorage.getItem('rocha_blocked_dates');
    const localStats = localStorage.getItem('rocha_stats');
    const localManual = localStorage.getItem('rocha_manual_revenue');
    const localInventory = localStorage.getItem('rocha_inventory');
    const localPortfolio = localStorage.getItem('rocha_portfolio');
    const localTimeSlots = localStorage.getItem('rocha_time_slots');
    const localBlockedSlots = localStorage.getItem('rocha_blocked_slots');

    if (localBookings) {
      setBookings(JSON.parse(localBookings));
    } else {
      setBookings(SEED_BOOKINGS);
      localStorage.setItem('rocha_bookings', JSON.stringify(SEED_BOOKINGS));
    }

    if (localBlocked) {
      setBlockedDates(JSON.parse(localBlocked));
    } else {
      setBlockedDates(SEED_BLOCKED_DATES);
      localStorage.setItem('rocha_blocked_dates', JSON.stringify(SEED_BLOCKED_DATES));
    }

    if (localStats) {
      setStats(JSON.parse(localStats));
    } else {
      setStats(SEED_STATS);
      localStorage.setItem('rocha_stats', JSON.stringify(SEED_STATS));
    }

    if (localManual) {
      setManualRevenue(Number(localManual));
    } else {
      setManualRevenue(SEED_MANUAL_REVENUE);
      localStorage.setItem('rocha_manual_revenue', String(SEED_MANUAL_REVENUE));
    }

    if (localInventory) {
      setInventory(JSON.parse(localInventory));
    } else {
      setInventory(SEED_INVENTORY);
      localStorage.setItem('rocha_inventory', JSON.stringify(SEED_INVENTORY));
    }

    // Seed and subscribe to Portfolio from Firebase instead of local storage
    seedPortfolioIfEmpty();
    const unsubscribePortfolio = subscribeToPortfolio((items) => {
      if (items && items.length > 0) {
        setPortfolioItems(items);
      }
    });

    if (localTimeSlots) {
      setTimeSlots(JSON.parse(localTimeSlots));
    } else {
      setTimeSlots(DEFAULT_TIME_SLOTS);
      localStorage.setItem('rocha_time_slots', JSON.stringify(DEFAULT_TIME_SLOTS));
    }

    if (localBlockedSlots) {
      setBlockedSlots(JSON.parse(localBlockedSlots));
    } else {
      setBlockedSlots({});
      localStorage.setItem('rocha_blocked_slots', JSON.stringify({}));
    }

    return () => {
      unsubscribePortfolio();
    };
  }, []);

  // Save updates in LocalStorage on state modifications (Portfolio uses Firebase directly)
  const updateLocalStoragePortfolio = (newPortfolio: PortfolioItem[]) => {
    // Obsolete - Admin handles this via service methods
  };

  const updateLocalStorageBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('rocha_bookings', JSON.stringify(newBookings));
  };

  const updateLocalStorageBlocked = (newBlocked: string[]) => {
    setBlockedDates(newBlocked);
    localStorage.setItem('rocha_blocked_dates', JSON.stringify(newBlocked));
  };

  const updateLocalStorageStats = (newStats: StudioStats) => {
    setStats(newStats);
    localStorage.setItem('rocha_stats', JSON.stringify(newStats));
  };

  const updateLocalStorageInventory = (newInventory: InventoryItem[]) => {
    setInventory(newInventory);
    localStorage.setItem('rocha_inventory', JSON.stringify(newInventory));
  };

  const updateLocalStorageSlots = (newSlots: string[]) => {
    setTimeSlots(newSlots);
    localStorage.setItem('rocha_time_slots', JSON.stringify(newSlots));
  };

  const updateLocalStorageBlockedSlots = (newBlockedSlots: Record<string, string[]>) => {
    setBlockedSlots(newBlockedSlots);
    localStorage.setItem('rocha_blocked_slots', JSON.stringify(newBlockedSlots));
  };

  // Add customer booking submit handler from client website
  const handleSubmitBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: 'book-' + Date.now(),
      status: 'pendente',
      createdAt: new Date().toISOString()
    };

    const nextBookings = [newBooking, ...bookings];
    updateLocalStorageBookings(nextBookings);
  };

  // Admin Toggle booking status
  const handleUpdateBookingStatus = (id: string, status: 'confirmado' | 'cancelado' | 'pendente' | 'concluido') => {
    const nextBookings = bookings.map(b => b.id === id ? { ...b, status } : b);
    updateLocalStorageBookings(nextBookings);
  };

  // Admin delete booking
  const handleDeleteBooking = (id: string) => {
    if (confirm('Tem certeza de que deseja expurgar permanentemente este agendamento do livro histórico?')) {
      const nextBookings = bookings.filter(b => b.id !== id);
      updateLocalStorageBookings(nextBookings);
    }
  };

  // Admin toggle date block
  const handleToggleDateBlock = (date: string) => {
    let nextBlocked: string[];
    if (blockedDates.includes(date)) {
      nextBlocked = blockedDates.filter(d => d !== date);
    } else {
      nextBlocked = [...blockedDates, date];
    }
    updateLocalStorageBlocked(nextBlocked);
  };

  // Add manually logged in offline balance counter
  const handleAddManualRevenue = (value: number) => {
    const val = manualRevenue + value;
    setManualRevenue(val);
    localStorage.setItem('rocha_manual_revenue', String(val));
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-black">
      
      {/* GLOBAL LUXURY APP BAR - Switching between Portico (Customer) and Throne (CEO) */}
      <div className="bg-[#0b0b0b] border-b border-gold-base/35 py-3.5 px-6 sticky top-0 z-40 shadow-[0_4px_20px_rgba(8,8,8,0.8)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Logo Brand left */}
          <div className="flex items-center gap-3">
            <span className="text-xl text-gold-light font-serif">🔱</span>
            <div>
              <div className="font-display text-sm tracking-[4px] text-white font-bold">FAMÍLIA ROCHA</div>
              <div className="text-[9px] text-gold-base uppercase font-bold tracking-widest leading-none mt-0.5">Estúdio de Qualidade • Desde 2018</div>
            </div>
          </div>

          {/* Quality Switch Buttons */}
          <div className="flex bg-[#050505] p-1.5 rounded-xl border border-gold-dark/20 text-xs gap-1.5">
            <button
              onClick={() => setViewMode('client')}
              className={`py-2 px-5 rounded-lg font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${viewMode === 'client' ? 'bg-gradient-to-r from-gold-dark to-gold-base text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              <Smartphone className="w-3.5 h-3.5 shrink-0" />
              <span>Área do Cliente (Site)</span>
            </button>

            <button
              onClick={() => setViewMode('ceo')}
              className={`py-2 px-5 rounded-lg font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${viewMode === 'ceo' ? 'bg-gradient-to-r from-gold-dark to-gold-base text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>Painel do Estúdio (Dashboard)</span>
            </button>
          </div>

          {/* Quick Info text */}
          <div className="hidden lg:flex items-center gap-1 text-[10px] text-gold-light uppercase tracking-widest font-bold">
            <Award className="w-4 h-4" />
            <span>Nota 5.0 no Google</span>
          </div>

        </div>
      </div>

      {/* RENDER THE RELEVANT MODULE */}
      <div className="flex-1">
        {viewMode === 'client' ? (
          <ClientSite 
            blockedDates={blockedDates} 
            bookings={bookings} 
            portfolioItems={portfolioItems}
            timeSlots={timeSlots}
            blockedSlots={blockedSlots}
            onSubmitBooking={handleSubmitBooking} 
          />
        ) : (
          <AdminDashboard 
            bookings={bookings} 
            blockedDates={blockedDates} 
            stats={stats} 
            inventory={inventory}
            portfolioItems={portfolioItems}
            timeSlots={timeSlots}
            blockedSlots={blockedSlots}
            onUpdateBookingStatus={handleUpdateBookingStatus} 
            onDeleteBooking={handleDeleteBooking} 
            onToggleDateBlock={handleToggleDateBlock} 
            onUpdateStats={updateLocalStorageStats}
            onAddManualRevenue={handleAddManualRevenue}
            onUpdateInventory={updateLocalStorageInventory}
            onUpdatePortfolio={updateLocalStoragePortfolio}
            onUpdateSlots={updateLocalStorageSlots}
            onUpdateBlockedSlots={updateLocalStorageBlockedSlots}
            manualRevenue={manualRevenue}
          />
        )}
      </div>

    </div>
  );
}
