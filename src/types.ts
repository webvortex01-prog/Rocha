/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Booking {
  id: string;
  name: string;
  whatsapp: string;
  date: string; // ISO date YYYY-MM-DD
  time?: string;
  description: string;
  style: string;
  tattooType?: string;
  tattooSizeCm?: number;
  bodyPart?: string;
  tattooComplexity?: string;
  medicalHistory?: string;
  allergies?: string;
  consentAccepted?: boolean;
  referenceImage?: string;
  status: 'pendente' | 'confirmado' | 'cancelado' | 'concluido';
  value: number; // Estimated value in BRL
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minThreshold: number;
  unit: string;
}

export interface BlockedDay {
  date: string; // YYYY-MM-DD
  reason?: string;
}

export interface StudioStats {
  monthlyGoal: number;
  baseTattooPrice: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'autoral' | 'realismo' | 'fineline' | 'outro' | 'nariz' | 'orelha' | 'boca';
  categoryLabel: string;
  description: string;
  timeSpent: string;
  artist: string;
  imageUrl: string;
  bodyPart?: string;
}
