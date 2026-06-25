/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { GOOGLE_REVIEWS } from '../data';
import { Booking, PortfolioItem } from '../types';
import TestimonialsFAQ from './TestimonialsFAQ';
import { 
  Star, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  ChevronLeft,
  X, 
  Check, 
  SlidersHorizontal,
  Lock,
  MessageSquare,
  Sparkles,
  Award,
  ImagePlus,
  UserPlus
} from 'lucide-react';
import foto6 from '../foto6.png';
import logo from '../logo.png';
import piercingInsta from './Captura de tela 2026-06-19 081743.png';
import tattooFeedInsta from './Captura de tela 2026-06-19 082944.png';
import piercingImg1 from '../Captura de tela 2026-06-19 075836.png';
import piercingImg2 from '../Captura de tela 2026-06-14 192420.png';
import piercingImg3 from '../Captura de tela 2026-06-14 192702.png';
import piercingImg4 from '../Captura de tela 2026-06-14 192727.png';

const LOCAL_PIERCING_ITEMS: PortfolioItem[] = [
  {
    id: 'piercing-1',
    title: 'Nostril com Ponto de Luz',
    category: 'nariz',
    categoryLabel: 'Piercing de Nariz',
    description: 'Perfuração clássica na aba nasal (nostril) utilizando joia fina com ponto de luz, proporcionando um visual delicado, brilhante e esteticamente harmonioso.',
    timeSpent: 'Procedimento Rápido',
    artist: 'Crys Piercer',
    imageUrl: piercingImg1
  },
  {
    id: 'piercing-2',
    title: 'Ear Project Felino & Apis Gold',
    category: 'outro',
    categoryLabel: 'Alta Joalheria',
    description: 'Trabalho de curadoria estética composto por tarraxa de gato em titânio e abelha operária tridimensional cravejada de zircônias de alta reflexão. Acompanhado por trevo clássico de quatro folhas e argola estruturada.',
    timeSpent: 'Design Sob Medida',
    artist: 'Crys Piercer',
    imageUrl: piercingImg2
  },
  {
    id: 'piercing-3',
    title: 'Design Auricular - Detalhe Gato',
    category: 'outro',
    categoryLabel: 'Alta Joalheria',
    description: 'Visão minuciosa sobre a angulação milimétrica e cicatrização impecável. Apresenta o gato com zircônias cravadas e haste sobressalente ergonômica.',
    timeSpent: 'Procedimento Rápido',
    artist: 'Crys Piercer',
    imageUrl: piercingImg3
  },
  {
    id: 'piercing-4',
    title: 'Ear Project Micro-Cravejado de Luxo',
    category: 'outro',
    categoryLabel: 'Design Auricular',
    description: 'Macrodetalhe mostrando a cicatrização inicial saudável sem inflamações ou hipertrofia, acompanhado de perfurações limpas com agulhas finas americanas e polimento impecável.',
    timeSpent: 'Design Sob Medida',
    artist: 'Crys Piercer',
    imageUrl: piercingImg4
  },
  {
    id: 'piercing-5',
    title: 'Curadoria Ouro Branco',
    category: 'outro',
    categoryLabel: 'Alta Joalheria',
    description: 'Composição moderna e brilhante em titânio polido.',
    timeSpent: 'Design Sob Medida',
    artist: 'Crys Piercer',
    imageUrl: piercingImg3
  },
  {
    id: 'piercing-6',
    title: 'Helix Premium Gold',
    category: 'outro',
    categoryLabel: 'Argolas Premium',
    description: 'A joia perfeita para destacar a região superior auricular.',
    timeSpent: 'Aplicação Precisa',
    artist: 'Crys Piercer',
    imageUrl: piercingImg2
  }
];

interface ClientSiteProps {
  blockedDates: string[];
  bookings: Booking[];
  portfolioItems: PortfolioItem[];
  timeSlots: string[];
  blockedSlots: Record<string, string[]>;
  onSubmitBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
}

