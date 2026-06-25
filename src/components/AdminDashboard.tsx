/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { savePortfolioItem, deletePortfolioItem } from '../lib/portfolioService';
import { Booking, BlockedDay, StudioStats, InventoryItem, PortfolioItem } from '../types';
import AdminKanbanView from './AdminKanbanView';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as ChartTooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Lock, 
  Unlock, 
  MessageSquare, 
  Plus, 
  Target,
  Home,
  Sliders,
  Sparkles,
  RefreshCw,
  Award,
  BookOpen,
  FileText,
  AlertTriangle,
  Package,
  Image,
  Upload,
  User,
  Edit
} from 'lucide-react';

interface AdminDashboardProps {
  bookings: Booking[];
  blockedDates: string[];
  stats: StudioStats;
  inventory: InventoryItem[];
  portfolioItems: PortfolioItem[];
  timeSlots: string[];
  blockedSlots: Record<string, string[]>;
  onUpdateBookingStatus: (id: string, status: 'confirmado' | 'cancelado' | 'pendente' | 'concluido') => void;
  onDeleteBooking: (id: string) => void;
  onToggleDateBlock: (date: string) => void;
  onUpdateStats: (stats: StudioStats) => void;
  onUpdateInventory: (inventory: InventoryItem[]) => void;
  onUpdatePortfolio: (portfolio: PortfolioItem[]) => void;
  onUpdateSlots: (slots: string[]) => void;
  onUpdateBlockedSlots: (blockedSlots: Record<string, string[]>) => void;
  onAddManualRevenue: (value: number) => void;
  manualRevenue: number;
}

