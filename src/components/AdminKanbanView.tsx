import React, { useState } from 'react';
import { Booking } from '../types';
import { Clock, CheckCircle, CircleDashed, User, Calendar, MessageSquare } from 'lucide-react';

interface AdminKanbanViewProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: 'confirmado' | 'cancelado' | 'pendente' | 'concluido') => void;
}

export default function AdminKanbanView({ bookings, onUpdateStatus }: AdminKanbanViewProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const pendentes = bookings.filter(b => b.status === 'pendente');
  const confirmados = bookings.filter(b => b.status === 'confirmado');
  const concluidos = bookings.filter(b => b.status === 'concluido');

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: 'pendente' | 'confirmado' | 'concluido') => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedId;
    if (id) {
      onUpdateStatus(id, newStatus);
    }
    setDraggedId(null);
  };

  const openWhatsAppConfirmation = (booking: Booking) => {
    const text = `Olá ${booking.name}, recebemos seu interesse na modalidade ${booking.tattooType || 'Autoral'}. Gostaria de confirmar seu projeto para o dia ${booking.date.split('-').reverse().join('/')}?`;
    window.open(`https://wa.me/${booking.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const openWhatsAppScheduled = (booking: Booking) => {
    const text = `Olá ${booking.name}! Seu projeto ${booking.tattooType || 'Autoral'} está 100% confirmado na agenda para o dia ${booking.date.split('-').reverse().join('/')}. Te aguardo no estúdio Rocha!`;
    window.open(`https://wa.me/${booking.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const openWhatsAppAftercare = (booking: Booking) => {
    const text = `Olá ${booking.name}! Parabéns pela nova obra prima. Lembre-se do nosso protocolo de cicatrização: lavar com sabonete neutro após 48h, hidratar camada bem fina e evitar sol/mar/piscina. Qualquer dúvida o Família Rocha Studio está à disposição!`;
    window.open(`https://wa.me/${booking.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const KanbanColumn = ({ 
    title, 
    items, 
    badgeColor, 
    icon: Icon,
    statusId 
  }: { 
    title: string, 
    items: Booking[], 
    badgeColor: string, 
    icon: any,
    statusId: 'pendente' | 'confirmado' | 'concluido'
  }) => (
    <div 
      className="flex-1 min-w-[300px] flex flex-col bg-[#0e0e0e] rounded-xl border border-gold-dark/10 p-4 shrink-0 h-full max-h-full transition-all"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, statusId)}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gold-dark/20">
        <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
          <Icon className={`w-4 h-4 ${badgeColor}`} /> {title}
        </h3>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-[#141414] border border-gold-dark/20 ${badgeColor}`}>{items.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar min-h-[400px]">
        {items.length === 0 ? (
          <div className="text-center p-6 border border-dashed border-gray-800 rounded-lg text-gray-600 text-xs uppercase font-bold tracking-widest h-full flex items-center justify-center pointer-events-none">
            Soltar Projetos Aqui
          </div>
        ) : (
          items.map(b => (
            <div 
              key={b.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, b.id)}
              onDragEnd={handleDragEnd}
              className={`bg-bg-card p-4 rounded-lg border cursor-grab active:cursor-grabbing transition-all shadow-md group ${draggedId === b.id ? 'opacity-50 scale-95 border-gold-base' : 'border-gold-dark/30 hover:border-gold-base/50'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-white max-w-[150px] truncate pointer-events-none">{b.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-black border border-gold-base/30 text-gold-light font-bold pointer-events-none">R$ {b.value}</span>
              </div>
              <p className="text-[10px] text-gray-500 mb-3 line-clamp-2 leading-relaxed font-sans pointer-events-none">{b.description || 'Sem detalhes fornecidos.'}</p>
              
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider text-gray-400 mb-3 border-b border-gray-800 pb-2 pointer-events-none">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {b.date.split('-').reverse().join('/')}</span>
                <span className="flex items-center gap-1 ml-auto text-gold-base"><User className="w-3 h-3" /> {b.style.split(' ')[0]}</span>
              </div>

              {/* Action Buttons specific to column */}
              {statusId === 'pendente' && (
                <button 
                  onClick={() => openWhatsAppConfirmation(b)}
                  className="w-full py-1.5 rounded flex items-center justify-center gap-2 bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-[10px] uppercase font-bold tracking-widest hover:bg-[#25D366]/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3 h-3" />
                  Mensagem Avaliação
                </button>
              )}
              {statusId === 'confirmado' && (
                <button 
                  onClick={() => openWhatsAppScheduled(b)}
                  className="w-full py-1.5 rounded flex items-center justify-center gap-2 bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-[10px] uppercase font-bold tracking-widest hover:bg-[#25D366]/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3 h-3" />
                  Avisar Agendamento
                </button>
              )}
              {statusId === 'concluido' && (
                <button 
                  onClick={() => openWhatsAppAftercare(b)}
                  className="w-full py-1.5 rounded flex items-center justify-center gap-2 bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-[10px] uppercase font-bold tracking-widest hover:bg-[#25D366]/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3 h-3" />
                  Botão Mágico: Aftercare
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 mt-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-3">
          <span className="w-2 h-8 bg-gold-base rounded-full"></span>
          CRM de Fechamentos (Drag & Drop)
        </h2>
        <p className="text-xs text-gray-500 mt-1 pl-5">Gerencie o pipeline de vendas de tatuagem e piercing. Arraste as oportunidades (Leads) entre as etapas do funil de conversão.</p>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar items-stretch h-[600px]">
        <KanbanColumn 
          title="1. Briefings em Análise" 
          items={pendentes} 
          badgeColor="text-amber-500" 
          icon={CircleDashed} 
          statusId="pendente"
        />
        <KanbanColumn 
          title="2. Sessões Agendadas" 
          items={confirmados} 
          badgeColor="text-blue-400" 
          icon={Clock} 
          statusId="confirmado"
        />
        <KanbanColumn 
          title="3. Obras Entregues (Pós-Venda)" 
          items={concluidos} 
          badgeColor="text-green-500" 
          icon={CheckCircle} 
          statusId="concluido"
        />
      </div>
    </div>
  );
}