export default function ClientSite({ 
  blockedDates, 
  bookings, 
  portfolioItems, 
  timeSlots = [],
  blockedSlots = {},
  onSubmitBooking 
}: ClientSiteProps) {
  const [activeTab, setActiveTab] = useState<'tattoo' | 'piercing'>('tattoo');
  const [piercingMaterial, setPiercingMaterial] = useState<string>('titanio');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeBodyPartFilter, setActiveBodyPartFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [submittedDate, setSubmittedDate] = useState<string>('');
  const [submittedTime, setSubmittedTime] = useState<string>('');
  
  // Form fields
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [tattooType, setTattooType] = useState('autoral'); // 'autoral' or 'padrao'
  const [tattooSizeCm, setTattooSizeCm] = useState<number>(10);
  const [bodyPart, setBodyPart] = useState('braço');
  const [tattooComplexity, setTattooComplexity] = useState('medio');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [allergies, setAllergies] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string>('');
  const [description, setDescription] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Active review slideshow counter
  const [reviewIndex, setReviewIndex] = useState(0);

  // Active piercing carousel sliding showcase index
  const [piercingCarouselIndex, setPiercingCarouselIndex] = useState(0);

  // Auto-play the 3D piercing showcase slider automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setPiercingCarouselIndex((current) => (current + 1) % LOCAL_PIERCING_ITEMS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Formatted WhatsApp input handler: format (XX) XXXXX-XXXX
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    let formatted = '';
    if (value.length > 0) {
      formatted += `(${value.slice(0, 2)}`;
    }
    if (value.length > 2) {
      formatted += `) ${value.slice(2, 7)}`;
    }
    if (value.length > 7) {
      formatted += `-${value.slice(7, 11)}`;
    }
    
    setWhatsapp(formatted);
  };

  // Filter portfolio items
  const filteredItems = useMemo(() => {
    let items = portfolioItems;
    if (activeFilter !== 'all') {
      items = items.filter(item => item.category === activeFilter);
    }
    if (activeBodyPartFilter !== 'all') {
      items = items.filter(item => item.bodyPart?.toLowerCase() === activeBodyPartFilter.toLowerCase());
    }
    return items;
  }, [portfolioItems, activeFilter, activeBodyPartFilter]);

  // Dynamic filter for live database piercing gallery
  const [dbPiercingFilter, setDbPiercingFilter] = useState<string>('all');

  // Filter live database items specifically for piercing (category "outro" or containing keywords, excluding studio facade)
  const dbPiercingItems = useMemo(() => {
    let items = portfolioItems.filter(item => 
      (item.category === 'outro' || 
      item.categoryLabel?.toLowerCase().includes('piercing') ||
      item.title?.toLowerCase().includes('piercing') ||
      item.description?.toLowerCase().includes('piercing')) &&
      item.id !== 'estudio-fachada'
    );
    
    // Sort so newest shows first
    items = [...items].sort((a, b) => b.id.localeCompare(a.id));

    if (dbPiercingFilter !== 'all') {
      items = items.filter(item => 
        item.bodyPart?.toLowerCase() === dbPiercingFilter.toLowerCase() ||
        item.title?.toLowerCase().includes(dbPiercingFilter.toLowerCase()) ||
        item.description?.toLowerCase().includes(dbPiercingFilter.toLowerCase())
      );
    }
    return items;
  }, [portfolioItems, dbPiercingFilter]);

  // Calendar setup for June 2026: 30 days, June 1st is Monday, June 14 is current date
  const juneDays = useMemo(() => {
    const days = [];
    const year = 2026;
    const month = 5; // 0-indexed, so 5 is June
    // Starting weekday for June 1st, 2026 is Monday (index 1 when Sunday is 0)
    // We add empty slots of previous month to align correctly in grid
    const skipOffset = 1; // Mon is 1, so 1 cell skip if grid starts with Sun
    
    for (let slot = 0; slot < skipOffset; slot++) {
      days.push({ empty: true, key: `empty-${slot}` });
    }

    for (let d = 1; d <= 30; d++) {
      const dayStr = `${year}-06-${d.toString().padStart(2, '0')}`;
      const isPast = d < 14; // Before current local date June 14, 2026
      const isBlocked = blockedDates.includes(dayStr);
      const isAlreadyBooked = bookings.some(b => b.date === dayStr && b.status === 'confirmado');
      
      days.push({
        day: d,
        dateString: dayStr,
        empty: false,
        isPast,
        isBlocked: isBlocked || isAlreadyBooked,
        key: dayStr
      });
    }
    return days;
  }, [blockedDates, bookings]);

  // Calculate estimated budget
  const estimatedBudget = useMemo(() => {
    if (activeTab === 'piercing') {
      let price = 120; // Base procedure with basic quality titanium
      if (piercingMaterial === 'ouro') {
        price = 350; // Premium 18k Gold
      } else if (piercingMaterial === 'aço') {
        price = 100; // Basic surgical steel
      }
      return price;
    }

    // Base rate: R$ 20 per cm
    let baseRate = 20;
    
    // Style weight
    let styleWeight = 1.0;
    if (selectedStyle.includes('Blackwork') || selectedStyle.includes('Lobo') || selectedStyle.includes('Santa') || selectedStyle.includes('Calvário')) {
      styleWeight = 1.3;
    } else if (selectedStyle.includes('Fineline') || selectedStyle.includes('Flor')) {
      styleWeight = 1.1;
    } else if (selectedStyle.includes('Realismo') || selectedStyle.includes('Retrato')) {
      styleWeight = 1.6;
    } else if (selectedStyle.includes('Piercing')) {
      baseRate = 5; // Base is smaller for piercing
    }

    // Complexity weight
    let complexityWeight = 1.0;
    if (tattooComplexity === 'simples') complexityWeight = 0.8;
    else if (tattooComplexity === 'avancado') complexityWeight = 1.4;
    else if (tattooComplexity === 'masterpiece') complexityWeight = 2.0;

    // Body part weight
    let bodyWeight = 1.0;
    if (bodyPart === 'costas' || bodyPart === 'peito') bodyWeight = 1.4;
    else if (bodyPart === 'pescoço' || bodyPart === 'rosto' || bodyPart === 'costela') bodyWeight = 1.8;
    else if (bodyPart === 'mão' || bodyPart === 'pé') bodyWeight = 1.3;

    // Type multiplier
    let typeWeight = 1.0;
    if (tattooType === 'autoral') {
      typeWeight = 1.4; // 40% premium for custom design
    }

    if (selectedStyle.includes('Piercing')) {
      // Small backup calculation
      return 150;
    }

    let estimated = (tattooSizeCm * baseRate) * styleWeight * complexityWeight * bodyWeight * typeWeight;
    
    // Round to nearest 50, minimum R$ 150
    return Math.max(150, Math.round(estimated / 50) * 50);
  }, [activeTab, piercingMaterial, selectedStyle, tattooSizeCm, tattooType, tattooComplexity, bodyPart]);

  // Handle submit briefing
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp || !selectedDate || !selectedStyle || !description || !consentAccepted) {
      setFormError('Por favor, preencha todos os campos obrigatórios, incluindo o termo de consentimento e data.');
      return;
    }
    if (!selectedTime) {
      setFormError('Por favor, selecione um horário disponível logo abaixo do calendário.');
      return;
    }
    
    setFormError('');
    onSubmitBooking({
      name,
      whatsapp,
      date: selectedDate,
      time: selectedTime,
      style: activeTab === 'piercing' ? `[PIERCING - ${piercingMaterial.toUpperCase()}] ${selectedStyle}` : selectedStyle,
      description,
      tattooType,
      tattooSizeCm,
      bodyPart,
      tattooComplexity,
      medicalHistory,
      allergies,
      consentAccepted,
      referenceImage,
      value: estimatedBudget
    });

    const displayDate = `${selectedDate.split('-')[2]}/${selectedDate.split('-')[1]}/${selectedDate.split('-')[0]}`;
    setSubmittedDate(displayDate);
    setSubmittedTime(selectedTime);
    setFormSuccess(true);
    
    // Reset form fields
    setName('');
    setWhatsapp('');
    setSelectedDate('');
    setSelectedTime('');
    setSelectedStyle('');
    setDescription('');
    setReferenceImage('');
    setTattooType('autoral');
    setTattooSizeCm(10);
    setBodyPart('braço');
    setTattooComplexity('medio');
    setMedicalHistory('');
    setAllergies('');
    setConsentAccepted(false);

    // Clear success message after 15s
    setTimeout(() => {
      setFormSuccess(false);
      setSubmittedDate('');
      setSubmittedTime('');
    }, 15000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Pre-fill style from direct Lightbox integration
  const handlePreFillStyle = (item: PortfolioItem) => {
    setSelectedStyle(item.title);
    setSelectedItem(null); // Close lightbox
    // Smooth scroll to briefing section
    const element = document.getElementById('agendamento-briefing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-bg-black text-gray-300 font-sans min-h-screen selection:bg-gold-base selection:text-black">
      
      {/* EXQUISITE TAB SWITCHER - TWO GIANT MAJESTIC NAVIGATION BUTTONS */}
      <div className="bg-[#050505] border-b border-gold-dark/25 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab('tattoo');
              setSelectedStyle('');
            }}
            className={`relative overflow-hidden group py-5 px-6 rounded-2xl border transition-all duration-500 text-center flex flex-col items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'tattoo'
                ? 'bg-gradient-to-b from-[#1c1917]/90 to-[#0c0a09]/90 border-gold-base shadow-[0_0_20px_rgba(197,155,103,0.35)]'
                : 'bg-black/60 border-gold-dark/15 opacity-60 hover:opacity-100 hover:border-gold-base/50'
            }`}
          >
            <div className="absolute inset-0 bg-gold-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="text-2xl sm:text-3xl text-gold-light">🔱</span>
            <span className="font-serif text-sm sm:text-lg font-bold tracking-[2px] text-white uppercase">
              Tatuagem de Qualidade
            </span>
            <span className="text-[9px] sm:text-[10px] text-gold-base uppercase tracking-widest font-bold font-sans">
              Projetos Feitos para Você
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('piercing');
              setSelectedStyle('Piercing de Luxo (Alta Joalheria)');
            }}
            className={`relative overflow-hidden group py-5 px-6 rounded-2xl border transition-all duration-500 text-center flex flex-col items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'piercing'
                ? 'bg-gradient-to-b from-[#1c1917]/90 to-[#0c0a09]/90 border-gold-base shadow-[0_0_20px_rgba(197,155,103,0.35)]'
                : 'bg-black/60 border-gold-dark/15 opacity-60 hover:opacity-100 hover:border-gold-base/50'
            }`}
          >
            <div className="absolute inset-0 bg-gold-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="text-2xl sm:text-3xl text-gold-light">💎</span>
            <span className="font-serif text-sm sm:text-lg font-bold tracking-[2px] text-white uppercase">
              Piercing de Excelência
            </span>
            <span className="text-[9px] sm:text-[10px] text-gold-base uppercase tracking-widest font-bold font-sans">
              Perfuração e Acolhimento
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'tattoo' && (
        <>
          {/* 1. HERO SECTION - ROYAL PARALLAX FRAMING */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden border-b border-gold-dark/30 bg-radial-[at_center_center] from-[#161616] via-[#080808] to-[#040404]">
        {/* Fine background Grid overlay representing luxury wallpaper */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#c59b67_1px,transparent_1px),linear-gradient(to_bottom,#c59b67_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        {/* Golden Radial glow decoration - Optimized via performance-friendly radial-gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(circle_at_center,rgba(197,155,103,0.15)_0%,transparent_70%)] rounded-full pointer-events-none"></div>

        {/* Framing corners representing Victorian scrollworks */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-gold-base/40 rounded-tl-xl pointer-events-none"></div>
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-gold-base/40 rounded-tr-xl pointer-events-none"></div>
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-gold-base/40 rounded-bl-xl pointer-events-none"></div>
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-gold-base/40 rounded-br-xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 text-center z-10 py-16 flex flex-col items-center">
          
          {/* Logo Brand */}
          <div className="mb-6 relative flex flex-col items-center animate-float drop-shadow-2xl">
            <img src={logo} alt="Família Rocha Studio" className="w-56 h-56 sm:w-[350px] sm:h-[350px] object-contain filter drop-shadow-[0_0_15px_rgba(197,155,103,0.3)]" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121212] border border-gold-base/30 mb-8">
            <Award className="w-4 h-4 text-gold-light" />
            <span className="text-xs font-semibold tracking-widest text-gold-light uppercase font-sans">
              Qualidade em Arte Corporal
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight max-w-4xl">
            Tradição, <span className="gold-gradient-text italic font-normal">Projetos Autorais</span> &amp; Sobriedade
          </h1>

          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mb-10 font-light leading-relaxed font-sans">
            Com mais de <strong className="text-gold-light">Centenas de Memoriais Impecáveis</strong> e selo de excelência, criamos projetos requintados de Blackwork, Realismo e Piercings autorais de elite sob a ótica da alta joalheria.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="#agendamento-briefing" 
              className="py-4 px-8 rounded-lg bg-gradient-to-r from-gold-dark to-gold-base text-black font-semibold uppercase tracking-wider text-sm transition-all duration-300 hover:brightness-110 active:scale-95 hover:shadow-[0_0_25px_rgba(197,155,103,0.45)] w-full sm:w-auto"
            >
              Iniciar Briefing Autoral
            </a>
            <a 
              href="#portfolio-galeria" 
              className="py-4 px-8 rounded-lg border border-gold-base/40 text-gold-light font-semibold uppercase tracking-wider text-sm bg-black/80 transition-all duration-300 hover:bg-gold-base/10 hover:border-gold-base w-full sm:w-auto"
            >
              Explorar Coleção Privada
            </a>
          </div>

          {/* Google rating banner */}
          <div className="mt-14 p-4 rounded-xl bg-[#0d0d0d] border border-gold-dark/20 flex flex-col sm:flex-row items-center gap-4 max-w-lg shadow-2xl">
            <div className="flex items-center justify-center p-2.5 rounded-full bg-gold-base/10 text-gold-light border border-gold-base/20 shrink-0">
              <span className="text-xl font-bold font-serif">5.0</span>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex justify-center sm:justify-start gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-gold-base text-gold-base" />
                ))}
              </div>
              <p className="text-xs text-white font-semibold">Avaliação Absoluta no Google</p>
              <p className="text-[11px] text-gray-400">Centenas de críticas cinco estrelas e depoimentos autorais.</p>
            </div>
          </div>

        </div>

        {/* Decorative scroll button */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-70">
          <span className="text-[9px] tracking-[4px] uppercase text-gold-light mb-2">Descobrir</span>
          <div className="w-1 h-8 rounded-full bg-gold-base/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gold-light rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* 1.5. THE STORY / TRADITION SECTION */}
      <section className="py-20 md:py-32 bg-[#080808] relative overflow-hidden border-b border-gold-dark/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col">
            <span className="font-display text-xs tracking-[4px] text-gold-base uppercase mb-4">A Tradição</span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-4 leading-tight">
              O Valor de uma Parceria.<br/>
              <span className="gold-gradient-text italic font-normal">A Qualidade da Arte.</span>
            </h2>

            <div className="space-y-6 text-gray-400 font-light leading-relaxed font-sans mb-12">
              <p>
                Fundado em 2018, o Família Rocha Studio nasceu com um propósito inegociável: elevar a tatuagem ao patamar de alta cultura. São 8 anos forjando uma reputação impecável, construída sobre os pilares do respeito absoluto pela pele e pela história de cada cliente.
              </p>
              <p>
                Aqui, não entregamos apenas tinta. Entregamos uma experiência premium. Do primeiro contato ao resultado cicatrizado final, nosso ambiente é projetado para o seu conforto máximo, operando sob protocolos de biossegurança clínicos e rígidos.
              </p>
              <p>
                Carregar o sobrenome Rocha na elite da tatuagem regional é um compromisso diário com a excelência. Não fazemos cópias; desenhamos legado.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gold-dark/30">
              <div>
                <div className="text-3xl font-serif text-gold-base mb-1">2018</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Fundação</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-gold-base mb-1">5.0</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Excelência</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-gold-base mb-1">Premium</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Biossegurança</div>
              </div>
            </div>
          </div>

          {/* Instagram Interface Block - Matching Piercer Design */}
          <div className="relative mt-8 md:mt-0 flex justify-center w-full">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-gold-dark/30 bg-[#0d0d0d] shadow-2xl p-6 hover:shadow-[0_0_30px_rgba(197,155,103,0.15)] transition-all duration-500 group">
              {/* Subtle golden lighting top left */}
              <div className="absolute -top-10 -left-10 w-28 h-28 bg-[radial-gradient(circle_at_center,rgba(197,155,103,0.15)_0%,transparent_70%)] rounded-full"></div>
              
              {/* Instaprofile image header */}
              <div className="flex items-center gap-4 border-b border-white/5 pb-5">
                <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-gold-dark via-[#e24c5b] to-purple-600">
                  <div className="w-full h-full rounded-full bg-black p-0.5">
                    <div className="w-full h-full rounded-full bg-[#121212] flex items-center justify-center text-xl font-serif font-bold text-white overflow-hidden">
                      <img src={foto6} alt="Cristiano" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-sans flex items-center gap-1.5 leading-none">
                    cristiano_tattoo
                    <span className="text-gold-light text-xs shrink-0">✔</span>
                  </h4>
                  <p className="text-xs text-gray-400 font-sans mt-1">Cristiano | Tatuador Campo Verde</p>
                  <p className="text-[10px] text-gold-base uppercase tracking-widest font-bold mt-1">Nível Diamond</p>
                </div>
              </div>

              {/* Profile stats */}
              <div className="grid grid-cols-3 gap-2 text-center py-4 border-b border-white/5 my-1 text-sm bg-black/30 rounded-xl">
                <div>
                  <div className="font-bold text-white">505</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest">Postagens</div>
                </div>
                <div>
                  <div className="font-bold text-white font-mono">5.385</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest">Seguidores</div>
                </div>
                <div>
                  <div className="font-bold text-white">1.145</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest">Seguindo</div>
                </div>
              </div>

              {/* Bio Description */}
              <div className="text-xs text-gray-300 space-y-2 py-4">
                <p className="leading-relaxed">
                  ✨ <strong className="text-white">Tatuagem realista preto e cinza. Especialista em 1ª tatuagem sem arrependimento!</strong>
                </p>
                <p className="flex items-center gap-2 text-gray-400">
                  📍 <span>Av. Curitiba, 756, Centro • Campo Verde - MT</span>
                </p>
                <p className="text-[11px] text-gold-light font-bold">
                  📅 Agende a sua obra prima exclusiva
                </p>
              </div>

              {/* Real Instagram screenshot visual showcase card */}
              <div className="mt-2 aspect-[4/5] w-full rounded-lg overflow-hidden border border-white/10 relative bg-black">
                <img src={tattooFeedInsta} alt="Feed Cristiano" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#c59b67] py-2 px-3 bg-black/80 border border-gold-base/55 rounded-lg font-sans">Visitar Instagram</span>
                </div>
              </div>

              <a 
                href="https://wa.me/5566992316060?text=Ol%C3%A1+Cristiano%21+Gostaria+de+marcar+um+atendimento+para+tatuagem%21"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full py-2.5 rounded-xl border border-gold-dark/30 hover:border-gold-base bg-[#c59b67]/10 hover:bg-[#c59b67] hover:text-black flex items-center justify-center gap-2 text-xs font-bold text-gold-light uppercase tracking-wider transition-all duration-300 font-sans"
              >
                Falar diretamente com Cristiano
              </a>
            </div>
          </div>
          
        </div>
      </section>

      {/* 2. INSTITUTIONAL HIGHLIGHTS */}
      <section className="py-20 border-b border-gold-dark/20 bg-[#0c0c0c] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-display text-xs tracking-[6px] text-gold-base uppercase">Nosso Compromisso com Você</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-white mt-2">Nossos Diferenciais</h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="ornament-line max-w-[80px]"></span>
              <span className="ornament-diamond"></span>
              <span className="ornament-line max-w-[80px]"></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-bg-card border border-gold-dark/10 gold-shadow hover:border-gold-base/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-gold-dark/10 text-gold-light flex items-center justify-center mb-6 border border-gold-base/20 group-hover:bg-gold-base/20 transition-all duration-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">Arte Feita para Você</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Nenhuma tatuagem é repetida ou retirada pronta da internet. Cada desenho é planejado sobre a anatomia única de sua pele, gerando exclusividade vitalícia.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-bg-card border border-gold-dark/10 gold-shadow hover:border-gold-base/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-gold-dark/10 text-gold-light flex items-center justify-center mb-6 border border-gold-base/20 group-hover:bg-gold-base/20 transition-all duration-300">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">Segurança e Qualidade</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Salas climatizadas com alto padrão de higiene, esterilização rigorosa por autoclave e um ambiente acolhedor preparado com muito carinho para receber nossos parceiros.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-bg-card border border-gold-dark/10 gold-shadow hover:border-gold-base/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-gold-dark/10 text-gold-light flex items-center justify-center mb-6 border border-gold-base/20 group-hover:bg-gold-base/20 transition-all duration-300">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">Atendimento e Parceria</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Nossas sessões são acompanhadas de uma boa conversa, um café quentinho, atendimento humanizado e total atenção ao que você precisa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PORTFOLIO SECTION - DYNAMIC FILTERING & LIGHTBOX LAZY-LOADING */}
      <section id="portfolio-galeria" className="py-24 bg-bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <div>
              <span className="font-display text-xs tracking-[6px] text-gold-base uppercase">Catálogo Autoral</span>
              <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-white mt-1">Galeria de Obras Primas</h2>
              <p className="text-[#a47c4c] text-xs uppercase mt-2 font-semibold">Tatuagens e Piercings de Altíssima Pureza Estética</p>
            </div>
            
            <div className="flex flex-col items-end gap-3">
              {/* Elegant Bronze Filters - Style */}
              <div className="flex flex-wrap gap-2 justify-center bg-[#0e0e0e] hover:bg-[#121212] p-1.5 rounded-xl border border-gold-dark/20 transition-all duration-300">
                <button 
                  onClick={() => setActiveFilter('all')}
                  className={`py-2 px-4 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 ${activeFilter === 'all' ? 'bg-gold-base text-black font-semibold' : 'text-gray-400 hover:text-white'}`}
                >
                  Todos os Estilos
                </button>
                <button 
                  onClick={() => setActiveFilter('autoral')}
                  className={`py-2 px-4 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 ${activeFilter === 'autoral' ? 'bg-gold-base text-black font-semibold' : 'text-gray-400 hover:text-white'}`}
                >
                  Projetos Autorais
                </button>
                <button 
                  onClick={() => setActiveFilter('realismo')}
                  className={`py-2 px-4 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 ${activeFilter === 'realismo' ? 'bg-gold-base text-black font-semibold' : 'text-gray-400 hover:text-white'}`}
                >
                  Realismo
                </button>
                <button 
                  onClick={() => setActiveFilter('fineline')}
                  className={`py-2 px-4 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 ${activeFilter === 'fineline' ? 'bg-gold-base text-black font-semibold' : 'text-gray-400 hover:text-white'}`}
                >
                  Fineline
                </button>
              </div>

              {/* Elegant Bronze Filters - Body Part */}
              <div className="flex flex-wrap gap-2 justify-center bg-[#080808] p-1.5 rounded-xl border border-gold-dark/10 transition-all duration-300">
                <span className="py-2 px-3 text-[10px] text-gray-500 uppercase tracking-widest font-bold border-r border-gold-dark/20 mr-1">Local</span>
                <button 
                  onClick={() => setActiveBodyPartFilter('all')}
                  className={`py-1.5 px-3 rounded-lg text-[11px] uppercase tracking-wider transition-all duration-300 ${activeBodyPartFilter === 'all' ? 'bg-white/10 text-white font-semibold' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Qualquer
                </button>
                <button 
                  onClick={() => setActiveBodyPartFilter('costas')}
                  className={`py-1.5 px-3 rounded-lg text-[11px] uppercase tracking-wider transition-all duration-300 ${activeBodyPartFilter === 'costas' ? 'bg-white/10 text-white font-semibold' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Costas
                </button>
                <button 
                  onClick={() => setActiveBodyPartFilter('braço')}
                  className={`py-1.5 px-3 rounded-lg text-[11px] uppercase tracking-wider transition-all duration-300 ${activeBodyPartFilter === 'braço' ? 'bg-white/10 text-white font-semibold' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Braço
                </button>
                <button 
                  onClick={() => setActiveBodyPartFilter('perna')}
                  className={`py-1.5 px-3 rounded-lg text-[11px] uppercase tracking-wider transition-all duration-300 ${activeBodyPartFilter === 'perna' ? 'bg-white/10 text-white font-semibold' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Perna
                </button>
                <button 
                  onClick={() => setActiveBodyPartFilter('peito')}
                  className={`py-1.5 px-3 rounded-lg text-[11px] uppercase tracking-wider transition-all duration-300 ${activeBodyPartFilter === 'peito' ? 'bg-white/10 text-white font-semibold' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Peito
                </button>
              </div>
            </div>
          </div>

          {/* PORTFOLIO GRID - MASONRY LAYOUT */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)}
                className="group relative cursor-pointer overflow-hidden rounded-xl bg-[#0f0f0f] border border-gold-dark/15 transition-all duration-500 hover:scale-[1.02] shadow-lg break-inside-avoid"
              >
                {/* Image Container */}
                <div className="relative w-full overflow-hidden bg-black">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Dark overlay for text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent"></div>
                  
                  {/* Decorative corner brackets inside image on hover */}
                  <div className="absolute inset-4 border border-gold-base/0 group-hover:border-gold-base/30 transition-all duration-500 pointer-events-none"></div>
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-5 z-10 flex flex-col justify-end">
                  <span className="text-[10px] tracking-widest uppercase text-gold-base font-semibold mb-1">
                    {item.categoryLabel}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-gold-light transition-colors duration-300">
                    {item.title}
                  </h3>
                  <div className="h-0 group-hover:h-8 overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center gap-4 mt-2">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3" /> {item.timeSpent}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <User className="w-3" /> {item.artist}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
        </>
      )}

      {activeTab === 'piercing' && (
        <>
          {/* 1. PIERCING HERO SECTION - HIGH JEWELRY DESIGN */}
          <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-gold-dark/30 bg-radial-[at_center_center] from-[#151310] via-[#090807] to-[#040404]">
            {/* Fine background Grid overlay representing luxury wallpaper */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#c59b67_1px,transparent_1px),linear-gradient(to_bottom,#c59b67_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
            
            {/* Golden Radial glow decoration - Optimized via performance-friendly radial-gradient */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(circle_at_center,rgba(197,155,103,0.15)_0%,transparent_70%)] rounded-full pointer-events-none"></div>

            {/* Framing corners representing Victorian scrollworks */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-gold-base/40 rounded-tl-xl pointer-events-none"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-gold-base/40 rounded-tr-xl pointer-events-none"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-gold-base/40 rounded-bl-xl pointer-events-none"></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-gold-base/40 rounded-br-xl pointer-events-none"></div>

            <div className="max-w-5xl mx-auto px-6 text-center z-10 py-16 flex flex-col items-center animate-fade-in">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121212] border border-gold-base/30 mb-6">
                <Sparkles className="w-4 h-4 text-gold-light" />
                <span className="text-xs font-semibold tracking-widest text-gold-light uppercase font-sans">
                  Perfurações de Alto Padrão
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight max-w-4xl">
                Alta Joalheria, <span className="gold-gradient-text italic font-normal">Design Auricular</span> &amp; Estética
              </h1>

              <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mb-10 font-light leading-relaxed font-sans">
                Curadoria impecável comandada pela nossa especialista <strong className="text-gold-light">Crys Piercer</strong>. Peças exclusivas em Titânio de Grau Implante e Ouro 18K aplicadas com técnica asséptica e precisão milimétrica.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="#agendamento-briefing" 
                  className="py-4 px-8 rounded-lg bg-gradient-to-r from-gold-dark to-gold-base text-black font-semibold uppercase tracking-wider text-sm transition-all duration-300 hover:brightness-110 active:scale-95 hover:shadow-[0_0_25px_rgba(197,155,103,0.45)] w-full sm:w-auto text-center"
                >
                  Agendar Minha Perfuração
                </a>
                <a 
                  href="#galeria-piercing" 
                  className="py-4 px-8 rounded-lg border border-gold-base/40 text-gold-light font-semibold uppercase tracking-wider text-sm bg-black/80 transition-all duration-300 hover:bg-gold-base/10 hover:border-gold-base w-full sm:w-auto text-center"
                >
                  Ver Projetos de Sucesso
                </a>
              </div>

              {/* Specialist reference banner */}
              <div className="mt-14 p-4 rounded-xl bg-[#0d0d0d] border border-gold-dark/20 flex flex-col sm:flex-row items-center gap-4 max-w-lg shadow-2xl">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gold-base/40 shrink-0 bg-[#121212] flex items-center justify-center">
                  <span className="text-lg">💎</span>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-white font-semibold">Crys • Perfurações Campo Verde</p>
                  <p className="text-[11px] text-gray-400">Joias biocompatíveis de alta performance e fisiologia focada para cicatrização rápida.</p>
                </div>
              </div>

            </div>
          </section>

          {/* 2. PIERCER BIOGRAPHY & INSTAGRAM INSPIRED CARD */}
          <section className="py-20 md:py-32 bg-[#080808] relative overflow-hidden border-b border-gold-dark/20">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              
              <div className="flex flex-col">
                <span className="font-display text-xs tracking-[4px] text-gold-base uppercase mb-4">A Especialista</span>
                <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-white mb-4 leading-tight">
                  Design Anatomista<br/>
                  <span className="gold-gradient-text italic font-normal">por Crys Piercer</span>
                </h2>

                <div className="space-y-6 text-gray-400 font-light leading-relaxed font-sans mb-12">
                  <p>
                    Com anos de dedicação ao estudo da anatomia auricular e corporal, a nossa especialista <strong className="text-white">Crys</strong> é referência em Campo Verde em perfurações de alta precisão e cicatrizações saudáveis.
                  </p>
                  <p>
                    Para a Crys, o piercing vai muito além do furo: é um <strong className="text-gold-light">adorno corporal esculpido com exclusividade para aumentar a sua autoestima</strong>. O atendimento é baseado no respeito total à integridade de sua pele e na seleção das melhores ligas biocompatíveis do mundo.
                  </p>
                  <p>
                    Seguindo os mais rígidos protocolos de assepsia internacional, entregamos designs harmônicos, simetria exemplar e joias luxuosas que expressam sua nobreza.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gold-dark/30">
                  <div>
                    <div className="text-2xl sm:text-3xl font-serif text-gold-base mb-1">Titanium</div>
                    <div className="text-[10px] uppercase tracking-widest text-[#a47c4c] font-semibold">Biocompatível</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-serif text-gold-base mb-1">100%</div>
                    <div className="text-[10px] uppercase tracking-widest text-[#a47c4c] font-semibold">Biosseguro</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-serif text-gold-base mb-1">Curadoria</div>
                    <div className="text-[10px] uppercase tracking-widest text-[#a47c4c] font-semibold">Auricular</div>
                  </div>
                </div>
              </div>

              {/* Instagram Card Showcase */}
              <div className="relative mt-8 md:mt-0 flex justify-center">
                <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-gold-dark/30 bg-[#0d0d0d] shadow-2xl p-6 hover:shadow-[0_0_30px_rgba(197,155,103,0.15)] transition-all duration-500 group">
                  {/* Subtle golden lighting top left */}
                  <div className="absolute -top-10 -left-10 w-28 h-28 bg-[radial-gradient(circle_at_center,rgba(197,155,103,0.15)_0%,transparent_70%)] rounded-full"></div>
                  
                  {/* Instaprofile image header */}
                  <div className="flex items-center gap-4 border-b border-white/5 pb-5">
                    <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-gold-dark via-[#e24c5b] to-purple-600">
                      <div className="w-full h-full rounded-full bg-black p-0.5">
                        <div className="w-full h-full rounded-full bg-[#121212] flex items-center justify-center text-xl font-serif font-bold text-white overflow-hidden">
                          CP
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-sans flex items-center gap-1.5 leading-none">
                        crystousube.piercer
                        <span className="text-gold-light text-xs shrink-0">✔</span>
                      </h4>
                      <p className="text-xs text-gray-400 font-sans mt-1">Crys | Piercing Campo Verde</p>
                      <p className="text-[10px] text-gold-base uppercase tracking-widest font-bold mt-1">Nível Diamond</p>
                    </div>
                  </div>

                  {/* Profile stats */}
                  <div className="grid grid-cols-3 gap-2 text-center py-4 border-b border-white/5 my-1 text-sm bg-black/30 rounded-xl">
                    <div>
                      <div className="font-bold text-white">270</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest">Postagens</div>
                    </div>
                    <div>
                      <div className="font-bold text-white font-mono">3.371</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest">Seguidores</div>
                    </div>
                    <div>
                      <div className="font-bold text-white">592</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest">Seguindo</div>
                    </div>
                  </div>

                  {/* Bio Description */}
                  <div className="text-xs text-gray-300 space-y-2 py-4">
                    <p className="leading-relaxed">
                      ✨ <strong className="text-white">Viva a experiência de ter um adorno corporal para aumentar sua autoestima!</strong>
                    </p>
                    <p className="flex items-center gap-2 text-gray-400">
                      📍 <span>Av. Curitiba, 756, Centro • Campo Verde - MT</span>
                    </p>
                    <p className="text-[11px] text-gold-light font-bold">
                      📅 Agende a sua perfuração exclusiva
                    </p>
                  </div>

                  {/* Real Instagram screenshot visual showcase card */}
                  <div className="mt-2 aspect-[3/4] w-full rounded-lg overflow-hidden border border-white/10 relative bg-black">
                    <img src={piercingInsta} alt="Instagram crystousube.piercer" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs uppercase font-bold tracking-widest text-[#c59b67] py-2 px-3 bg-black/80 border border-gold-base/55 rounded-lg font-sans">Visitar Instagram</span>
                    </div>
                  </div>

                  <a 
                    href="https://wa.me/5566992316060?text=Ol%C3%A1+Crys%21+Gostaria+de+marcar+um+atendimento+de+piercing+e+joalheria%21"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full py-2.5 rounded-xl border border-gold-dark/30 hover:border-gold-base bg-[#c59b67]/10 hover:bg-[#c59b67] hover:text-black flex items-center justify-center gap-2 text-xs font-bold text-gold-light uppercase tracking-wider transition-all duration-300 font-sans"
                  >
                    Falar diretamente com a Crys
                  </a>
                </div>
              </div>
              
            </div>
          </section>

          {/* 3. DIFFERENTIALS FOR PIERCING */}
          <section className="py-20 border-b border-gold-dark/20 bg-[#0c0c0c] relative">
            <div className="max-w-7xl mx-auto px-6">
              
              <div className="text-center mb-16">
                <span className="font-display text-xs tracking-[6px] text-gold-base uppercase">Biossegurança e Pureza</span>
                <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-white mt-2">Diferenciais da Nossa Perfuração</h2>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <span className="ornament-line max-w-[80px]"></span>
                  <span className="ornament-diamond"></span>
                  <span className="ornament-line max-w-[80px]"></span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-xl bg-bg-card border border-gold-dark/10 gold-shadow hover:border-gold-base/40 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-lg bg-gold-dark/10 text-gold-light flex items-center justify-center mb-6 border border-gold-base/20 group-hover:bg-gold-base/20 transition-all duration-300">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-3">Joias Biocompatíveis</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Trabalhamos exclusivamente com Titânio de Grau Implante (ASTM F-136) e Ouro Sólido 18K. Materiais completamente isentos de níquel, evitando reações alérgicas ou granulomas indesejados.
                  </p>
                </div>

                <div className="p-8 rounded-xl bg-bg-card border border-gold-dark/10 gold-shadow hover:border-gold-base/40 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-lg bg-gold-dark/10 text-gold-light flex items-center justify-center mb-6 border border-gold-base/20 group-hover:bg-gold-base/20 transition-all duration-300">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-3">Técnica Free-Hand &amp; Conforto</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Procedimento rápido e incrivelmente confortável utilizando agulhas americanas de altíssima precisão (com bisel triplo). Sem uso de pistolas, respeitando integralmente a biologia e a anatomia.
                  </p>
                </div>

                <div className="p-8 rounded-xl bg-bg-card border border-gold-dark/10 gold-shadow hover:border-gold-base/40 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-lg bg-gold-dark/10 text-gold-light flex items-center justify-center mb-6 border border-gold-base/20 group-hover:bg-gold-base/20 transition-all duration-300">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-3">Steril-Care Hospitalar</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Utilização de autoclave clínica Classe B, ciclo completo de desinfecção termoquímica com fita indicativa biológica para certificar esterilização absoluta a cada atendimento.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* 4. PIERCING GALLERY (Interactive Carousel Spotlight & Live Database Connected Gallery) */}
          <section id="galeria-piercing" className="py-24 bg-bg-black relative border-b border-gold-dark/20">
            <div className="max-w-7xl mx-auto px-6">
              
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                  <span className="font-display text-xs tracking-[6px] text-gold-base uppercase">Curadoria Audaciosa</span>
                  <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-white mt-1">Obras de Joalheria Auricular</h2>
                  <p className="text-[#a47c4c] text-xs uppercase mt-2 font-semibold">Exemplares reais de furos cicatrizados e joias de legítimo luxo aplicados no estúdio</p>
                </div>
                
                <span className="text-[11px] py-1.5 px-3 rounded-md bg-[#0d0d0d] border border-gold-dark/30 text-gold-light uppercase tracking-widest font-sans font-bold">
                  Clínico • Luxuoso • Estético
                </span>
              </div>

              {/* 3D COVERFLOW PIERCING CAROUSEL */}
              <div className="relative group/gallery mb-24 max-w-6xl mx-auto h-[450px] sm:h-[550px] flex items-center justify-center overflow-hidden [perspective:1000px]">
                
                {/* Images */}
                <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
                  {LOCAL_PIERCING_ITEMS.map((item, index) => {
                    // Calculate offset from current active index
                    let offset = (index - piercingCarouselIndex) % LOCAL_PIERCING_ITEMS.length;
                    if (offset < -Math.floor(LOCAL_PIERCING_ITEMS.length / 2)) offset += LOCAL_PIERCING_ITEMS.length;
                    if (offset > Math.floor(LOCAL_PIERCING_ITEMS.length / 2)) offset -= LOCAL_PIERCING_ITEMS.length;

                    // Dynamic CSS transformations based on distance from center
                    // Uses Tailwind arbitrary values for inline styles
                    let transform = '';
                    let opacity = 0;
                    let zIndex = 20 - Math.abs(offset);
                    
                    if (offset === 0) {
                      transform = 'translateX(0) scale(1) translateZ(0px)';
                      opacity = 1;
                    } else if (offset === -1) {
                      transform = 'translateX(-40%) scale(0.8) translateZ(-100px)';
                      opacity = 0.6;
                    } else if (offset === 1) {
                      transform = 'translateX(40%) scale(0.8) translateZ(-100px)';
                      opacity = 0.6;
                    } else if (offset === -2) {
                      transform = 'translateX(-70%) scale(0.6) translateZ(-200px)';
                      opacity = 0.3;
                    } else if (offset === 2) {
                      transform = 'translateX(70%) scale(0.6) translateZ(-200px)';
                      opacity = 0.3;
                    } else {
                      transform = `translateX(${offset > 0 ? 90 : -90}%) scale(0.4) translateZ(-300px)`;
                      opacity = 0;
                    }

                    return (
                      <div 
                        key={item.id} 
                        onClick={() => {
                          if (offset === 0) setSelectedItem(item);
                          else setPiercingCarouselIndex(index);
                        }}
                        className={`absolute w-[260px] h-[340px] sm:w-[320px] sm:h-[420px] rounded-2xl bg-[#0f0f0f] border border-gold-dark/20 shadow-2xl transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer overflow-hidden origin-center ${offset === 0 ? 'ring-1 ring-gold-base/50 shadow-[0_0_40px_rgba(197,155,103,0.15)]' : ''}`}
                        style={{ 
                          transform, 
                          opacity, 
                          zIndex,
                          pointerEvents: opacity > 0 ? 'auto' : 'none'
                        }}
                      >
                        <div className="relative w-full h-full bg-black">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-[800ms] hover:scale-105"
                          />
                          <div className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent transition-opacity duration-500 ${offset === 0 ? 'opacity-100' : 'opacity-0'}`}></div>
                          
                          {/* Info overlay (only fully visible on active slide) */}
                          <div className={`absolute bottom-0 inset-x-0 p-5 z-10 flex flex-col justify-end transition-all duration-700 ${offset === 0 ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
                            <span className="text-[10px] tracking-widest uppercase text-gold-base font-semibold mb-1">
                              {item.categoryLabel}
                            </span>
                            <h3 className="font-serif text-xl font-bold text-white mb-2 shadow-black drop-shadow-md">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-[11px] text-gray-300 flex items-center gap-1.5 font-mono drop-shadow-md">
                                <Check className="w-3 text-gold-base" /> {item.timeSpent}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Navigation Controls */}
                <button 
                  onClick={() => setPiercingCarouselIndex((p) => (p - 1 + LOCAL_PIERCING_ITEMS.length) % LOCAL_PIERCING_ITEMS.length)}
                  className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-black/40 backdrop-blur border border-gold-dark/40 text-gold-light hover:bg-gold-base hover:text-black transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setPiercingCarouselIndex((p) => (p + 1) % LOCAL_PIERCING_ITEMS.length)}
                  className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-black/40 backdrop-blur border border-gold-dark/40 text-gold-light hover:bg-gold-base hover:text-black transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* BREAKING EMBLEM BAR */}
              <div className="flex items-center gap-4 mb-24">
                <div className="h-[1px] bg-gradient-to-r from-transparent to-gold-dark/30 flex-1"></div>
                <div className="text-gold-base/50 text-[10px] tracking-[6px] uppercase font-serif py-1 px-4 border border-gold-dark/35 rounded-full bg-[#080808]">
                  💎 Galeria Estúdio 💎
                </div>
                <div className="h-[1px] bg-gradient-to-l from-transparent to-gold-dark/30 flex-1"></div>
              </div>

              {/* PIERCING MASONRY GALLERY (Like Tattoo Gallery) */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                <div>
                  <span className="font-display text-xs tracking-[6px] text-gold-base uppercase">Catálogo Piercing</span>
                  <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-white mt-1">Acervo de Perfurações</h2>
                  <p className="text-[#a47c4c] text-xs uppercase mt-2 font-semibold">Portfólio atualizado de trabalhos de joalheria</p>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  {/* Elegant Bronze Filters - Style */}
                  <div className="flex flex-wrap gap-2 justify-center bg-[#0e0e0e] hover:bg-[#121212] p-1.5 rounded-xl border border-gold-dark/20 transition-all duration-300">
                    <button 
                      onClick={() => setDbPiercingFilter('all')}
                      className={`py-2 px-4 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 ${dbPiercingFilter === 'all' ? 'bg-gold-base text-black font-semibold' : 'text-gray-400 hover:text-white'}`}
                    >
                      Todos os Projetos
                    </button>
                    <button 
                      onClick={() => setDbPiercingFilter('orelha')}
                      className={`py-2 px-4 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 ${dbPiercingFilter === 'orelha' ? 'bg-gold-base text-black font-semibold' : 'text-gray-400 hover:text-white'}`}
                    >
                      Projetos Auriculares
                    </button>
                    <button 
                      onClick={() => setDbPiercingFilter('nariz')}
                      className={`py-2 px-4 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 ${dbPiercingFilter === 'nariz' ? 'bg-gold-base text-black font-semibold' : 'text-gray-400 hover:text-white'}`}
                    >
                      Nariz / Septo
                    </button>
                    <button 
                      onClick={() => setDbPiercingFilter('mamilo')}
                      className={`py-2 px-4 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 ${dbPiercingFilter === 'mamilo' ? 'bg-gold-base text-black font-semibold' : 'text-gray-400 hover:text-white'}`}
                    >
                      Outros Locais
                    </button>
                  </div>
                </div>
              </div>

              {/* PORTFOLIO GRID - MASONRY LAYOUT */}
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {[...LOCAL_PIERCING_ITEMS, ...dbPiercingItems].filter(item => dbPiercingFilter === 'all' || item.category === dbPiercingFilter).map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedItem(item)}
                    className="group relative cursor-pointer overflow-hidden rounded-xl bg-[#0f0f0f] border border-gold-dark/15 transition-all duration-500 hover:scale-[1.02] shadow-lg break-inside-avoid"
                  >
                    {/* Image Container */}
                    <div className="relative w-full overflow-hidden bg-black">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105"
                      />
                      {/* Subtle Dark overlay for text readability */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent"></div>
                      
                      {/* Decorative corner brackets inside image on hover */}
                      <div className="absolute inset-4 border border-gold-base/0 group-hover:border-gold-base/30 transition-all duration-500 pointer-events-none"></div>

                      <div className="absolute top-4 left-4 py-1 px-2.5 rounded bg-black/60 border border-gold-dark/30 text-[9px] text-gold-light font-bold uppercase tracking-widest z-10">
                        {item.categoryLabel || 'Piercing'}
                      </div>
                    </div>

                    {/* Info Overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-5 z-10 flex flex-col justify-end">
                      <span className="text-[10px] tracking-widest uppercase text-gold-base font-semibold mb-1">
                        {item.categoryLabel}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-white group-hover:text-gold-light transition-colors duration-300">
                        {item.title}
                      </h3>
                      <div className="h-0 group-hover:h-8 overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center gap-4 mt-2">
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3" /> {item.timeSpent}
                        </span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <User className="w-3" /> {item.artist}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>
        </>
      )}

      {/* 4. LIGHTBOX MODAL (Pure modern React JS implementation of the elegant popover) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 transition-all duration-500 animate-fade-in">
          {/* Close click blocker */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedItem(null)}></div>
          
          <div className="relative w-full max-w-4xl bg-bg-card rounded-2xl border border-gold-base overflow-hidden shadow-[0_0_50px_rgba(197,155,103,0.3)] z-10 flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Close button */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 border border-gold-base text-gold-light hover:bg-gold-base hover:text-black transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Image Side */}
            <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-auto">
              <img 
                src={selectedItem.imageUrl} 
                alt={selectedItem.title} 
                className="w-full h-full object-cover max-h-[45vh] md:max-h-full"
              />
              <div className="absolute top-4 left-4 py-1 px-3 rounded-md bg-black/70 border border-gold-dark/40 text-[10px] text-gold-light font-bold tracking-widest uppercase">
                {selectedItem.categoryLabel}
              </div>
            </div>

            {/* Right Information Side */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-full bg-radial-[at_top_right] from-[#1a1a1a] via-[#121212] to-[#121212] border-l border-gold-base/20">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mb-3">
                  {selectedItem.title}
                </h3>
                <div className="flex gap-4 mb-6 pb-4 border-b border-gold-dark/20 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold-base" /> {selectedItem.timeSpent}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gold-base" /> {selectedItem.artist}
                  </span>
                </div>
                
                <h4 className="text-xs uppercase tracking-widest text-gold-light font-bold mb-2">Concepção do Projeto</h4>
                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  {selectedItem.description}
                </p>
                
                {/* Meta details */}
                <div className="p-4 rounded-xl bg-black/40 border border-gold-dark/10 mb-6">
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-2">Estilos e Agendamento</p>
                  <p className="text-xs text-gray-300">Este trabalho é inteiramente autoral. É possível agendar um briefing similar adaptado com exclusividade para você.</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handlePreFillStyle(selectedItem)}
                  className="w-full py-3.5 rounded-lg bg-gradient-to-r from-gold-dark to-gold-base text-black font-bold uppercase tracking-wider text-xs transition-transform duration-300 hover:brightness-110 shadow-lg active:scale-95"
                >
                  Fazer Briefing desse Estilo
                </button>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-3 rounded-lg border border-gold-dark/30 hover:border-gold-base text-xs text-gray-400 hover:text-white bg-transparent transition-all duration-300"
                >
                  Voltar para a Galeria
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. BRIEFING ENGINE & BOOKING FORM with Calendar Grid block checker */}
      <section id="agendamento-briefing" className="py-24 bg-[#0a0a0a] border-t border-gold-dark/20 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className="font-display text-xs tracking-[6px] text-gold-base uppercase">Portal de Agendamento</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-white mt-2">
              {activeTab === 'tattoo' ? 'Briefing de Elite Autoral' : 'Agendamento de Perfuração de Elite'}
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="ornament-line max-w-[80px]"></span>
              <span className="ornament-diamond"></span>
              <span className="ornament-line max-w-[80px]"></span>
            </div>
            <p className="text-gray-400 text-sm max-w-xl mx-auto mt-4 leading-relaxed font-sans">
              {activeTab === 'tattoo' 
                ? 'Insira as informações preliminares sobre a sua obra-prima dos sonhos. Nosso CEO analisará o seu briefing para verificar a viabilidade da sessão e entrará em contato via WhatsApp.'
                : 'Selecione suas preferências e agende o design auricular de seus sonhos com a nossa especialista Crys Piercer. Garantia de materiais hipoalergênicos de grau implante.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left side: Guide Info */}
            <div className="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-8">
              <div className="p-6 rounded-xl bg-bg-card border border-gold-dark/15 gold-shadow">
                <h3 className="font-serif text-xl font-bold text-white mb-4">Como funciona?</h3>
                <div className="flex flex-col gap-6">
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gold-dark/20 text-gold-light border border-gold-base flex items-center justify-center shrink-0 font-serif font-bold text-xs">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Escolha do Dia</h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">Selecione uma data disponível (em dourado) no nosso calendário oficial de junho/2026. Dias restritos e ocupados estão trancados pelo CEO.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gold-dark/20 text-gold-light border border-gold-base flex items-center justify-center shrink-0 font-serif font-bold text-xs">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {activeTab === 'tattoo' ? 'Descrição do Conceito' : 'Escolha da Joia & Região'}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {activeTab === 'tattoo' 
                          ? 'Detalhe todos os elementos da mensagem que quer passar. Envie o estilo de tatuagem (ex: Blackwork, Fineline, Oriental).'
                          : 'Selecione o local (ex: Helix, Conch, Septo) e o material nobre da joia (Titânio de Grau Implante ou Ouro 18K).'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gold-dark/20 text-gold-light border border-gold-base flex items-center justify-center shrink-0 font-serif font-bold text-xs">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {activeTab === 'tattoo' ? 'Selo de Viabilidade' : 'Selo de Biossegurança'}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {activeTab === 'tattoo' 
                          ? 'O nosso CEO validará o briefing na central interna do estúdio e retornará via WhatsApp aprovando a composição da arte!'
                          : 'A nossa especialista Crys Piercer preparará o setup estéril individual e confirmará o seu procedimento via WhatsApp!'}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Studio Live Contacts Card */}
              <div className="p-6 rounded-xl bg-[#0e0e0e] border border-gold-dark/10">
                <h4 className="text-xs uppercase tracking-widest text-gold-light font-bold mb-4">Funcionamento e Contatos</h4>
                <div className="space-y-3.5 text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gold-base shrink-0" />
                    <span>Rua Imperial Vitoriana, 350 - Família Rocha Studio</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gold-base shrink-0" />
                    <span>WhatsApp Oficial: 66 99231 6060 / 66 99691 7408</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gold-base shrink-0" />
                    <span>Terça a Sábado: 10:00 às 19:00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Luxurious Interactive Form */}
            <div className="lg:col-span-8 p-8 rounded-2xl bg-bg-card border border-gold-base/30 text-white shadow-2xl relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold-base/10 to-transparent pointer-events-none rounded-tr-2xl"></div>
              
              {formSuccess ? (
                <div className="py-12 px-4 flex flex-col items-center text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-gold-base/10 text-gold-light border border-gold-base flex items-center justify-center mb-6">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">Briefing Recebido com Sucesso!</h3>
                  <p className="text-sm text-gray-400 max-w-lg leading-relaxed mb-4">
                    A sua proposta de arte corporal premium foi registrada e enviada à central do estúdio. O CEO Cristiano Rocha analisará seu pedido na central de faturamento e entrará em contato via WhatsApp com um rascunho de orçamento!
                  </p>
                  {submittedDate && (
                    <div className="mb-6 p-4 rounded-xl bg-gold-base/10 border border-gold-base/30 max-w-md w-full">
                      <span className="text-[10px] text-gold-light uppercase tracking-widest font-bold">Reserva Solicitada</span>
                      <div className="text-lg text-white font-serif font-bold mt-1">
                        📅 Dia {submittedDate} às {submittedTime} 🕒
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">O horário está agora pré-bloqueado contra outros clientes.</p>
                    </div>
                  )}
                  <p className="text-xs text-gold-light uppercase tracking-wider font-bold">Reservo o seu dia em segurança em nossa agenda real.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {formError && (
                    <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/50 text-red-300 text-xs font-semibold">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase tracking-widest text-gold-light font-bold mb-3">Modalidade do Agendamento</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setTattooType('autoral')}
                          className={`p-4 rounded-xl border text-left transition-all ${tattooType === 'autoral' ? 'bg-gold-base/10 border-gold-base' : 'bg-[#080808]/70 border-gold-dark/30 hover:border-gold-base/50'}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-3 h-3 rounded-full ${tattooType === 'autoral' ? 'bg-gold-light shadow-[0_0_8px_#c59b67]' : 'bg-gray-600'}`}></div>
                            <span className={`font-serif font-bold ${tattooType === 'autoral' ? 'text-gold-light' : 'text-gray-300'}`}>
                              {activeTab === 'tattoo' ? 'Projeto Autoral' : 'Ear Project / Curadoria'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed ml-5">
                            {activeTab === 'tattoo'
                              ? 'Desenhos criados do zero, exclusivos e sob medida. Estudo minucioso da anatomia com o selo Rocha de excelência.'
                              : 'Composição múltipla com design personalizado combinando brincos e furos nobres sob medida para a sua orelha.'}
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTattooType('padrao')}
                          className={`p-4 rounded-xl border text-left transition-all ${tattooType === 'padrao' ? 'bg-gold-base/10 border-gold-base' : 'bg-[#080808]/70 border-gold-dark/30 hover:border-gold-base/50'}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-3 h-3 rounded-full ${tattooType === 'padrao' ? 'bg-gold-light shadow-[0_0_8px_#c59b67]' : 'bg-gray-600'}`}></div>
                            <span className={`font-serif font-bold ${tattooType === 'padrao' ? 'text-gold-light' : 'text-gray-300'}`}>
                              {activeTab === 'tattoo' ? 'Tatuagem Padrão' : 'Perfuração Unitária'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed ml-5">
                            {activeTab === 'tattoo'
                              ? 'Agendamento rápido para desenhos já estabelecidos, flashes do estúdio ou ideias simples e diretas.'
                              : 'Furo único e preciso (ex: Helix, Conch, Septo ou Lóbulo) com assepsia rigorosa e joalheria padrão.'}
                          </p>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold-light font-bold mb-2">Seu Nome Completo</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: João da Silva Rocha"
                        className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-sm outline-none placeholder:text-gray-600 transition-all focus:ring-1 focus:ring-gold-base/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold-light font-bold mb-2">Celular WhatsApp</label>
                      <input 
                        type="tel" 
                        required
                        value={whatsapp}
                        onChange={handleWhatsappChange}
                        placeholder="(66) 99999-9999"
                        className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-sm outline-none placeholder:text-gray-600 transition-all focus:ring-1 focus:ring-gold-base/50"
                      />
                      <span className="text-[10px] text-gray-500 mt-1 block">Prefira WhatsApp ativo do celular para contato imediato.</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold-light font-bold mb-2">
                        {activeTab === 'tattoo' ? 'Estilo Principal' : 'Tipo de Procedimento'}
                      </label>
                      {activeTab === 'tattoo' ? (
                        <select 
                          required
                          value={selectedStyle}
                          onChange={(e) => setSelectedStyle(e.target.value)}
                          className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-sm outline-none transition-all focus:ring-1 focus:ring-gold-base/50 cursor-pointer"
                        >
                          <option value="">Selecione o seu estilo predominante...</option>
                          <option value="Blackwork Autoral">Blackwork / Rastelado</option>
                          <option value="Fineline Autoral">Fineline / Traço Fino</option>
                          <option value="Realismo Preto e Cinza">Realismo Preto e Cinza</option>
                          <option value="Guerreira Indígena & Lobo">Guerreira Indígena &amp; Lobo (Blackwork)</option>
                          <option value="Retrato Cósmico Abstrato">Retrato Cósmico Abstrato (Colorido)</option>
                          <option value="A Santa Ceia Nobre">A Santa Ceia Nobre (Sleeve)</option>
                          <option value="Piercing sob encomenda">Piercing e Joalheria</option>
                          <option value="Outro Conceito Autoral">Outro Conceito / Personalizado</option>
                        </select>
                      ) : (
                        <select 
                          required
                          value={selectedStyle}
                          onChange={(e) => setSelectedStyle(e.target.value)}
                          className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-sm outline-none transition-all focus:ring-1 focus:ring-gold-base/50 cursor-pointer"
                        >
                          <option value="">Selecione o tipo de piercing...</option>
                          <option value="Perfuração Orelha Completa (Lobos/Cartilagens)">Projeto Auricular (Vários Furos Coordenados)</option>
                          <option value="Piercing de Cartilagem (Helix, Conch, Tragus, Scapha)">Hélix / Conch / Tragus (Individual)</option>
                          <option value="Piercing de Lóbulo (Tradicional / Triplo)">Lóbulo Tradicional ou Triplo</option>
                          <option value="Piercing de Nariz (Nostril / Septo)">Nariz / Nostril / Septo Cravejado</option>
                          <option value="Piercing de Boca/Labial (Labret / Medusa / Smile)">Boca / Lábio / Medusa / Smile</option>
                          <option value="Microdermal / Joalheria de Superfície">Microdermal Imperial de Superfície</option>
                          <option value="Piercing sob encomenda">Furo com Joalheria sob Encomenda Especial</option>
                        </select>
                      )}
                    </div>

                    <div>
                      {activeTab === 'tattoo' ? (
                        <>
                          <label className="block text-xs uppercase tracking-widest text-gold-light font-bold mb-2">Tamanho Estimado (cm)</label>
                          <input 
                            type="number"
                            min="2"
                            max="100"
                            required
                            value={tattooSizeCm}
                            onChange={(e) => setTattooSizeCm(parseInt(e.target.value) || 10)}
                            className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-sm outline-none transition-all focus:ring-1 focus:ring-gold-base/50"
                          />
                        </>
                      ) : (
                        <>
                          <label className="block text-xs uppercase tracking-widest text-gold-light font-bold mb-2">Material Desejado da Joia</label>
                          <select 
                            required
                            value={piercingMaterial}
                            onChange={(e) => setPiercingMaterial(e.target.value)}
                            className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-sm outline-none transition-all focus:ring-1 focus:ring-gold-base/50 cursor-pointer"
                          >
                            <option value="titanio">Titânio ASTM F-136 Grau Implante (Livre de Níquel / Refinado)</option>
                            <option value="ouro">Ouro Sólido Nobre Imperial 18K (+ R$ 250)</option>
                            <option value="aço">Aço Cirúrgico Biológico Estéril 316L</option>
                          </select>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold-light font-bold mb-2">Local do Corpo</label>
                      {activeTab === 'tattoo' ? (
                        <select 
                          required
                          value={bodyPart}
                          onChange={(e) => setBodyPart(e.target.value)}
                          className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-sm outline-none transition-all focus:ring-1 focus:ring-gold-base/50 cursor-pointer"
                        >
                          <option value="braço">Braço / Antebraço / Ombro</option>
                          <option value="perna">Perna / Coxa / Panturrilha</option>
                          <option value="costas">Costas Inteiras / Escápula</option>
                          <option value="peito">Peito / Clavícula</option>
                          <option value="costela">Costela / Abdômen</option>
                          <option value="pescoço">Pescoço / Rosto</option>
                          <option value="mão">Mão / Dedo / Pé</option>
                        </select>
                      ) : (
                        <select 
                          required
                          value={bodyPart}
                          onChange={(e) => setBodyPart(e.target.value)}
                          className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-sm outline-none transition-all focus:ring-1 focus:ring-gold-base/50 cursor-pointer"
                        >
                          <option value="orelha">Orelha (Cartilagem / Lóbulo / Daith, etc.)</option>
                          <option value="nariz">Nariz (Abas / Septo)</option>
                          <option value="boca">Boca / Lábio / Medusa</option>
                          <option value="sobrancelha">Sobrancelha</option>
                          <option value="mamilo">Mamilo ou Umbigo</option>
                          <option value="outro">Outra Região Anatômica</option>
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold-light font-bold mb-2">
                        {activeTab === 'tattoo' ? 'Nível de Complexidade' : 'Complexidade do Canal'}
                      </label>
                      {activeTab === 'tattoo' ? (
                        <select 
                          required
                          value={tattooComplexity}
                          onChange={(e) => setTattooComplexity(e.target.value)}
                          className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-sm outline-none transition-all focus:ring-1 focus:ring-gold-base/50 cursor-pointer"
                        >
                          <option value="simples">Sólido / Simplificado</option>
                          <option value="medio">Sombreamento Médio / Blackwork</option>
                          <option value="avancado">Detalhado / Texturizado</option>
                          <option value="masterpiece">Obra Prima / Realismo Micro</option>
                        </select>
                      ) : (
                        <select 
                          required
                          value={tattooComplexity}
                          onChange={(e) => setTattooComplexity(e.target.value)}
                          className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-sm outline-none transition-all focus:ring-1 focus:ring-gold-base/50 cursor-pointer"
                        >
                          <option value="simples">Perfuração Comum (Lóbulo)</option>
                          <option value="medio">Perfuração Avançada de Cartilagem (Helix, Conch, Tragus)</option>
                          <option value="avancado">Perfuração Simultânea Coordenada (Industrial / Simétricos)</option>
                          <option value="masterpiece">Projeto Auricular Completo Personalizado (Ear Project)</option>
                        </select>
                      )}
                    </div>
                  </div>

                  {/* ANAMNESE MEDICAL FORM */}
                  <div className="p-5 rounded-lg border border-red-900/30 bg-red-950/10">
                    <h4 className="text-xs uppercase tracking-widest text-red-400 font-bold mb-4 flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Ficha de Anamnese Obrigatória
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                      <div>
                        <label className="block text-[10px] uppercase text-gray-400 mb-1">Histórico de Problemas de Pele / Cicatrização Mágica?</label>
                        <textarea
                          rows={2}
                          value={medicalHistory}
                          onChange={(e) => setMedicalHistory(e.target.value)}
                          placeholder="Kelóides, vitiligo, dermatite..."
                          className="w-full bg-[#080808]/70 border border-gold-dark/30 rounded-lg p-3 text-white text-xs outline-none transition-all focus:border-red-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-gray-400 mb-1">Alergias Relevantes (Pigmento/Látex/Pomadas)</label>
                        <textarea
                          rows={2}
                          value={allergies}
                          onChange={(e) => setAllergies(e.target.value)}
                          placeholder="Sem alergias..."
                          className="w-full bg-[#080808]/70 border border-gold-dark/30 rounded-lg p-3 text-white text-xs outline-none transition-all focus:border-red-500/50"
                        />
                      </div>
                    </div>
                    
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        required
                        checked={consentAccepted}
                        onChange={(e) => setConsentAccepted(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-red-500 rounded border-gray-700 bg-black cursor-pointer" 
                      />
                      <span className="text-[10px] text-gray-400 leading-relaxed font-sans cursor-pointer group-hover:text-gray-300">
                        Eu declaro sob minha honra que não possuo doenças impeditivas e que aceito o <strong>Termo de Responsabilidade e Consentimento Eletrônico</strong> do Família Rocha Studio, isentando a casa de má gestão de cicatrização no aftercare domiciliar.
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center bg-[#080808]/80 p-5 rounded-lg border border-gold-dark/20">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold-light font-bold mb-2">Dia e Horário Selecionado</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          readOnly
                          required
                          value={selectedDate ? `${selectedDate.split('-')[2]}/${selectedDate.split('-')[1]}/${selectedDate.split('-')[0]}${selectedTime ? ` às ${selectedTime}` : ' (Selecione o horário abaixo 🕒)'}` : ''}
                          placeholder="Escolha no calendário abaixo 📅"
                          className="w-full bg-[#0c0c0c]/40 border border-gold-dark/20 text-gold-light rounded-lg py-3 px-4 text-sm font-semibold text-center sm:text-left outline-none cursor-not-allowed text-ellipsis overflow-hidden whitespace-nowrap"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center sm:items-end justify-center">
                      <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">Orçamento Estimado*</span>
                      <div className="text-3xl font-serif text-gold-light font-bold">
                        R$ {estimatedBudget}<span className="text-sm font-sans text-gray-500 font-normal">,00</span>
                      </div>
                      <span className="text-[9px] text-gray-500 text-right mt-1">*Valor sujeito a alteração na avaliação presencial.</span>
                    </div>
                  </div>

                  {/* INTERACTIVE CALENDAR GRID */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-xs uppercase tracking-widest text-gold-light font-bold">
                        Calendário Oficial do Estúdio: <span className="text-white font-serif tracking-normal text-sm ml-1">Junho 2026</span>
                      </label>
                      <div className="flex gap-4 text-[10px]">
                        <span className="flex items-center gap-1 text-gray-500">
                          <span className="w-2.5 h-2.5 bg-[#181818] rounded-sm inline-block"></span> Passado
                        </span>
                        <span className="flex items-center gap-1 text-[#c59b67]">
                          <span className="w-2.5 h-2.5 bg-[#0d0d0d] border border-gold-base/50 rounded-sm inline-block"></span> Livre
                        </span>
                        <span className="flex items-center gap-1 text-red-400">
                          <span className="w-2.5 h-2.5 bg-red-950/60 border border-red-500/40 rounded-sm inline-block"></span> Ocupado / CEO Lock
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 sm:gap-2 bg-[#080808]/80 p-2 sm:p-4 rounded-xl border border-gold-dark/20">
                      {/* Weekday headers */}
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                        <div key={day} className="text-center text-[10px] uppercase font-bold text-gold-dark py-1">
                          {day}
                        </div>
                      ))}
                      
                      {/* June days */}
                      {juneDays.map((item) => {
                        if (item.empty) {
                          return <div key={item.key} className="aspect-square bg-transparent"></div>;
                        }

                        let btnClass = "relative aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-semibold select-none transition-all ";
                        let label = item.day ? item.day.toString() : '';
                        let isDisabled = false;

                        if (item.isPast) {
                          btnClass += "bg-[#181818]/40 text-gray-700 cursor-not-allowed border border-transparent";
                          isDisabled = true;
                        } else if (item.isBlocked) {
                          btnClass += "bg-red-950/20 text-red-500 border border-red-950/60 cursor-not-allowed hover:bg-red-950/30";
                          isDisabled = true;
                        } else {
                          // Day is available!
                          const isSelected = selectedDate === item.dateString;
                          if (isSelected) {
                            btnClass += "bg-gold-base text-black border-2 border-white font-bold scale-102 shadow-[0_0_15px_rgba(197,155,103,0.5)]";
                          } else {
                            btnClass += "bg-[#0c0c0c] text-white border border-gold-dark/20 hover:border-gold-base active:scale-95";
                          }
                        }

                        return (
                          <button
                            type="button"
                            key={item.key}
                            disabled={isDisabled}
                            onClick={() => {
                              if (item.dateString) {
                                setSelectedDate(item.dateString);
                                setSelectedTime('');
                              }
                            }}
                            className={btnClass}
                            title={item.isBlocked ? 'Data reservada ou bloqueada' : `Agendar no dia ${item.day}`}
                          >
                            <span>{label}</span>
                            {item.isBlocked && !item.isPast && (
                              <Lock className="w-2.5 h-2.5 text-red-400 absolute bottom-1 right-1" />
                            )}
                            {selectedDate === item.dateString && (
                              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* SELECTABLE TIME SLOTS UNDER THE CALENDAR */}
                    {selectedDate && (
                      <div className="mt-5 p-4 rounded-xl bg-black/45 border border-gold-dark/20 animate-fade-in">
                        <label className="block text-xs uppercase tracking-widest text-[#c59b67] font-bold mb-3 flex items-center gap-1.5">
                          <span>🕒 Escolha seu horário para o dia {selectedDate.split('-').reverse().join('/')}:</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          {timeSlots.map((slot) => {
                            const isAlreadyBooked = bookings.some(b => b.date === selectedDate && b.time === slot && b.status !== 'cancelado');
                            const isBlockedByCEO = (blockedSlots[selectedDate] || []).includes(slot);
                            const isOccupied = isAlreadyBooked || isBlockedByCEO;
                            const isSelected = selectedTime === slot;

                            let sBtnClass = "py-3 px-2 rounded-lg text-center transition-all flex flex-col items-center justify-center border text-xs ";
                            if (isOccupied) {
                              sBtnClass += "bg-red-950/10 text-red-500/70 border-red-950/30 cursor-not-allowed";
                            } else if (isSelected) {
                              sBtnClass += "bg-gradient-to-r from-gold-dark to-gold-base text-black font-bold border-white scale-102 shadow-[0_0_12px_rgba(197,155,103,0.3)]";
                            } else {
                              sBtnClass += "bg-bg-black text-white hover:text-gold-light border-gold-dark/20 hover:border-gold-base/50 active:scale-95 cursor-pointer";
                            }

                            return (
                              <button
                                type="button"
                                key={slot}
                                disabled={isOccupied}
                                onClick={() => setSelectedTime(slot)}
                                className={sBtnClass}
                                title={isOccupied ? "Horário indisponível ou já reservado" : `Selecionar ${slot}`}
                              >
                                <span className="font-mono text-xs font-bold">{slot}</span>
                                <span className="text-[8px] uppercase tracking-wider font-bold opacity-75 mt-0.5">
                                  {isOccupied ? 'Ocupado' : isSelected ? 'Escolhido' : 'Disponível'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gold-light font-bold mb-2">Descreva a Idéia do seu Projeto Autoral</label>
                    <textarea 
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Fale um pouco sobre o tamanho exato desejado, local do corpo (Ex: fechar antebraço, panturrilha), se será colorido ou P&B, referências e a sua ideia base..."
                      className="w-full bg-[#080808]/70 border border-gold-dark/30 focus:border-gold-base rounded-lg py-3 px-4 text-white text-sm outline-none placeholder:text-gray-600 transition-all focus:ring-1 focus:ring-gold-base/50 font-sans"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gold-light font-bold mb-2">Anexar Imagem de Referência (Opcional)</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="w-full bg-[#080808]/70 border border-dashed border-gold-dark/40 hover:border-gold-base/60 rounded-lg py-4 px-4 text-center transition-all flex flex-col items-center justify-center gap-2">
                        {referenceImage ? (
                          <div className="flex flex-col items-center">
                            <img src={referenceImage} alt="Referência" className="h-20 object-contain rounded-md mb-2 border border-gold-dark/30" />
                            <span className="text-[10px] text-gold-light uppercase font-bold text-center">Imagem Anexada (Clique para trocar)</span>
                          </div>
                        ) : (
                          <>
                            <ImagePlus className="w-6 h-6 text-gold-dark" />
                            <span className="text-xs text-gray-400 font-sans">Toque para selecionar imagem da galeria...</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-4 rounded-lg bg-gradient-to-r from-gold-dark to-gold-base text-black font-extrabold uppercase tracking-wider text-sm transition-transform duration-300 hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(197,155,103,0.45)] select-none cursor-pointer"
                  >
                    Encaminhar Briefing Imperioso para o CEO
                  </button>

                  <p className="text-[10px] text-center text-gray-500 uppercase leading-relaxed mt-4">
                    Ao enviar, seu briefing é sintonizado via <strong className="text-gold-light">LocalStorage</strong> e estará visível imediatamente no painel administrativo do CEO.
                  </p>
                </form>
              )}
            </div>

          </div>

          {/* GOOGLE CUSTOMER REVIEW ROTATOR */}
          <div className="mt-24 pt-16 border-t border-gold-dark/15">
            <div className="text-center mb-10">
              <span className="font-display text-[10px] tracking-[6px] text-gold-base uppercase">Voz dos Conselhos</span>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">O que dizem os Clientes Imperiais</h3>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-8 rounded-xl bg-bg-card border border-gold-dark/10 text-center relative gold-shadow">
              <div className="absolute top-4 left-4 text-gold-dark opacity-10 font-serif text-6xl">“</div>
              <div className="absolute bottom-4 right-4 text-gold-dark opacity-10 font-serif text-6xl">”</div>
              
              <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-gold-base text-gold-base" />
                ))}
              </div>

              <p className="text-base text-white font-light italic leading-relaxed mb-6">
                {GOOGLE_REVIEWS[reviewIndex].text}
              </p>

              <div>
                <h4 className="text-sm font-bold text-gold-light font-display">
                  {GOOGLE_REVIEWS[reviewIndex].name}
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">{GOOGLE_REVIEWS[reviewIndex].date} | Avaliação Google Local Guide</p>
              </div>

              <div className="flex justify-center gap-2 mt-6">
                {GOOGLE_REVIEWS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setReviewIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full border transition-all ${idx === reviewIndex ? 'bg-gold-base border-gold-base' : 'bg-transparent border-gray-600'}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      <TestimonialsFAQ />

      {/* FOOTER */}
      <footer className="py-12 bg-bg-black border-t border-gold-dark/20 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-display tracking-[3px] text-gold-light text-sm mb-4">FAMÍLIA ROCHA STUDIO</p>
          <p className="mb-2">Soberania, Projetos Autorais e Elite desde 2018. Todos os direitos reservados.</p>
          <p className="text-[#a47c4c]">São Bento protect us. Designed to Perfection.</p>
        </div>
      </footer>

      {/* Floating gilded WhatsApp Button */}
      <a 
        href="https://wa.me/5566992316060?text=Ol%C3%A1%21+Gostaria+de+um+briefing+com+Cristiano+Rocha+para+um+projeto+de+tatuagem+autoral%21" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-gold-dark to-gold-base p-0.5 flex items-center justify-center select-none pointer-events-auto shadow-xl transition-all duration-300 hover:scale-[1.08]"
        title="Falar no WhatsApp"
      >
        <div className="w-full h-full rounded-full bg-[#0d0d0d] flex items-center justify-center text-gold-light hover:text-white transition-colors duration-300">
          <MessageSquare className="w-6 h-6 shrink-0" />
        </div>
      </a>

    </div>
  );
}