export default function AdminDashboard({
  bookings,
  blockedDates,
  stats,
  inventory,
  portfolioItems,
  timeSlots = [],
  blockedSlots = {},
  onUpdateBookingStatus,
  onDeleteBooking,
  onToggleDateBlock,
  onUpdateStats,
  onUpdateInventory,
  onUpdatePortfolio,
  onUpdateSlots,
  onUpdateBlockedSlots,
  onAddManualRevenue,
  manualRevenue
}: AdminDashboardProps) {
  
  const [activeTab, setActiveTab] = useState<'geral' | 'agenda' | 'financeiro' | 'estoque' | 'galeria'>('geral');
  const [dashboardFilter, setDashboardFilter] = useState<'tattoo' | 'piercing' | 'both'>('both');

  const isPiercingBooking = (b: Booking): boolean => {
    if (!b.style) return false;
    const styleLower = b.style.toLowerCase();
    const descLower = (b.description || '').toLowerCase();
    return (
      b.tattooType === 'piercing' ||
      styleLower.includes('piercing') ||
      styleLower.includes('perfuração') ||
      styleLower.includes('projeto auricular') ||
      descLower.includes('piercing') ||
      descLower.includes('perfuração')
    );
  };

  const filteredBookings = useMemo(() => {
    if (dashboardFilter === 'tattoo') {
      return bookings.filter(b => !isPiercingBooking(b));
    }
    if (dashboardFilter === 'piercing') {
      return bookings.filter(b => isPiercingBooking(b));
    }
    return bookings;
  }, [bookings, dashboardFilter]);

  const [goalInput, setGoalInput] = useState<string>(stats.monthlyGoal.toString());
  const [manualPriceInput, setManualPriceInput] = useState<string>('');
  const [manualRevenueLabel, setManualRevenueLabel] = useState<string>('Venda de Joia de Titânio');

  // AGENDA TIME SLOTS STATES
  const [selectedAdminDate, setSelectedAdminDate] = useState<string>('2026-06-18');
  const [customSlotInputs, setCustomSlotInputs] = useState<string[]>([]);
  const [isEditingSlots, setIsEditingSlots] = useState<boolean>(false);

  const startEditingSlots = () => {
    setCustomSlotInputs([...timeSlots]);
    setIsEditingSlots(true);
  };

  const handleSaveSlots = () => {
    // Validate that slots are non-empty and formatted
    const cleaned = customSlotInputs.map(s => s.trim()).filter(Boolean);
    if (cleaned.length !== 5) {
      alert('Por favor, configure exatamente 5 horários diferentes para o Cristiano Rocha gerenciar.');
      return;
    }
    onUpdateSlots(cleaned);
    setIsEditingSlots(false);
  };

  const handleToggleSlotBlock = (date: string, slot: string) => {
    const currentBlocked = blockedSlots[date] || [];
    let updated: string[];
    if (currentBlocked.includes(slot)) {
      updated = currentBlocked.filter(s => s !== slot);
    } else {
      updated = [...currentBlocked, slot];
    }
    
    onUpdateBlockedSlots({
      ...blockedSlots,
      [date]: updated
    });
  };

  // GALLERY MANAGEMENT STATES & CRUD
  // Form para adicionar nova obra
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'autoral' | 'realismo' | 'fineline' | 'outro'>('autoral');
  const [newDescription, setNewDescription] = useState('');
  const [newTimeSpent, setNewTimeSpent] = useState('');
  const [newArtist, setNewArtist] = useState('Cristiano Rocha');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newBodyPart, setNewBodyPart] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [addError, setAddError] = useState('');

  // Estado de imagem arrastada/selecionada
  const [isDragOver, setIsDragOver] = useState(false);

  // Estado para edição
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<'autoral' | 'realismo' | 'fineline' | 'outro'>('autoral');
  const [editDescription, setEditDescription] = useState('');
  const [editTimeSpent, setEditTimeSpent] = useState('');
  const [editArtist, setEditArtist] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editBodyPart, setEditBodyPart] = useState('');

  const categoryLabelsMap: Record<string, string> = {
    autoral: 'Projetos Autorais',
    realismo: 'Blackwork & Realismo',
    fineline: 'Piercing & Fineline',
    outro: 'O Estúdio'
  };

  // Carrega modal de edição
  const handleStartEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditDescription(item.description);
    setEditTimeSpent(item.timeSpent);
    setEditArtist(item.artist);
    setEditImageUrl(item.imageUrl);
    setEditBodyPart(item.bodyPart || '');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (isEdit) {
            setEditImageUrl(reader.result);
          } else {
            setNewImageUrl(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent, isEdit: boolean) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (isEdit) {
            setEditImageUrl(reader.result);
          } else {
            setNewImageUrl(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPortfolioItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newImageUrl) {
      setAddError('Por favor, preencha o título, a descrição e suba uma imagem.');
      return;
    }

    const newItem: PortfolioItem = {
      id: 'gallery-' + Date.now(),
      title: newTitle,
      category: newCategory,
      categoryLabel: categoryLabelsMap[newCategory] || 'Outro',
      description: newDescription,
      timeSpent: newTimeSpent || '4 Horas',
      artist: newArtist || 'Cristiano Rocha',
      imageUrl: newImageUrl,
      bodyPart: newBodyPart || undefined
    };

    savePortfolioItem(newItem);
    
    // Reset fields
    setNewTitle('');
    setNewCategory('autoral');
    setNewDescription('');
    setNewTimeSpent('');
    setNewArtist('Cristiano Rocha');
    setNewImageUrl('');
    setNewBodyPart('');
    setAddSuccess('Nova obra adicionada com absoluto sucesso à galeria!');
    setAddError('');

    setTimeout(() => {
      setAddSuccess('');
    }, 4000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editTitle || !editDescription || !editImageUrl) {
      alert('Preencha os campos obrigatórios!');
      return;
    }

    const updatedItem = {
      ...editingItem,
      title: editTitle,
      category: editCategory,
      categoryLabel: categoryLabelsMap[editCategory] || 'Outro',
      description: editDescription,
      timeSpent: editTimeSpent,
      artist: editArtist,
      imageUrl: editImageUrl,
      bodyPart: editBodyPart || undefined
    };

    savePortfolioItem(updatedItem);
    setEditingItem(null);
  };

  const handleDeletePortfolioItem = (id: string) => {
    if (confirm('Tem certeza absoluta de que deseja banir esta obra de arte da galeria pública do site?')) {
      deletePortfolioItem(id);
    }
  };

  // Verifica Estoque Crítico
  const hasCriticalStock = useMemo(() => {
    return inventory.some(item => item.quantity <= item.minThreshold);
  }, [inventory]);

  // Computed Values
  const confirmedBookingsCount = useMemo(() => {
    return filteredBookings.filter(b => b.status === 'confirmado').length;
  }, [filteredBookings]);

  const pendingBookingsCount = useMemo(() => {
    return filteredBookings.filter(b => b.status === 'pendente').length;
  }, [filteredBookings]);

  const bookingsRevenue = useMemo(() => {
    // Each confirmed booking delivers value (e.g., baseTattooPrice plus computed modifiers)
    return filteredBookings
      .filter(b => b.status === 'confirmado')
      .reduce((acc, curr) => acc + curr.value, 0);
  }, [filteredBookings]);

  const totalMonthlyBilling = useMemo(() => {
    // Adjust manual jewelry revenue (only added if not viewing tattoo only)
    const activeManual = dashboardFilter === 'tattoo' ? 0 : manualRevenue;
    return bookingsRevenue + activeManual;
  }, [bookingsRevenue, manualRevenue, dashboardFilter]);

  const progressPercentage = useMemo(() => {
    const goal = stats.monthlyGoal || 50000;
    const percentage = (totalMonthlyBilling / goal) * 100;
    return Math.min(Math.round(percentage), 100);
  }, [totalMonthlyBilling, stats.monthlyGoal]);

  const styleAnalytics = useMemo(() => {
    const confirmed = filteredBookings.filter(b => b.status === 'confirmado' || b.status === 'concluido');
    const total = confirmed.length;
    if (total === 0) return [];
    
    const grouped = confirmed.reduce((acc, curr) => {
      acc[curr.style] = (acc[curr.style] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([style, count]) => {
        const numCount = Number(count);
        return { style, count: numCount, percentage: Math.round((numCount / total) * 100) };
      })
      .sort((a, b) => b.count - a.count);
  }, [filteredBookings]);

  const styleFinanceData = useMemo(() => {
    const confirmed = filteredBookings.filter(b => b.status === 'confirmado' || b.status === 'concluido');
    const grouped = confirmed.reduce((acc, curr) => {
      acc[curr.style] = (acc[curr.style] || 0) + curr.value;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped).map(([name, value]) => {
      const numVal = Number(value);
      return {
        name: name.length > 15 ? name.substring(0, 13) + '...' : name,
        value: numVal,
        fullName: name
      };
    }).sort((a, b) => b.value - a.value);
  }, [filteredBookings]);

  const pieChartData = useMemo(() => {
    return styleAnalytics.map(item => ({
      name: item.style,
      value: item.count,
      percentage: item.percentage
    }));
  }, [styleAnalytics]);

  // Calendar render setup for June 2026: 30 days
  const juneDays = useMemo(() => {
    const days = [];
    const year = 2026;
    const skipOffset = 1; // Mon is 1, so 1 cell skip if grid starts with Sun
    
    for (let slot = 0; slot < skipOffset; slot++) {
      days.push({ empty: true, key: `empty-${slot}` });
    }

    for (let d = 1; d <= 30; d++) {
      const dayStr = `${year}-06-${d.toString().padStart(2, '0')}`;
      const isPast = d < 14; // Current Date Is June 14, 2026
      const isBlocked = blockedDates.includes(dayStr);
      const isAlreadyBooked = filteredBookings.some(b => b.date === dayStr && b.status === 'confirmado');
      
      days.push({
        day: d,
        dateString: dayStr,
        empty: false,
        isPast,
        isBlocked,
        isBooked: isAlreadyBooked,
        key: dayStr
      });
    }
    return days;
  }, [blockedDates, filteredBookings]);

  // Handle WhatsApp API redirect with pre-built personalized message templates
  const openWhatsAppApproval = (booking: Booking) => {
    // Clear phone characters to keep pure numbers
    const phoneClean = booking.whatsapp.replace(/\D/g, '');
    const phoneWithCountry = phoneClean.startsWith('55') ? phoneClean : `55${phoneClean}`;
    
    const formattedDate = `${booking.date.split('-')[2]}/${booking.date.split('-')[1]}/${booking.date.split('-')[0]}`;
    
    let message = '';
    if (isPiercingBooking(booking)) {
      message = `Olá, ${booking.name}! Aqui é a Crys Piercer, do Família Rocha Studio. Maravilhoso receber a sua proposta de perfuração e joalheria! 💎\n\nAnalisei a sua solicitação de agendamento para o dia ${formattedDate} no procedimento de "${booking.style}". Será uma perfuração incrível e totalmente segura! Já reservei pré-agendadamente o dia no nosso calendário de elite.\n\nPodemos confirmar o seu horário e selecionar a sua joalheria nobre de titânio ou ouro 18k? Me avise se este horário lhe atende perfeitamente. Beijos, Crys.`;
    } else {
      message = `Olá, ${booking.name}! Aqui é o Cristiano Rocha, do Família Rocha Studio. Magnífico receber o seu briefing! 🔱\n\nAnalisei a sua proposta para o dia ${formattedDate} sobre o projeto autoral "${booking.style}". É um trabalho fantástico! Já reservei pré-agendadamente o dia no nosso calendário de elite.\n\nPodemos marcar a nossa sessão de design fino da arte corporal? Me avise se este horário lhe atende idealmente. Forte abraço, Cristiano Rocha.`;
    }

    const encodedText = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?phone=${phoneWithCountry}&text=${encodedText}`;
    window.open(url, '_blank', 'noreferrer');
  };

  // Adjust financial goal
  const handleUpdateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = parseFloat(goalInput);
    if (!isNaN(cleanNum) && cleanNum > 0) {
      onUpdateStats({
        ...stats,
        monthlyGoal: cleanNum
      });
      alert('Meta Financeira Atualizada na Central do CEO!');
    }
  };

  const handleManualRevenueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(manualPriceInput);
    if (!isNaN(amt) && amt > 0) {
      onAddManualRevenue(amt);
      setManualPriceInput('');
      alert(`Receita offline registrada: R$ ${amt.toFixed(2)} (${manualRevenueLabel})`);
    }
  };

  return (
    <div className="min-h-screen bg-bg-black flex flex-col lg:flex-row text-gray-300 font-sans selection:bg-gold-base selection:text-black">
      
      {/* SIDEBAR NAVIGATION - DESKTOP ONLY */}
      <aside className="hidden lg:flex w-[270px] bg-[#0f0f0f] border-r border-gold-base/30 flex-col justify-between shrink-0 sticky top-0 h-screen z-20">
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-gold-dark/20 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border border-gold-base/50 p-0.5 flex items-center justify-center bg-black shadow-lg mb-3">
              <div className="w-full h-full rounded-full border border-dashed border-gold-base/30 flex items-center justify-center">
                <span className="font-display text-[10px] font-bold text-gold-light tracking-wider">FR</span>
              </div>
            </div>
            <span className="font-display text-xs tracking-[4px] text-gold-base uppercase">ROCHA CENTRAL</span>
            <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-1 font-mono">Trono de Comando v1.0</span>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1 mt-6">
            <button
              onClick={() => setActiveTab('geral')}
              className={`w-full py-3.5 px-4 rounded-lg flex items-center gap-3.5 text-xs uppercase tracking-wider font-extrabold transition-all duration-300 ${activeTab === 'geral' ? 'bg-gold-dark/15 text-gold-light border-l-2 border-gold-base' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Home className="w-4 h-4 text-gold-base shrink-0" />
              <span>🏠 Visão Geral</span>
            </button>

            <button
              onClick={() => setActiveTab('agenda')}
              className={`w-full py-3.5 px-4 rounded-lg flex items-center gap-3.5 text-xs uppercase tracking-wider font-extrabold transition-all duration-300 ${activeTab === 'agenda' ? 'bg-gold-dark/15 text-gold-light border-l-2 border-gold-base' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Calendar className="w-4 h-4 text-gold-base shrink-0" />
              <span>📅 Lista de Agendamentos</span>
            </button>

            <button
              onClick={() => setActiveTab('financeiro')}
              className={`w-full py-3.5 px-4 rounded-lg flex items-center gap-3.5 text-xs uppercase tracking-wider font-extrabold transition-all duration-300 ${activeTab === 'financeiro' ? 'bg-gold-dark/15 text-gold-light border-l-2 border-gold-base' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <TrendingUp className="w-4 h-4 text-gold-base shrink-0" />
              <span>📊 Relatórios &amp; Insights</span>
            </button>

            <button
              onClick={() => setActiveTab('estoque')}
              className={`w-full py-3.5 px-4 rounded-lg flex items-center gap-3.5 text-xs uppercase tracking-wider font-extrabold transition-all duration-300 ${activeTab === 'estoque' ? 'bg-red-500/10 text-red-400 border-l-2 border-red-500' : 'text-gray-400 hover:text-white hover:bg-white/5'} ${hasCriticalStock && activeTab !== 'estoque' ? 'animate-pulse text-red-500' : ''}`}
            >
              <Package className={`w-4 h-4 shrink-0 ${activeTab === 'estoque' || hasCriticalStock ? 'text-red-500' : 'text-gray-500'}`} />
              <span>📦 Estoque Crítico</span>
            </button>

            <button
              onClick={() => setActiveTab('galeria')}
              className={`w-full py-3.5 px-4 rounded-lg flex items-center gap-3.5 text-xs uppercase tracking-wider font-extrabold transition-all duration-300 ${activeTab === 'galeria' ? 'bg-gold-dark/15 text-gold-light border-l-2 border-gold-base' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Image className="w-4 h-4 text-gold-base shrink-0" />
              <span>🖼️ Galeria Rocha</span>
            </button>
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-6 border-t border-gold-dark/10 bg-black/40 text-center">
          <p className="text-[10px] text-[#a47c4c] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Família Rocha Studio
          </p>
          <p className="text-[8px] text-gray-600 mt-1 uppercase font-mono">Controle Absoluto desde 2018</p>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gold-base/30 z-50 flex justify-around items-center p-2 pb-4 shadow-[0_-4px_20px_rgba(8,8,8,0.8)] backdrop-blur-md">
        <button onClick={() => setActiveTab('geral')} className={`flex flex-col items-center justify-center w-full py-2 gap-1 transition-colors ${activeTab === 'geral' ? 'text-gold-light' : 'text-gray-500'}`}>
          <Home className={`w-5 h-5 ${activeTab === 'geral' ? 'drop-shadow-[0_0_8px_rgba(197,155,103,0.8)]' : ''}`} />
          <span className="text-[9px] uppercase font-bold tracking-widest">Geral</span>
        </button>
        <button onClick={() => setActiveTab('agenda')} className={`flex flex-col items-center justify-center w-full py-2 gap-1 transition-colors ${activeTab === 'agenda' ? 'text-gold-light' : 'text-gray-500'}`}>
          <Calendar className={`w-5 h-5 ${activeTab === 'agenda' ? 'drop-shadow-[0_0_8px_rgba(197,155,103,0.8)]' : ''}`} />
          <span className="text-[9px] uppercase font-bold tracking-widest">Agenda</span>
        </button>
        <button onClick={() => setActiveTab('financeiro')} className={`flex flex-col items-center justify-center w-full py-2 gap-1 transition-colors ${activeTab === 'financeiro' ? 'text-gold-light' : 'text-gray-500'}`}>
          <TrendingUp className={`w-5 h-5 ${activeTab === 'financeiro' ? 'drop-shadow-[0_0_8px_rgba(197,155,103,0.8)]' : ''}`} />
          <span className="text-[9px] uppercase font-bold tracking-widest">Finanças</span>
        </button>
        <button onClick={() => setActiveTab('estoque')} className={`flex flex-col items-center justify-center w-full py-2 gap-1 transition-colors ${activeTab === 'estoque' ? 'text-red-400' : 'text-gray-500'} ${hasCriticalStock && activeTab !== 'estoque' ? 'animate-pulse text-red-500/70' : ''}`}>
          <Package className={`w-5 h-5 ${activeTab === 'estoque' ? 'drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : ''}`} />
          <span className="text-[9px] uppercase font-bold tracking-widest">Estoque</span>
        </button>
        <button onClick={() => setActiveTab('galeria')} className={`flex flex-col items-center justify-center w-full py-2 gap-1 transition-colors ${activeTab === 'galeria' ? 'text-gold-light' : 'text-gray-500'}`}>
          <Image className={`w-5 h-5 ${activeTab === 'galeria' ? 'drop-shadow-[0_0_8px_rgba(197,155,103,0.8)]' : ''}`} />
          <span className="text-[9px] uppercase font-bold tracking-widest">Galeria</span>
        </button>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="flex-1 overflow-y-auto h-screen p-4 pb-28 lg:p-8 lg:pb-8 xl:p-12 relative">
        
        {/* SOBERANO DASHBOARD SELECTOR - THREE MAJESTIC BUTTONS */}
        <div className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-[#0d0c0a] via-[#050505] to-[#0d0c0a] border border-gold-dark/30 shadow-[0_0_30px_rgba(197,155,103,0.15)] animate-fade-in">
          <div className="text-center mb-4">
            <span className="text-[9px] uppercase tracking-[5px] text-gold-base font-bold font-sans">Seletor de Gestão Unificada</span>
            <h2 className="font-serif text-sm font-semibold text-white mt-1">Escolha a Esfera de Controle do Estúdio</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Button 1: Tatuagem */}
            <button
              type="button"
              onClick={() => setDashboardFilter('tattoo')}
              className={`relative overflow-hidden group py-4 px-5 rounded-xl border transition-all duration-500 text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                dashboardFilter === 'tattoo'
                  ? 'bg-gradient-to-b from-[#1c1917]/90 to-[#0c0a09]/90 border-gold-base shadow-[0_0_15px_rgba(197,155,103,0.25)]'
                  : 'bg-black/60 border-gold-dark/15 opacity-60 hover:opacity-100 hover:border-gold-base/50'
              }`}
            >
              <div className="absolute inset-0 bg-gold-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="text-xl">🔱</span>
              <span className="font-serif text-xs sm:text-sm font-extrabold tracking-[1.5px] text-white uppercase leading-none">
                Painel de Tatuagem
              </span>
              <span className="text-[8px] text-gold-base uppercase tracking-widest font-bold font-sans">
                Cristiano Rocha • Selo Rocha
              </span>
            </button>

            {/* Button 2: Piercing */}
            <button
              type="button"
              onClick={() => setDashboardFilter('piercing')}
              className={`relative overflow-hidden group py-4 px-5 rounded-xl border transition-all duration-500 text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                dashboardFilter === 'piercing'
                  ? 'bg-gradient-to-b from-[#1c1917]/90 to-[#0c0a09]/90 border-gold-base shadow-[0_0_15px_rgba(197,155,103,0.25)]'
                  : 'bg-black/60 border-gold-dark/15 opacity-60 hover:opacity-100 hover:border-gold-base/50'
              }`}
            >
              <div className="absolute inset-0 bg-gold-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="text-xl">💎</span>
              <span className="font-serif text-xs sm:text-sm font-extrabold tracking-[1.5px] text-white uppercase leading-none">
                Painel de Piercing
              </span>
              <span className="text-[8px] text-gold-base uppercase tracking-widest font-bold font-sans">
                Crys Piercer • Joalheria de Luxo
              </span>
            </button>

            {/* Button 3: Both */}
            <button
              type="button"
              onClick={() => setDashboardFilter('both')}
              className={`relative overflow-hidden group py-4 px-5 rounded-xl border transition-all duration-500 text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                dashboardFilter === 'both'
                  ? 'bg-gradient-to-b from-[#1c1917]/90 to-[#0c0a09]/90 border-gold-base shadow-[0_0_15px_rgba(197,155,103,0.25)]'
                  : 'bg-black/60 border-gold-dark/15 opacity-60 hover:opacity-100 hover:border-gold-base/50'
              }`}
            >
              <div className="absolute inset-0 bg-gold-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="text-xl">👑</span>
              <span className="font-serif text-xs sm:text-sm font-extrabold tracking-[1.5px] text-white uppercase leading-none">
                Família Rocha Dashboard
              </span>
              <span className="text-[8px] text-gold-base uppercase tracking-widest font-bold font-sans">
                Os Dois Juntos • Gestão Unificada
              </span>
            </button>
          </div>
        </div>

        {/* Header Title with motivational quote */}
        <header className="mb-10 pb-6 border-b border-gold-dark/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="font-display text-[10px] tracking-[6px] text-gold-base uppercase">ADMINISTRAÇÃO SOBERANA</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white mt-1">Soberano Cristiano Rocha</h1>
            <p className="text-gray-400 text-xs mt-2 italic max-w-xl font-sans">
              "Conduzir o Família Rocha Studio é carregar a honra do templo mais tradicional e refinado da cidade. Nossas escolhas determinam a posteridade corporal."
            </p>
          </div>
          <div className="flex items-center gap-2 p-1 rounded-lg bg-gold-dark/10 border border-gold-base/30 text-[10px] text-gold-light uppercase tracking-wider px-3 py-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Central Sincronizada</span>
          </div>
        </header>

        {/* ========================================================== */}
        {/* TAB 1: VISÃO GERAL */}
        {/* ========================================================== */}
        {activeTab === 'geral' && (
          <div className="space-y-8 animate-fade-in">

            {hasCriticalStock && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500 text-red-100 flex items-center justify-between gap-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-widest text-red-400">Alerta Crítico de Estoque</h3>
                    <p className="text-xs">Existem suprimentos no fim. Consulte a aba de Controle de Estoque imediatamente.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('estoque')} 
                  className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 py-2 px-4 rounded text-xs font-bold uppercase transition-all"
                >
                  Resolver Controle
                </button>
              </div>
            )}
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-xl bg-bg-card border border-gold-dark/15 gold-shadow flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Faturamento</span>
                  <p className="text-2xl font-bold font-serif text-gold-light mt-1">R$ {totalMonthlyBilling.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <span className="text-[9px] text-[#a47c4c] block mt-1">Estimativa Conversão</span>
                </div>
                <div className="p-3 rounded-lg bg-gold-base/10 text-gold-base border border-gold-base/20">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-xl bg-bg-card border border-gold-dark/15 gold-shadow flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Oportunidades (Leads)</span>
                  <p className="text-2xl font-bold font-serif text-white mt-1">{filteredBookings.length}</p>
                  <span className="text-[9px] text-blue-400 block mt-1">Briefings Captados</span>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <User className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-xl bg-bg-card border border-gold-dark/15 gold-shadow flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Taxa de Conversão</span>
                  <p className="text-2xl font-bold font-serif text-white mt-1">
                    {filteredBookings.length > 0 
                      ? Math.round((confirmedBookingsCount / filteredBookings.length) * 100) 
                      : 0}%
                  </p>
                  <span className="text-[9px] text-green-500 block mt-1">Projetos Fechados</span>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-xl bg-bg-card border border-gold-dark/15 gold-shadow flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Briefings Pendentes</span>
                  <p className="text-2xl font-bold font-serif text-white mt-1">{pendingBookingsCount}</p>
                  <span className="text-[9px] text-amber-500 block mt-1">Aguardando aprovação</span>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-xl bg-bg-card border border-gold-dark/15 gold-shadow flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Meta Financeira</span>
                  <p className="text-2xl font-bold font-serif text-white mt-1">{progressPercentage}%</p>
                  <span className="text-[9px] text-gold-light block mt-1">R$ {stats.monthlyGoal.toLocaleString('pt-BR')}</span>
                </div>
                <div className="p-3 rounded-lg bg-gold-dark/10 text-gold-light border border-gold-base/30">
                  <Target className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Kanban integrado no Hero da Visão Geral */}
            <div className="pt-2 animate-fade-in">
              <div className="p-1 rounded-xl bg-gradient-to-r from-gold-dark/20 via-[#101010] to-gold-base/10 border border-gold-base/30 shadow-2xl">
                <div className="p-4 bg-black/50 rounded-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 border-b border-gold-dark/15 pb-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                        <span>Workflow Imperial (Kanban)</span>
                        <span className="text-[9px] py-0.5 px-2 rounded bg-gold-dark/20 text-gold-light border border-gold-base/30 uppercase font-extrabold tracking-wider">CRM de Atendimento</span>
                      </h3>
                      <p className="text-[10px] text-gray-400">Arraste os briefings entre as colunas para atualizar as negociações em tempo real.</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gold-light bg-gold-base/10 px-2.5 py-1 rounded border border-gold-base/20">
                      Central do CEO Cristiano Rocha
                    </span>
                  </div>
                  <AdminKanbanView 
                    bookings={filteredBookings} 
                    onUpdateStatus={onUpdateBookingStatus} 
                  />
                </div>
              </div>
            </div>

            {/* List of Next Projects booked by clients */}
            <div className="p-6 rounded-xl bg-bg-card border border-gold-base/20 shadow-2xl">
              <div className="flex justify-between items-center mb-6 border-b border-gold-dark/10 pb-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-white">Próximos Briefings &amp; Agendamentos</h2>
                  <p className="text-xs text-gray-500 mt-1">Lista completa de solicitações enviadas pelos clientes pelo formulário institucional.</p>
                </div>
                <span className="text-[10px] bg-gold-dark/10 text-gold-light border border-gold-base/30 py-1.5 px-3 rounded-md uppercase font-bold">
                  Total: {filteredBookings.length} Projetos
                </span>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="py-12 px-4 text-center">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">Nenhum agendamento pendente sintonizado no banco de dados.</p>
                  <p className="text-xs text-[#a47c4c] mt-1 uppercase font-semibold font-sans">Tente enviar um agendamento novo no Portal do Cliente!</p>
                </div>
              ) : (
                <div className="overflow-x-auto dark-scrollbar pb-2">
                  <table className="w-full min-w-[800px] text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gold-dark/15 text-gold-light uppercase text-[10px] font-bold tracking-wider">
                        <th className="py-4 px-3 w-[20%]">Cliente / WhatsApp</th>
                        <th className="py-4 px-3 w-[25%]">Projeto Autoral</th>
                        <th className="py-4 px-3 w-[25%]">Descrição / Briefing</th>
                        <th className="py-4 px-3 w-[15%]">Data / Valor</th>
                        <th className="py-4 px-3 w-[15%] text-right">Ações de Decisão</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-dark/5">
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-black/40 transition-colors group">
                          
                          <td className="py-4 px-3 font-semibold text-white">
                            <div className="font-medium text-sm text-white group-hover:text-gold-light transition-colors leading-snug">{booking.name}</div>
                            <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-base"></span>
                              {booking.whatsapp}
                            </div>
                          </td>

                          <td className="py-4 px-3 text-gray-300">
                            <span className="py-1 px-2.5 rounded-md bg-gold-dark/10 text-gold-light border border-gold-base/20 text-[10px] font-semibold uppercase tracking-wider block w-fit mb-1.5">
                              {booking.style}
                            </span>
                            <div className="flex gap-2 text-[9px] uppercase font-bold text-gray-500">
                              <span className={booking.tattooType === 'autoral' ? 'text-gold-base' : ''}>{booking.tattooType || 'Autoral'}</span>
                              <span>•</span>
                              <span>Tamanho {booking.tattooSizeCm ? `${booking.tattooSizeCm}cm` : '10cm'}</span>
                              <span>•</span>
                              <span>{booking.bodyPart || 'braço'}</span>
                            </div>
                          </td>

                          <td className="py-4 px-3 max-w-[200px] text-xs text-gray-400 capitalize whitespace-normal break-words leading-relaxed">
                            <p className="line-clamp-2" title={booking.description}>
                              {booking.description}
                            </p>
                            {booking.referenceImage && (
                              <a href={booking.referenceImage} target="_blank" rel="noreferrer" className="inline-flex mt-1.5 text-[9px] text-blue-400 hover:text-blue-300 items-center gap-1 uppercase tracking-wider font-bold">
                                [Ver Imagem Anexada]
                              </a>
                            )}
                          </td>

                          <td className="py-4 px-3">
                            <div className="font-bold text-white text-xs leading-none">
                              {booking.date.split('-')[2]}/{booking.date.split('-')[1]}/{booking.date.split('-')[0]}
                            </div>
                            <div className="text-[11px] text-gold-light font-serif mt-1.5 font-bold">
                              R$ {booking.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </td>

                          <td className="py-4 px-3 text-right">
                            <div className="flex gap-1.5 justify-end items-center">
                              {/* Action: Termo de Consentimento Eletrônico */}
                              <button
                                onClick={() => {
                                  alert(`Termo Eletrônico de Consentimento gerado em PDF para ${booking.name}.\nVocê já pode enviar no WhatsApp do cliente.`);
                                }}
                                className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-black border border-blue-500/20 transition-all font-mono text-[10px] uppercase font-bold tracking-widest whitespace-nowrap"
                                title="Gerar Termo Eletrônico de Consentimento (Anamnese)"
                              >
                                Anamnese
                              </button>

                              {/* Action: WhatsApp API trigger */}
                              <button
                                onClick={() => openWhatsAppApproval(booking)}
                                className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-black border border-green-500/20 transition-all"
                                title="Abrir conversa de Aprovação no WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                              </button>

                              {booking.status !== 'confirmado' ? (
                                <button
                                  onClick={() => onUpdateBookingStatus(booking.id, 'confirmado')}
                                  className="p-2 rounded-lg bg-gold-base/10 text-gold-light hover:bg-gold-base hover:text-black border border-gold-base/20 transition-all font-mono text-[10px] uppercase font-bold"
                                  title="Confirmar Reserva de Agenda"
                                >
                                  Aprovar
                                </button>
                              ) : (
                                <span className="text-[9px] text-green-400 font-bold uppercase py-1 px-2 rounded-md bg-green-950/20 border border-green-500/20 mr-2 shrink-0">
                                  ✓ Salvo
                                </span>
                              )}

                              <button
                                onClick={() => onDeleteBooking(booking.id)}
                                className="p-2 rounded-lg bg-red-950/30 text-red-400 hover:bg-red-500 hover:text-black border border-red-950/50 transition-all"
                                title="Deletar permanentemente"
                              >
                                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: GERENCIAR AGENDA & CALENDAR BLOQUEIOS */}
        {/* ========================================================== */}
        {activeTab === 'agenda' && (
          <div className="space-y-8 animate-fade-in">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Selected Day Inspector & Global Settings */}
              <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                
                {/* 1. Selected Day details */}
                <div className="p-6 rounded-xl bg-[#0f0f0f] border border-gold-base/20 gold-shadow space-y-5">
                  <div className="border-b border-gold-dark/20 pb-4 flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-gold-base uppercase tracking-widest font-bold">Agenda Diária</span>
                      <h2 className="font-serif text-lg font-bold text-white mt-0.5">
                        {selectedAdminDate.split('-').reverse().join('/')}
                      </h2>
                    </div>
                    {/* Entire day master state badge */}
                    <div className="text-right">
                      {blockedDates.includes(selectedAdminDate) ? (
                        <span className="text-[9px] px-2 py-0.5 rounded bg-red-950/40 border border-red-500/30 text-red-400 uppercase font-bold">
                          Bloqueado Total
                        </span>
                      ) : (
                        <span className="text-[9px] px-2 py-0.5 rounded bg-green-950/40 border border-green-500/30 text-green-400 uppercase font-bold">
                          Disponível
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Day stats */}
                  <div className="grid grid-cols-2 gap-3 bg-black/40 p-3 rounded-lg border border-gold-dark/10">
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase block font-bold">Faturamento Projetado</span>
                      <span className="font-serif text-sm font-bold text-gold-light">
                        R$ {filteredBookings
                          .filter(b => b.date === selectedAdminDate && (b.status === 'confirmado' || b.status === 'concluido'))
                          .reduce((sum, curr) => sum + curr.value, 0)},00
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase block font-bold">Ocupação Horária</span>
                      <span className="text-xs text-white font-semibold">
                        {filteredBookings.filter(b => b.date === selectedAdminDate && b.status !== 'cancelado').length + (blockedSlots[selectedAdminDate] || []).length} / 5 slots
                      </span>
                    </div>
                  </div>

                  {/* Master Day Toggle Control */}
                  <div>
                    <button
                      onClick={() => onToggleDateBlock(selectedAdminDate)}
                      className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border ${
                        blockedDates.includes(selectedAdminDate)
                          ? 'bg-green-950/20 text-green-400 border-green-500/30 hover:bg-green-150 hover:text-black hover:border-green-405'
                          : 'bg-red-950/20 text-red-400 border-red-500/30 hover:bg-red-150 hover:text-black hover:border-red-405'
                      }`}
                    >
                      {blockedDates.includes(selectedAdminDate) ? (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Desbloquear Dia Completo</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Bloquear Dia Completo</span>
                        </>
                      )}
                    </button>
                    <p className="text-[9px] text-gray-500 text-center mt-1.5">Ao bloquear o dia completo, nenhum horário individual estará acessível para clientes.</p>
                  </div>

                  {/* Hourly slots inspector list */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs uppercase tracking-widest text-gold-light font-bold block mb-1">Grade Horária do Dia:</span>
                    
                    {timeSlots.map((slot) => {
                      const dayBooking = filteredBookings.find(b => b.date === selectedAdminDate && b.time === slot && b.status !== 'cancelado');
                      const isSlotBlocked = (blockedSlots[selectedAdminDate] || []).includes(slot);
                      const isDayBlocked = blockedDates.includes(selectedAdminDate);

                      return (
                        <div 
                          key={slot} 
                          className={`p-3.5 rounded-lg border transition-all ${
                            dayBooking 
                              ? 'bg-[#121c16]/70 border-green-900/40 shadow-sm' 
                              : isSlotBlocked || isDayBlocked
                                ? 'bg-[#1b1212]/70 border-red-900/40 opacity-75' 
                                : 'bg-black/40 border-gold-dark/10'
                          }`}
                        >
                          <div className="flex justify-between items-center gap-2">
                            {/* Hour & status indicator */}
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-white bg-gold-dark/20 border border-gold-base/30 py-0.5 px-2 rounded">
                                {slot}
                              </span>
                              {dayBooking ? (
                                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                                  dayBooking.status === 'pendente' 
                                    ? 'bg-amber-950/40 border-amber-500/20 text-amber-400' 
                                    : dayBooking.status === 'concluido'
                                      ? 'bg-green-950/40 border-green-500/20 text-green-400 font-bold'
                                      : 'bg-blue-950/40 border-blue-500/20 text-blue-400'
                                }`}>
                                  Reservado • {dayBooking.status}
                                </span>
                              ) : isSlotBlocked || isDayBlocked ? (
                                <span className="text-[9px] font-bold text-red-400 uppercase bg-red-950/45 px-1.5 py-0.5 rounded border border-red-500/20">
                                  Bloqueado
                                </span>
                              ) : (
                                <span className="text-[9px] font-bold text-gold-base uppercase bg-gold-dark/10 px-1.5 py-0.5 rounded border border-gold-base/10">
                                  Livre
                                </span>
                              )}
                            </div>

                            {/* Option actions */}
                            {!dayBooking && (
                              <button
                                disabled={isDayBlocked}
                                onClick={() => handleToggleSlotBlock(selectedAdminDate, slot)}
                                className={`py-1 px-2.5 rounded text-[9px] font-bold uppercase tracking-wider duration-200 border ${
                                  isDayBlocked
                                    ? 'bg-gray-800 text-gray-500 border-transparent cursor-not-allowed opacity-50'
                                    : isSlotBlocked
                                      ? 'bg-green-950/20 text-green-400 border-green-500/20 hover:bg-green-500 hover:text-black'
                                      : 'bg-red-950/20 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-black'
                                }`}
                              >
                                {isSlotBlocked ? 'Ativar' : 'Trancar'}
                              </button>
                            )}
                          </div>

                          {/* Client details if booked */}
                          {dayBooking && (
                            <div className="mt-3 bg-black/50 p-2.5 rounded border border-green-950/40 text-[11px] space-y-1.5 text-gray-300 animate-fade-in">
                              <div className="flex justify-between font-bold">
                                <span className="text-white">{dayBooking.name}</span>
                                <span className="text-gold-light">R$ {dayBooking.value}</span>
                              </div>
                              <div className="text-[10px] text-gray-400 line-clamp-1">{dayBooking.style} • {dayBooking.description}</div>
                              
                              {/* Group of Actions for booking status */}
                              <div className="flex flex-wrap justify-between items-center pt-2 border-t border-green-950/30 gap-2">
                                <a 
                                  href={`https://wa.me/${dayBooking.whatsapp.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[9px] uppercase font-bold text-[#25D366] hover:underline flex items-center gap-1"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  WhatsApp
                                </a>

                                <div className="flex gap-1">
                                  {dayBooking.status === 'pendente' && (
                                    <button
                                      onClick={() => onUpdateBookingStatus(dayBooking.id, 'confirmado')}
                                      className="bg-gold-base hover:bg-gold-light text-black font-bold uppercase text-[8px] py-1 px-1.5 rounded transition"
                                    >
                                      Confirmar
                                    </button>
                                  )}
                                  {dayBooking.status === 'confirmado' && (
                                    <button
                                      onClick={() => onUpdateBookingStatus(dayBooking.id, 'concluido')}
                                      className="bg-green-600 hover:bg-green-500 text-white font-bold uppercase text-[8px] py-1 px-1.5 rounded transition"
                                    >
                                      Concluir
                                    </button>
                                  )}
                                  <button
                                    onClick={() => onUpdateBookingStatus(dayBooking.id, 'cancelado')}
                                    className="bg-red-950 text-red-400 border border-red-900/30 font-bold uppercase text-[8px] py-1 px-1.5 rounded hover:bg-red-900 hover:text-black transition"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Global slots settings */}
                <div className="p-6 rounded-xl bg-[#0b0b0b] border border-gold-dark/15 space-y-4">
                  <div className="flex justify-between items-center border-b border-gold-dark/10 pb-3">
                    <div>
                      <h3 className="font-serif text-sm font-bold text-white">⚙️ Grade de Horários Globais</h3>
                      <p className="text-[10px] text-gray-500 font-sans mt-0.5">Defina as 5 faixas padrões exibidas aos clientes no Book.</p>
                    </div>
                  </div>

                  {isEditingSlots ? (
                    <div className="space-y-4 animate-fade-in">
                      <div className="grid grid-cols-5 gap-2">
                        {customSlotInputs.map((slotValue, idx) => (
                          <input
                            key={idx}
                            type="text"
                            maxLength={5}
                            value={slotValue}
                            onChange={(e) => {
                              const updated = [...customSlotInputs];
                              updated[idx] = e.target.value;
                              setCustomSlotInputs(updated);
                            }}
                            className="bg-[#050505] border border-gold-dark/40 text-gold-light font-semibold rounded-lg text-center p-2 text-xs outline-none focus:border-gold-base focus:ring-1 focus:ring-gold-base/50 font-mono"
                          />
                        ))}
                      </div>
                      <div className="flex gap-2 justify-end text-[10px]">
                        <button
                          onClick={() => setIsEditingSlots(false)}
                          className="py-1.5 px-3.5 rounded bg-gray-900 text-gray-400 border border-gray-800 hover:text-white uppercase font-bold"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSaveSlots}
                          className="py-1.5 px-3.5 rounded bg-gradient-to-r from-gold-dark to-gold-base text-black font-bold uppercase"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex gap-2 flex-wrap">
                        {timeSlots.map((slot) => (
                          <span 
                            key={slot} 
                            className="bg-black/60 text-gold-light border border-gold-dark/30 font-mono font-bold text-xs py-1 px-2.5 rounded-lg"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={startEditingSlots}
                        className="py-1.5 px-3 rounded bg-gold-dark/10 text-gold-light border border-gold-base/20 text-[10px] font-bold uppercase hover:bg-gold-base/10 transition"
                      >
                        Editar Horários
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Visual calendar grid block */}
              <div className="lg:col-span-12 xl:col-span-7 p-6 rounded-xl bg-bg-card border border-gold-base/20 shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-gold-dark/15 pb-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">Visualizador da Agenda Real</h3>
                    <p className="text-[10px] text-gray-500 font-sans mt-0.5">Toque em qualquer quadrante para carregar o inspetor de horários específicos à esquerda.</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest bg-gold-dark/10 text-gold-light border border-gold-base/30 py-1.5 px-3 rounded-md font-bold">
                    Trancados: {blockedDates.length} dias
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 bg-black/40 p-2 sm:p-4 rounded-xl border border-gold-dark/15">
                  {/* Calendar Headers */}
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                    <div key={day} className="text-center text-[10px] uppercase font-bold text-gold-dark/80 py-1 font-mono">
                      {day}
                    </div>
                  ))}

                  {/* Grid squares */}
                  {juneDays.map((item) => {
                    if (item.empty) {
                      return <div key={item.key} className="aspect-square bg-transparent"></div>;
                    }

                    let tileClass = "relative aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer text-xs font-semibold select-none transition-all ";
                    let bgContent = item.day ? item.day.toString() : '';

                    const isSelectedDate = item.dateString === selectedAdminDate;

                    if (item.isBlocked) {
                      tileClass += "bg-red-950/30 text-red-500/80 border border-red-500/40 hover:bg-red-500 hover:text-black";
                    } else if (item.isBooked) {
                      tileClass += "bg-green-950/20 text-green-400 border border-green-500/20 hover:bg-gold-base hover:text-black";
                    } else {
                      tileClass += "bg-black/80 text-white border border-gold-dark/15 hover:border-gold-base hover:bg-gold-base hover:text-black";
                    }

                    if (isSelectedDate) {
                      tileClass += " ring-2 ring-gold-base scale-105 border-transparent shadow-[0_0_15px_rgba(197,155,103,0.4)] z-10 font-bold";
                    }

                    return (
                      <div
                        key={item.key}
                        onClick={() => item.dateString && setSelectedAdminDate(item.dateString)}
                        className={tileClass}
                        title={`Inspecionar dia ${item.day}`}
                      >
                        <span className="font-bold text-xs">{bgContent}</span>
                        {item.isBlocked ? (
                          <Lock className="w-2.5 h-2.5 text-red-400 absolute bottom-1 right-1" />
                        ) : (
                          <Unlock className="w-2.5 h-2.5 text-gold-dark opacity-30 absolute bottom-1 right-1" />
                        )}
                        {item.isBooked && (
                          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-green-400" title="Possui sessão confirmada"></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Help legend inside the calendar panel */}
                <div className="grid grid-cols-3 gap-3 text-[10px] uppercase font-bold text-gray-500 pt-2 border-t border-gold-dark/10">
                  <div className="flex items-center gap-1.5 justify-center">
                    <span className="w-2 h-2 rounded bg-black/80 border border-gold-dark/15"></span>
                    <span>Disponível</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center">
                    <span className="w-2 h-2 rounded bg-red-950/30 border border-red-500/40"></span>
                    <span>Dia Bloqueado</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center">
                    <span className="w-2 h-2 rounded bg-green-950/20 border border-green-500/20"></span>
                    <span>Sessão Marcada</span>
                  </div>
                </div>

                <p className="text-[10px] text-center text-gray-500 pt-2 uppercase">
                  O painel de inspeção à esquerda exibe de forma detalhada o status, clientes e bloqueios específicos de horários da data selecionada.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================== */}
        {activeTab === 'financeiro' && (
          <div className="space-y-8 animate-fade-in text-white animate-fade-in">
            
            {/* Top Overview Bar */}
            <div className="p-6 rounded-xl bg-bg-card border border-gold-base/25 shadow-2xl relative">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                    <span>Soberania do Caixa &amp; Alvos Mensais</span>
                    <span className="text-[9px] bg-gold-dark/20 text-gold-light border border-gold-base/30 px-2 py-0.5 rounded font-extrabold tracking-widest uppercase">
                      Relatórios &amp; Insights
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1 font-sans">Metas, faturamento real, métricas de pizza, barras e splits de repasse.</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 uppercase block font-bold">Consolidado Total</span>
                  <p className="text-3xl font-bold text-gold-light font-serif">R$ {totalMonthlyBilling.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              {/* BARRA DE PROGRESSO DOURADA GRADIENTE */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-gray-300">
                  <span>Progresso da Meta de Junho/2026:</span>
                  <span className="text-gold-light">{totalMonthlyBilling >= stats.monthlyGoal ? '👑 META REESCRITA COM SUCESSO!' : `${progressPercentage}% Concluído`}</span>
                </div>
                
                <div className="w-full h-5 rounded-full bg-[#080808] border border-gold-dark/20 overflow-hidden p-0.5">
                  <div 
                    className="h-full rounded-full gold-gradient shadow-[0_0_15px_rgba(197,155,103,0.3)] transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold">
                  <span>R$ 0,00</span>
                  <span>Meta Alvo: R$ {stats.monthlyGoal.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>

            {/* NEW SECTION: INTERACTIVE RECHARTS GRAPHICS (Pizza e Massa/Barras) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Box 1: Gráfico de Pizza (Style Analytics) */}
              <div className="p-6 rounded-xl bg-bg-card border border-gold-base/20 shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                    <span className="text-gold-base">●</span> Distribuição por Estilo (Pizza/Preferências)
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4">Apetite Demográfico do Cliente</p>
                </div>
                
                {pieChartData.length === 0 ? (
                  <div className="h-[260px] flex items-center justify-center text-gray-500 text-xs text-center border border-dashed border-gold-base/10 rounded-lg">
                    Sem dados de agendamentos confirmados para plotar.
                  </div>
                ) : (
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="48%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#c59b67', '#a47c4c', '#e2c9a1', '#855f32', '#63441f', '#d4af37'][index % 6]} />
                          ))}
                        </Pie>
                        <ChartTooltip
                          contentStyle={{ backgroundColor: '#0f0f0f', borderColor: '#c59b67', borderRadius: '8px', color: '#fff' }}
                          itemStyle={{ color: '#c59b67' }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36} 
                          iconSize={8}
                          iconType="circle"
                          wrapperStyle={{ fontSize: '9px', color: '#9ca3af' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Box 2: Gráfico de Massa (Faturamento Estimado por Estilo) */}
              <div className="p-6 rounded-xl bg-bg-card border border-gold-base/20 shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                    <span className="text-gold-base">■</span> Faturamento Gerado por Estilo (Massa/Barras)
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4">Volume Comercial em Reais por estilo</p>
                </div>
                
                {styleFinanceData.length === 0 ? (
                  <div className="h-[260px] flex items-center justify-center text-gray-500 text-xs text-center border border-dashed border-gold-base/10 rounded-lg">
                    Sem dados de faturamento para renderizar gráfico de barras.
                  </div>
                ) : (
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={styleFinanceData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                        <XAxis dataKey="name" stroke="#666" fontSize={9} fontStyle="bold" />
                        <YAxis stroke="#666" fontSize={9} />
                        <ChartTooltip
                          contentStyle={{ backgroundColor: '#0f0f0f', borderColor: '#c59b67', borderRadius: '8px' }}
                          itemStyle={{ color: '#c59b67' }}
                          labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="value" fill="#c59b67" radius={[4, 4, 0, 0]} name="Valor (BRL)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* NEW SECTION: PREDICTIVE INSIGHTS FOR THE CEO */}
            <div className="p-6 rounded-xl bg-[#0a0a0a] border border-gold-base/25 shadow-2xl">
              <div className="flex items-center gap-2.5 mb-5 border-b border-gold-dark/15 pb-3">
                <span className="p-2 rounded bg-gold-dark/20 text-gold-light border border-gold-base/20">
                  <span className="text-sm">🧠</span>
                </span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Central de Inteligência Operacional</h3>
                  <p className="text-[10px] text-gray-400">Insights do Negócio calibrados em tempo real para tomada de decisão estratégica.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Style Demand Insight */}
                <div className="p-4 rounded-lg bg-black/40 border border-gold-dark/15 space-y-2">
                  <span className="text-[9px] text-[#c59b67] uppercase font-bold tracking-wider">Apetite de Estilo</span>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {styleAnalytics.length > 0 ? (
                      <>
                        O estilo <strong className="text-gold-light">{styleAnalytics[0]?.style}</strong> lidera com <strong className="text-white">{styleAnalytics[0]?.percentage}%</strong> das intenções de compra confirmadas no estúdio Rocha.
                      </>
                    ) : (
                      "Nenhum estilo de tatuagem registrado até agora."
                    )}
                  </p>
                  <span className="text-[9px] text-gray-500 uppercase block">💡 Ação: Direcionar tráfego para esse segmento.</span>
                </div>

                {/* Progress Insight */}
                <div className="p-4 rounded-lg bg-black/40 border border-gold-dark/15 space-y-2">
                  <span className="text-[9px] text-[#c59b67] uppercase font-bold tracking-wider">Diretriz da Meta</span>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {totalMonthlyBilling >= stats.monthlyGoal ? (
                      <>
                        Soberania Absoluta! A meta de <strong className="text-gold-light">R$ {stats.monthlyGoal.toLocaleString('pt-BR')}</strong> foi ultrapassada. Margem líquida maximizada.
                      </>
                    ) : (
                      <>
                        Falta <strong className="text-gold-light">R$ {Math.max(0, stats.monthlyGoal - totalMonthlyBilling).toLocaleString('pt-BR')}</strong> para atingir a meta mensal estabelecida pelo CEO Cristiano Rocha.
                      </>
                    )}
                  </p>
                  <span className="text-[9px] text-gray-500 uppercase block">💡 Ação: Cobrar briefings pendentes via WhatsApp.</span>
                </div>

                {/* Split Insight */}
                <div className="p-4 rounded-lg bg-black/40 border border-gold-dark/15 space-y-2">
                  <span className="text-[9px] text-[#c59b67] uppercase font-bold tracking-wider">Split de Lucros</span>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    A receita atual projeta <strong className="text-white">R$ {(totalMonthlyBilling * 0.6).toLocaleString('pt-BR')}</strong> líquidos aos artistas criadores (60%) e reservará <strong className="text-[#a47c4c]">R$ {(totalMonthlyBilling * 0.4).toLocaleString('pt-BR')}</strong> ao fundo físico do estúdio (40%).
                  </p>
                  <span className="text-[9px] text-gray-500 uppercase block">💡 Ação: Replicar split no ato da sessão.</span>
                </div>

                {/* Stock Alert Insight */}
                <div className="p-4 rounded-lg bg-black/40 border border-gold-dark/15 space-y-2">
                  <span className="text-[9px] text-[#c59b67] uppercase font-bold tracking-wider">Saúde do Estoque</span>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {inventory.filter(item => item.quantity <= item.minThreshold).length > 0 ? (
                      <>
                        ⚠️ Alerta! <strong className="text-red-400">{inventory.filter(item => item.quantity <= item.minThreshold).length} item(ns)</strong> estão em estoque crítico. Risco de interrupção operacional clínica.
                      </>
                    ) : (
                      "✅ Estoque robusto! Todos os insumos, agulhas e cartuchos operam acima da margem de segurança."
                    )}
                  </p>
                  <span className="text-[9px] text-gray-500 uppercase block">💡 Ação: Checar materiais críticos na aba de estoque.</span>
                </div>

              </div>
            </div>

            {/* ORIGINAL MOVED WIDGETS SIDE BY SIDE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Side: Radar de Demandas list of progress bars */}
              <div className="lg:col-span-6 p-6 rounded-xl bg-bg-card border border-gold-base/20 shadow-xl">
                <h2 className="font-serif text-lg font-bold text-white mb-1">Radar de Demandas (Lista Completa)</h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4">Mapeamento de Linha Contínua de Estilos</p>
                {styleAnalytics.length === 0 ? (
                  <p className="text-xs text-gray-500">Sem dados suficientes para mapeamento.</p>
                ) : (
                  <div className="space-y-4">
                    {styleAnalytics.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-xs text-gray-300 mb-1 uppercase font-semibold">
                          <span>{item.style}</span>
                          <span className="text-gold-base">{item.percentage}% ({item.count})</span>
                        </div>
                        <div className="w-full bg-black rounded-full h-1.5 border border-white/5">
                          <div className="bg-gold-base h-1.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Motor Financeiro Split cards */}
              <div className="lg:col-span-6 p-6 rounded-xl bg-bg-card border border-gold-base/20 shadow-xl flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-lg font-bold text-white mb-1">Motor Financeiro Split</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4">Divisão Tributária e de Licenciamento de Criação</p>
                  
                  <div className="space-y-6 mt-4">
                    <div className="p-4 rounded bg-black/40 border-l-2 border-gold-dark flex justify-between items-center">
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Resort Casa (40% de Operações)</div>
                        <div className="text-xl font-bold text-white font-serif mt-1">R$ {(totalMonthlyBilling * 0.4).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      </div>
                      <Home className="w-5 h-5 text-gold-base" />
                    </div>
                    
                    <div className="p-4 rounded bg-gold-dark/10 border-l-2 border-gold-base flex justify-between items-center shadow-lg">
                      <div>
                        <div className="text-[10px] text-[#c59b67] uppercase tracking-widest font-bold">Ganho Líquido Artistas (60% de Comissão)</div>
                        <div className="text-xl font-bold text-gold-light font-serif mt-1">R$ {(totalMonthlyBilling * 0.6).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      </div>
                      <Users className="w-5 h-5 text-gold-base" />
                    </div>
                  </div>
                </div>

                <span className="text-[9px] text-gray-500 uppercase mt-4 block text-center font-mono">
                  Calibração contratual padrão: 40/60 sintonizado com o faturamento consolidado.
                </span>
              </div>

            </div>

            {/* DRE & REGISTRATION FORMS (ORIGINAL SECTION FOR METRICS) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Box A: Adjust goals and add manual offline cash */}
              <div className="p-6 rounded-xl bg-[#0f0f0f] border border-gold-base/20 shadow-xl space-y-6">
                
                {/* Adjust Goal Target */}
                <form onSubmit={handleUpdateGoal} className="space-y-4 pb-6 border-b border-gold-dark/15">
                  <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-gold-base" /> Ajustar Alvo do Estúdio Cristiano
                  </h3>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gold-dark font-bold">R$</span>
                      <input 
                        type="number"
                        required
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        placeholder="Ex: 50000"
                        className="w-full bg-[#080808] border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 pl-10 pr-4 text-white text-sm outline-none font-serif"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="py-3 px-5 rounded-lg bg-gold-base text-black font-extrabold uppercase tracking-wider text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      Ajustar Meta
                    </button>
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase leading-snug block font-bold">
                    Altere a meta teto para retroalimentar o percentual progressivo.
                  </span>
                </form>

                {/* Add physical manual cash (jewelry, workshops, walk-ins) */}
                <form onSubmit={handleManualRevenueSubmit} className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-gold-base" /> Registrar Receita Física Direta / Venda de Joias
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gold-light font-bold mb-1.5">Título / Descritor</label>
                      <input 
                        type="text"
                        required
                        value={manualRevenueLabel}
                        onChange={(e) => setManualRevenueLabel(e.target.value)}
                        className="w-full bg-[#080808] border border-gold-dark/35 focus:border-gold-base rounded-lg py-2.5 px-3 text-white text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gold-light font-bold mb-1.5">Valor Bruto (BRL)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gold-dark font-bold">R$</span>
                        <input 
                          type="number"
                          required
                          value={manualPriceInput}
                          onChange={(e) => setManualPriceInput(e.target.value)}
                          placeholder="Ex: 350"
                          className="w-full bg-[#080808] border border-[#d4af37]/35 focus:border-gold-base rounded-lg py-2.5 pl-8 pr-3 text-white text-xs outline-none font-serif"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 rounded-lg border border-gold-base/50 text-gold-light font-bold uppercase tracking-wider text-xs hover:bg-gold-base hover:text-black transition-all cursor-pointer"
                  >
                    Somar ao Faturamento Consolidado
                  </button>
                </form>

              </div>

              {/* Box B: DRE Table */}
              <div className="p-6 rounded-xl bg-bg-card border border-gold-base/20 shadow-xl space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-white mb-3">DRE Robusto (Demonstrativo do Resultado)</h3>
                  
                  <div className="divide-y divide-gold-dark/10 space-y-3 text-xs">
                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">(=) Receita Operacional Bruta</span>
                      <span className="font-bold text-white font-serif">R$ {totalMonthlyBilling.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between items-center py-2.5 pl-3">
                      <span className="text-gray-500">Tatuagens de Sessões Confirmadas</span>
                      <span className="text-gray-300 font-serif">R$ {bookingsRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between items-center py-2.5 pl-3 border-none">
                      <span className="text-gray-500">Joias / Receitas Físicas Variadas</span>
                      <span className="text-gray-300 font-serif">R$ {manualRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>

                    {/* Cost breakdown */}
                    <div className="flex justify-between items-center pt-3 pb-2 mt-2">
                       <span className="text-red-400 font-bold uppercase text-[10px] tracking-wider">(-) Custos Operacionais (Estimado 35%)</span>
                      <span className="font-bold text-red-400 font-serif">- R$ {(totalMonthlyBilling * 0.35).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between items-center py-2.5 pl-3 border-[#000] border-none pb-4">
                      <span className="text-gray-550 italic text-gray-500">Agulhas de alta precisão, cartuchos estéreis, tintas bio-compatíveis &amp; estúdio.</span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-t-2 border-gold-base pt-4 bg-[#080808] -mx-4 px-4 rounded-lg">
                      <span className="text-gold-light font-extrabold uppercase font-display text-[11px] tracking-widest">(=) Lucro Líquido do Exercício</span>
                      <span className="font-extrabold text-gold-light text-xl font-serif">R$ {(totalMonthlyBilling * 0.65).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-gold-dark/10 mt-4">
                  <h4 className="text-[10px] uppercase font-bold text-gold-light tracking-wide mb-1.5">Métricas de Escalabilidade</h4>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-sans mb-1">
                    A margem de lucro líquido estimada do estúdio está calibrada em 65% após dedução de insumos, materiais e splits.
                  </p>
                  <p className="text-[9px] font-mono uppercase text-gray-400">Contabilidade Certificada Família Rocha</p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 4: CONTROLE DE ESTOQUE */}
        {/* ========================================================== */}
        {activeTab === 'estoque' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Controle de Estoque & Suprimentos</h2>
                <p className="text-xs text-gray-500 mt-1">Gerencie agulhas, tintas e insumos (Burn Rate).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {inventory.map((item) => {
                const isCritical = item.quantity <= item.minThreshold;
                return (
                  <div key={item.id} className={`p-6 rounded-xl border shadow-xl flex flex-col ${isCritical ? 'bg-red-950/20 border-red-500/50' : 'bg-bg-card border-gold-base/20'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <Package className={`w-5 h-5 ${isCritical ? 'text-red-500' : 'text-gold-base'}`} />
                        <h3 className="font-bold text-white uppercase text-xs tracking-wider">{item.name}</h3>
                      </div>
                      {isCritical && <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />}
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Quantidade Atual</span>
                      <div className={`text-3xl font-serif font-bold mt-1 ${isCritical ? 'text-red-400' : 'text-white'}`}>
                        {item.quantity} <span className="text-sm font-sans font-normal text-gray-500">{item.unit}</span>
                      </div>
                      <span className="text-[9px] text-gray-500 block mt-1">Alerta mínimo configurado em: {item.minThreshold}</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                      <button 
                        onClick={() => {
                          const newInv = inventory.map(i => i.id === item.id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i);
                          onUpdateInventory(newInv);
                        }}
                        className="py-1.5 px-3 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] uppercase font-bold tracking-widest flex-1"
                      >
                        Consumir -1
                      </button>
                      <button 
                        onClick={() => {
                          const newInv = inventory.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 5 } : i);
                          onUpdateInventory(newInv);
                        }}
                        className="py-1.5 px-3 rounded bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] uppercase font-bold tracking-widest flex-1"
                      >
                        Repor +5
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 5: GESTÃO DA GALERIA */}
        {/* ========================================================== */}
        {activeTab === 'galeria' && (
          <div className="space-y-8 animate-fade-in text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gold-dark/10 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Gestão da Galeria & Portfólio</h2>
                <p className="text-xs text-gray-400 mt-1">Publique, edite e organize os trabalhos em destaque no site principal em tempo real.</p>
              </div>
            </div>

            {addSuccess && (
              <div className="p-4 rounded-lg bg-green-950/40 border border-green-500 text-green-100 text-xs font-bold uppercase tracking-wider animate-bounce">
                🎉 {addSuccess}
              </div>
            )}
            {addError && (
              <div className="p-4 rounded-lg bg-red-950/40 border border-red-500 text-red-100 text-xs font-bold uppercase tracking-wider">
                ⚠️ {addError}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* COLUNA 1: ADICIONAR NOVA OBRA */}
              <div className="lg:col-span-5 bg-bg-card border border-gold-base/20 rounded-xl p-6 shadow-2xl space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-gold-light flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-base" /> Publicar Novo Projeto
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Carregar nova tatuagem ou alteração de ambiente</p>
                </div>

                <form onSubmit={handleAddPortfolioItem} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 text-left">Título da Obra *</label>
                    <input 
                      type="text"
                      required
                      placeholder="Ex: Caveira Mexicana sombreada, Leão de Judá..."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-xs outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 text-left">Categoria *</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white cursor-pointer"
                      >
                        <option value="autoral">Projetos Autorais</option>
                        <option value="realismo">Blackwork & Realismo</option>
                        <option value="fineline">Piercing & Fineline</option>
                        <option value="outro">Ambiente / Estúdio</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 text-left">Local do Corpo (Opcional)</label>
                      <input 
                        type="text"
                        placeholder="Ex: Antebraço, Costas"
                        value={newBodyPart}
                        onChange={(e) => setNewBodyPart(e.target.value)}
                        className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 text-left">Tempo Gasto</label>
                      <input 
                        type="text"
                        placeholder="Ex: 5 Horas, 3 Sessões"
                        value={newTimeSpent}
                        onChange={(e) => setNewTimeSpent(e.target.value)}
                        className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 text-left">Artista Responsável</label>
                      <input 
                        type="text"
                        value={newArtist}
                        onChange={(e) => setNewArtist(e.target.value)}
                        className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* IMPORTAÇÃO DE IMAGEM FÁCIL: UPLOAD OU LINK URL */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 text-left">Imagem da Obra * (Consulte Upload ou Endereço)</label>
                    
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, false)}
                      className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${isDragOver ? "border-gold-base bg-gold-dark/10" : "border-gold-dark/30 hover:border-gold-base/50 bg-[#080808]/40"} cursor-pointer`}
                    >
                      <input 
                        type="file"
                        id="new-item-image-file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, false)}
                      />
                      
                      {newImageUrl ? (
                        <div className="space-y-3">
                          <img 
                            src={newImageUrl} 
                            alt="Previsualização" 
                            className="h-28 mx-auto rounded object-cover shadow-md border border-gold-base/20"
                            referrerPolicy="no-referrer"
                          />
                          <button 
                            type="button"
                            onClick={() => setNewImageUrl("")}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] uppercase font-bold py-1 px-3 rounded border border-red-500/30"
                          >
                            Remover Imagem
                          </button>
                        </div>
                      ) : (
                        <label htmlFor="new-item-image-file" className="block cursor-pointer space-y-2">
                          <Upload className="w-8 h-8 text-gold-base/60 mx-auto" />
                          <p className="font-semibold text-gray-300">Arraste uma foto aqui ou clique para buscar</p>
                          <p className="text-[9px] text-gray-500">Suporta JPG, PNG e arquivos do dispositivo</p>
                        </label>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-[1px] bg-gold-dark/20 flex-1"></div>
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Ou via endereço URL</span>
                      <div className="h-[1px] bg-gold-dark/20 flex-1"></div>
                    </div>

                    <input 
                      type="text"
                      placeholder="Cole um link de imagem (HTTP://...)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-2.5 px-4 text-white text-xs outline-none mt-2"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 text-left">Resumo / Descrição de Detalhes *</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Descreva o significado, estilo de traços, agulhas utilizadas ou história da foto..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-xs outline-none transition-all"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-gold-dark to-gold-base text-black shadow-lg text-[10px] uppercase tracking-wider font-extrabold rounded-lg hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Registrar Obra no Site
                  </button>
                </form>
              </div>

              {/* COLUNA 2: LISTA DE TRABALHOS EXISTENTES */}
              <div className="lg:col-span-7 bg-bg-card border border-gold-base/20 rounded-xl p-6 shadow-2xl space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white text-left">Editar Obras Existentes</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1 text-left">Clique para editar ou remover as fotos que já estão no portfólio.</p>
                </div>

                <div className="space-y-4 max-h-[640px] overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolioItems.map((item) => (
                    <div key={item.id} className="bg-black/60 border border-gold-dark/15 rounded-xl overflow-hidden flex flex-col justify-between group hover:border-gold-base/40 transition-all duration-300">
                      <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 left-2 text-[8px] tracking-[1.5px] uppercase font-bold text-black bg-gold-base py-1 px-2.5 rounded shadow">
                          {item.categoryLabel}
                        </span>
                      </div>

                      <div className="p-4 space-y-2 text-left flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-white uppercase tracking-wide truncate">{item.title}</h4>
                          <p className="text-[10px] text-gray-500 font-semibold mt-1">Por {item.artist} | {item.timeSpent}</p>
                          <p className="text-[10px] text-gray-400 mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
                        </div>
                        
                        <div className="flex gap-2 pt-4 border-t border-white/5 mt-auto">
                          <button 
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            className="flex-1 py-1.5 bg-gold-dark/10 hover:bg-gold-dark/20 border border-gold-dark/30 text-gold-light text-[9px] uppercase font-bold tracking-wider rounded transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Edit className="w-3 h-3" /> Editar
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeletePortfolioItem(item.id)}
                            className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-[9px] uppercase font-bold tracking-wider rounded transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Banir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* MODAL DE EDIÇÃO */}
            {editingItem && (
              <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-[#0c0c0c] border border-gold-base/30 rounded-xl max-w-xl w-full p-6 shadow-[0_10px_50px_rgba(197,155,103,0.15)] space-y-6 text-xs max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-gold-dark/10 pb-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-gold-light">Refinar Trabalho</h3>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Modificando: {editingItem.title}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveEdit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 text-left">Título do Projeto *</label>
                      <input 
                        type="text"
                        required
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-xs outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 text-left">Categoria *</label>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value as any)}
                          className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white cursor-pointer"
                        >
                          <option value="autoral">Projetos Autorais</option>
                          <option value="realismo">Blackwork & Realismo</option>
                          <option value="fineline">Piercing & Fineline</option>
                          <option value="outro">Ambiente / Estúdio</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 text-left">Local do Corpo</label>
                        <input 
                          type="text"
                          value={editBodyPart}
                          onChange={(e) => setEditBodyPart(e.target.value)}
                          className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 text-left">Tempo Gasto</label>
                        <input 
                          type="text"
                          value={editTimeSpent}
                          onChange={(e) => setEditTimeSpent(e.target.value)}
                          className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 text-left">Artista Responsável</label>
                        <input 
                          type="text"
                          value={editArtist}
                          onChange={(e) => setEditArtist(e.target.value)}
                          className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 text-left">Imagem do Projeto * (Upload ou Link)</label>
                      
                      <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, true)}
                        className={`border border-dashed rounded-xl p-4 text-center ${isDragOver ? "border-gold-base bg-gold-dark/15" : "border-gold-dark/20 hover:border-gold-base/40 bg-[#080808]/30"} cursor-pointer`}
                      >
                        <input 
                          type="file"
                          id="edit-item-image-file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, true)}
                        />
                        {editImageUrl ? (
                          <div className="space-y-2">
                            <img 
                              src={editImageUrl} 
                              alt="Edição previsualização" 
                              className="h-28 mx-auto rounded object-cover shadow-sm border border-gold-base/20"
                              referrerPolicy="no-referrer"
                            />
                            <p className="text-[9px] text-gray-500">Mantenha ou clique no botão de alteração abaixo para carregar um novo arquivo</p>
                            <label htmlFor="edit-item-image-file" className="inline-block bg-gold-dark/20 hover:bg-gold-dark/30 border border-gold-dark/45 py-1 px-3 rounded text-[10px] text-gold-light cursor-pointer font-bold uppercase transition-all">
                              Mudar Imagem
                            </label>
                          </div>
                        ) : (
                          <label htmlFor="edit-item-image-file" className="block cursor-pointer space-y-1">
                            <Upload className="w-6 h-6 text-gold-base/50 mx-auto" />
                            <p className="font-semibold text-gray-300">Escolha ou solte uma nova imagem</p>
                          </label>
                        )}
                      </div>

                      <input 
                        type="text"
                        placeholder="Link direto HTTP://..."
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                        className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-2.5 px-4 text-white text-xs outline-none mt-2"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 text-left">Descrição</label>
                      <textarea 
                        required
                        rows={3}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg p-3 text-white text-xs outline-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-3 border-t border-white/5">
                      <button 
                        type="button"
                        onClick={() => setEditingItem(null)}
                        className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] uppercase font-extrabold tracking-widest rounded-lg transition-all"
                      >
                        Desistir
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 py-3 bg-gradient-to-r from-gold-dark to-gold-base text-black shadow-lg text-[10px] uppercase font-extrabold tracking-widest rounded-lg hover:brightness-110 active:scale-[0.99] transition-all"
                      >
                        Salvar Alterações
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
}
