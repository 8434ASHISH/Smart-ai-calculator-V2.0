
import React from 'react';
import { ArticleContent } from '../types';

export const articles: Record<string, ArticleContent> = {
  'emi': {
    title: 'EMI Calculator - Importance and Guide',
    intro: 'The Equated Monthly Installment (EMI) is the lifeblood of modern financial planning.',
    sections: [
        {
            heading: 'What is an EMI?',
            content: <p>An EMI is a fixed amount of money that a borrower pays to a lender at a specified date each calendar month. It consists of both principal and interest components.</p>
        },
        {
            heading: 'Why is it Important?',
            content: <p>Knowing your EMI helps you manage your monthly budget, compare different loan offers, and understand the long-term impact of interest rates on your debt.</p>
        }
    ],
    faq: [
        { question: "Can EMI change over time?", answer: "Yes, if you have a floating rate loan, your EMI may increase or decrease based on market fluctuations." },
        { question: "What is a processing fee?", answer: "Lenders often charge a one-time fee to process your loan application, which is separate from your monthly EMI." }
    ]
  },
  'age': {
    title: 'Advanced Age Calculator - Precision Analysis',
    intro: 'Determine your exact age down to the second with our high-precision biological clock tool.',
    sections: [
        {
            heading: 'Importance of Precise Age Tracking',
            content: <p>Precise age is often required for legal documents, insurance forms, and milestone celebrations. Our tool accounts for leap years and month-length variations.</p>
        }
    ],
    faq: [
        { question: "How are leap years handled?", answer: "Our algorithm counts Feb 29th correctly to ensure your total day count is 100% accurate." }
    ]
  },
  'bmi': {
    title: 'BMI Calculator - Health Screening Tool',
    intro: 'Body Mass Index (BMI) is a simple index of weight-for-height that is commonly used to classify underweight, overweight and obesity.',
    sections: [
        {
            heading: 'Is BMI always accurate?',
            content: <p>While useful for the general population, BMI does not distinguish between muscle mass and fat mass. Athletes may have a high BMI but low body fat.</p>
        }
    ],
    faq: [
        { question: "What is a healthy BMI range?", answer: "For most adults, a range between 18.5 and 24.9 is considered healthy." }
    ]
  },
  'scientific': {
    title: 'Scientific Calculator - Engineering & Math',
    intro: 'Perform complex calculations including trigonometry, logarithms, and power functions.',
    sections: [
        {
            heading: 'Importance in STEM',
            content: <p>Scientific calculators are essential for students and professionals in Science, Technology, Engineering, and Mathematics to solve non-linear equations.</p>
        }
    ],
    faq: [
        { question: "What is RAD vs DEG?", answer: "RAD (Radians) and DEG (Degrees) are units of angular measurement. Scientific calculations usually default to Radians." }
    ]
  },
  'gst': {
    title: 'GST Calculator - Taxation Simplified',
    intro: 'Calculate Goods and Services Tax (GST) for any product or service instantly.',
    sections: [
        {
            heading: 'Tax Exclusive vs Inclusive',
            content: <p>Inclusive GST means the tax is already added to the price. Exclusive means you need to add the tax on top of the base price.</p>
        }
    ],
    faq: [
        { question: "What are the common GST slabs?", answer: "Typical slabs include 5%, 12%, 18%, and 28% depending on the luxury/essential nature of the item." }
    ]
  },
  'hyper-scientific': {
    title: 'Hyper Scientific - Advanced Engineering',
    intro: 'Deep analysis for hydrostatic and lithospheric pressure models.',
    sections: [
        { heading: 'Who needs this?', content: <p>Geologists, oil and gas engineers, and deep-sea researchers use these models to predict environmental stresses.</p> }
    ],
    faq: [
        { question: "What is lithostatic pressure?", answer: "It is the pressure exerted by the weight of the Earth's crust at a specific depth." }
    ]
  },
  'roi': {
    title: 'ROI Calculator - Investment Returns',
    intro: 'Return on Investment (ROI) measures the efficiency of an investment.',
    sections: [
        { heading: 'Calculation Method', content: <p>ROI is calculated as (Current Value - Cost) / Cost * 100.</p> }
    ],
    faq: [
        { question: "What is a 'good' ROI?", answer: "A 'good' ROI depends on the asset class; 7-10% is often cited for stock market benchmarks." }
    ]
  }
};
