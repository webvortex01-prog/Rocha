/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import foto1 from './foto1.png';
import foto2 from './foto2.png';
import foto3 from './foto3.png';
import foto4 from './foto4.png';
import foto5 from './foto5.png';
import foto6 from './foto6.png';
import foto7 from './foto7.png';
import foto8 from './foto8.png';
import foto10 from './foto10.png';
import foto11 from './foto11.png';
import foto12 from './foto12.png';
import { PortfolioItem } from './types';

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'samurai-dragao',
    title: 'Samurai & Dragão Celestial',
    category: 'autoral',
    categoryLabel: 'Projetos Autorais',
    description: 'Grande composição inspirada no folclore oriental: samurai focado empunhando katana vitoriosa sobre a ondulação de um dragão esmeralda oriental e sol nascente.',
    timeSpent: '14 Horas (3 Sessões)',
    artist: 'Cristiano Rocha',
    imageUrl: foto11
  },
  {
    id: 'calvario-leao',
    title: 'Retrato de Cristo no Calvário',
    category: 'realismo',
    categoryLabel: 'Blackwork & Realismo',
    description: 'Chiaroscuro expressivo focando na coroa de espinhos e olhar sereno do Redentor, com rica textura de pele e profundidade artística imbatível.',
    timeSpent: '5 Horas',
    artist: 'Cristiano Rocha',
    imageUrl: foto2
  },
  {
    id: 'santa-ceia',
    title: 'A Santa Ceia Nobre',
    category: 'realismo',
    categoryLabel: 'Blackwork & Realismo',
    description: 'Estudo renascentista imortalizado na pele. Sombreado whip-shading ultra fino que capta as reações emotivas de cada apóstolo sob a luz centralizada no mestre.',
    timeSpent: '9 Horas (1 Sessão)',
    artist: 'Cristiano Rocha',
    imageUrl: foto1
  },
  {
    id: 'anjo-querubim',
    title: 'Anjo Querubim Barroco',
    category: 'realismo',
    categoryLabel: 'Blackwork & Realismo',
    description: 'Querubim orador em relevo escultural sombreado, adornado com cruz de pedra de traço firme e a pomba da paz.',
    timeSpent: '7 Horas',
    artist: 'Cristiano Rocha',
    imageUrl: foto3
  },
  {
    id: 'crisantemo',
    title: 'Crisântemo Imperial Blackwork',
    category: 'fineline',
    categoryLabel: 'Piercing & Fineline',
    description: 'Arranjo floral de traços finos com gradiente pontilhado de alta precisão técnica. Encaixe anatômico perfeito.',
    timeSpent: '4 Horas',
    artist: 'Cristiano Rocha',
    imageUrl: foto4
  },
  {
    id: 'medalha-bento',
    title: 'Medalha de São Bento & Aparecida',
    category: 'realismo',
    categoryLabel: 'Blackwork & Realismo',
    description: 'Homenagem profunda de proteção e família. Fusão hiper-realista da icônica medalha com o Santuário.',
    timeSpent: '8 Horas (1 Sessão)',
    artist: 'Cristiano Rocha',
    imageUrl: foto5
  },
  {
    id: 'mariposa-morte',
    title: 'Mariposa Imperial Esfinge',
    category: 'autoral',
    categoryLabel: 'Projetos Autorais',
    description: 'Arte autoral vitoriana da clássica mariposa com mandala geométrica sagrada no fundo e rica textura aveludada nas asas simétricas.',
    timeSpent: '6 Horas',
    artist: 'Cristiano Rocha',
    imageUrl: foto8
  },
  {
    id: 'astronauta-world',
    title: 'Astronauta "The World is Yours"',
    category: 'autoral',
    categoryLabel: 'Projetos Autorais',
    description: 'Projeto autoral misturando fineline e realismo que ilustra um cosmonauta flutuando com o globo terrestre em mãos.',
    timeSpent: '7 Horas',
    artist: 'Cristiano Rocha',
    imageUrl: foto10
  },
  {
    id: 'estudio-fachada',
    title: 'A Fachada de Elite',
    category: 'outro',
    categoryLabel: 'O Estúdio',
    description: 'A matriz Família Rocha Studio.',
    timeSpent: 'História',
    artist: 'Cristiano Rocha',
    imageUrl: foto6
  },
  {
    id: 'estudio-interior',
    title: 'O Atendimento Confort Class',
    category: 'outro',
    categoryLabel: 'O Estúdio',
    description: 'Atendimento imersivo, limpo e seguro.',
    timeSpent: 'História',
    artist: 'Cristiano Rocha',
    imageUrl: foto7
  },
  {
    id: 'estudio-logo',
    title: 'O Brasão Rocha',
    category: 'outro',
    categoryLabel: 'O Estúdio',
    description: 'A marca da tradição desde 2018.',
    timeSpent: 'História',
    artist: 'Cristiano Rocha',
    imageUrl: foto12
  }
];

export const GOOGLE_REVIEWS = [
  { name: "Guilherme Santos", rating: 5, date: "Hoje", text: "Atendimento premium do início ao fim. O Cristiano estudou meu briefing autoral com uma atenção surreal. O estúdio é absurdamente limpo e luxuoso." },
  { name: "Mariana Alencar", rating: 5, date: "Ontem", text: "Fiz uma tatuagem fineline de crisântemo e ficou perfeita, traços absurdamente finos e delicados. A decoração vitoriana transmite muita confiança." },
  { name: "Carlos Eduardo", rating: 5, date: "Há 1 semana", text: "Trabalho de realismo indescritível! Fechamento de braço fantástico. Família Rocha Studio é sem dúvidas a elite absoluta da região." },
  { name: "Fernanda Costa", rating: 5, date: "Há 3 semanas", text: "Ótima experiência com piercing e tatuagem autoral. Saneamento 100% impecável, joias de altíssimo luxo e profissionalismo impecável." }
];
