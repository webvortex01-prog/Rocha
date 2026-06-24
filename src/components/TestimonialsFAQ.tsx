import React, { useState } from 'react';
import { Quote, ChevronDown, ChevronUp, Droplet, Sun, Wind } from 'lucide-react';

export default function TestimonialsFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Qual o valor base para um projeto autoral?",
      a: "Nossos projetos são cobrados por complexidade e tamanho, não necessariamente por hora cravada. Um orçamento preciso só é concedido após o briefing, mas os valores partem de R$300 para flashes minimalistas e variam exponencialmente para fechamentos complexos."
    },
    {
      q: "Como funciona a criação exclusiva (Autoral)?",
      a: "Na modalidade autoral, você reserva a data. O mestre Cristiano Rocha estudará sua anatomia presencialmente e desenvolverá o decalque exclusivamente para você no calor do fluxo criativo (Freehand & Visagismo)."
    },
    {
      q: "Quais materiais de cicatrização (Aftercare) devo usar?",
      a: "Recomendamos que mantenha a pele protegida com o filme curativo pelas primeiras 48h (caso o estúdio aplique). Após isso, limpeza apenas com sabonete neutro e glicerinado, seguido de pomada cicatrizante ultra-fina 2x ao dia. Evite plásticos caseiros."
    },
    {
      q: "Posso levar acompanhantes na sessão?",
      a: "Buscamos um ambiente calmo e concentrado para atingir o estado da arte. Sugerimos que venha sozinho, ou no máximo com 1 acompanhante paciente. Crianças e pets são estritamente vetados na área clínica."
    }
  ];

  return (
    <>
      {/* TESTIMONIALS */}
      <section className="py-24 bg-[#0a0a0a] border-t border-gold-dark/20 relative overflow-hidden">
        {/* Glow behind - Optimized via performance-friendly hardware-accelerated radial-gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(164,124,76,0.08)_0%,transparent_70%)] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="font-display text-xs tracking-[6px] text-gold-base uppercase">O Legado na Pele</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-white mt-2">Depoimentos Notáveis</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "O fechamento de braço que o Cristiano fez superou 100% das minhas expectativas. O realismo das texturas é absurdo. Atendimento nível ouro.",
                author: "Thiago H.",
                style: "Fechamento Realismo"
              },
              {
                text: "Eu queria algo minimalista, um fineline cravado e sem margem pra erro. O estúdio entregou uma obra impecável. Zero dor, cicatrização perfeita.",
                author: "Camila V.",
                style: "Fineline Autoral"
              },
              {
                text: "Fui do Rio a São Paulo só para tatuar o peito no Rocha. O resultado curado de 1 ano continua com os contrastes saltando na pele. Mestre nato.",
                author: "Rodrigo M.",
                style: "Blackwork Complexo"
              }
            ].map((dep, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-[#0e0e0e] border border-gold-dark/10 hover:border-gold-base/30 transition-all duration-500 shadow-xl group">
                <Quote className="w-8 h-8 text-gold-dark/40 mb-6 group-hover:text-gold-light transition-colors" />
                <p className="text-sm text-gray-300 italic mb-8 leading-relaxed">"{dep.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-dark to-black border border-gold-baseflex items-center justify-center text-black font-bold uppercase overflow-hidden shrink-0">
                    <span className="w-full text-center text-xs tracking-widest text-[#a47c4c]">{dep.author.slice(0, 1)}</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">{dep.author}</h5>
                    <span className="text-[10px] text-gold-base uppercase">{dep.style}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AFTERCARE & FAQ SPLIT SECTION */}
      <section className="py-24 bg-bg-black border-t border-gold-dark/20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* AFTERCARE (Cuidados Pós-Tattoo) */}
            <div>
              <span className="font-display text-xs tracking-[6px] text-gold-base uppercase">Preservação da Obra</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white mt-2 mb-8">Guia de Cicatrização Real</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4 p-5 rounded-xl bg-[#0a0a0a] border border-gold-dark/10">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Droplet className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Passo 1: Lavagem (Primeiros 3 dias)</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Lave suavemente apenas com a palma da mão e sabonete neutro liquido (granado/assépsia). Enxugue com papel toalha via compressão leve. Nunca esfregue.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-5 rounded-xl bg-[#0a0a0a] border border-gold-dark/10">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Sun className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Passo 2: Calor e Exposição UV</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">A luz solar direta nos primeiros 30 dias carboniza os tons de tinta. Praia, cloro, piscina e sol intenso são completamente proibidos sob risco de apagar o traço.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 rounded-xl bg-[#0a0a0a] border border-gold-dark/10">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                    <Wind className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Passo 3: Respiração & Hidratação</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Após a fase aguda (dia 3-4), aplique a pomada cicatrizante aprovada (camada finíssima). Deixe a tatuagem respirar. Se estiver grossa branca, você errou na dose.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <span className="font-display text-xs tracking-[6px] text-gold-base uppercase">Respostas Rápidas</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white mt-2 mb-8">FAQ do Estúdio</h2>
              
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="rounded-xl bg-[#0e0e0e] border border-gold-dark/20 overflow-hidden transition-all duration-300">
                    <button 
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                    >
                      <span className={`text-sm font-bold uppercase tracking-wider ${openFaq === idx ? 'text-gold-light' : 'text-gray-300'}`}>{faq.q}</span>
                      {openFaq === idx ? (
                        <ChevronUp className="w-4 h-4 text-gold-base shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                      )}
                    </button>
                    <div 
                      className={`overflow-hidden transition-all duration-500 ${openFaq === idx ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="p-5 pt-0 text-gray-400 text-xs leading-relaxed border-t border-gold-dark/10">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
