import React from 'react';

export interface CalculatorMeta {
  id: string;
  name: string;
  category: string;
  description: string;
  path: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string | React.ReactNode;
}

export type UnitSystem = 'metric' | 'imperial';

export interface CurrencyRate {
  code: string;
  rateToUSD: number; // 1 Unit = X USD
  symbol: string;
}

export interface ArticleContent {
  title: string;
  intro: string;
  sections: {
    heading: string;
    content: React.ReactNode;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
}

export interface CalculatorProps {
  onCalculate: (result: React.ReactNode) => void;
  unitSystem: UnitSystem;
}