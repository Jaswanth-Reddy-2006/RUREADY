import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, BrainCircuit, CheckCircle2, ShieldCheck, Sparkles, Code2,
  Users, Layers, ExternalLink, ArrowRight
} from 'lucide-react';
import { usePlacementStore } from '../../store/usePlacementStore';

const COMPANY_KITS = [
  {
    name: 'Google',
    role: 'Software Engineer (SWE)',
    ctc: '₹50+ LPA / ₹80K Mo',
    hiringProcess: ['Online Challenge (2 Questions, 90m)', 'Tech Round 1 (Trees/Graphs)', 'Tech Round 2 (System Design)', 'Googleytude & Leadership'],
    topTopics: [
      { topic: 'Graph Algorithms & BFS/DFS', pct: 92 },
      { topic: 'Dynamic Programming & Memoization', pct: 84 },
      { topic: 'Trie & String Manipulation', pct: 75 },
      { topic: 'Concurrency & Thread Locks', pct: 62 },
    ],
    sampleQuestions: [
      'Find median from data stream with high frequency insertions',
      'Word Ladder II (Shortest transformation path)',
      'Design Distributed Rate Limiter',
    ]
  },
  {
    name: 'Microsoft',
    role: 'Software Development Engineer (SDE-1)',
    ctc: '₹51.0 LPA',
    hiringProcess: ['Online Assessment (2 Questions, 75m)', 'Tech Round 1 (Data Structures)', 'Tech Round 2 (OOP & Low Level Design)', 'AA / HR Round'],
    topTopics: [
      { topic: 'Binary Trees & BST Traversals', pct: 90 },
      { topic: 'Low Level Design (Parking Lot, Elevator)', pct: 82 },
      { topic: 'Operating Systems (Memory & Threads)', pct: 78 },
      { topic: 'SQL Joins & Indexing', pct: 68 },
    ],
    sampleQuestions: [
      'Binary Tree Zigzag Level Order Traversal',
      'Design a File System with permissions LLD',
      'Min Swaps to Make String Palindrome',
    ]
  },
  {
    name: 'Amazon',
    role: 'SDE Intern / SDE-1',
    ctc: '₹1.1L/mo / ₹44 LPA',
    hiringProcess: ['Online Assessment (Coding + Work Simulation)', 'Tech Round 1 (Algorithms)', 'Bar Raiser & Leadership Principles'],
    topTopics: [
      { topic: 'Amazon Leadership Principles (STAR Method)', pct: 95 },
      { topic: 'LRU Cache & Hash Map + Doubly Linked List', pct: 88 },
      { topic: 'Top K Frequent Elements (Priority Queue)', pct: 80 },
      { topic: 'System Scalability & Microservices', pct: 70 },
    ],
    sampleQuestions: [
      'Implement LRU Cache with O(1) Operations',
      'Reorganize String (No 2 adjacent same characters)',
      'Describe a situation where you took ownership of a critical failure',
    ]
  },
];

export default function PlacementCompanyInsights() {
  const [selectedCompany, setSelectedCompany] = useState('Google');

  const activeKit = COMPANY_KITS.find((k) => k.name === selectedCompany) || COMPANY_KITS[0];

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs space-y-6 select-none font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F1F5F9] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-[#4F46E5]">
            <Building2 size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-[#0F172A]">
              Company Hiring Intelligence & Pattern Vault
            </h3>
            <p className="text-xs text-[#64748B]">
              Vetted interview processes, top tested topics, and real past candidate questions.
            </p>
          </div>
        </div>

        {/* Company Selector Buttons */}
        <div className="flex items-center gap-2">
          {COMPANY_KITS.map((k) => (
            <button
              key={k.name}
              onClick={() => setSelectedCompany(k.name)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
                selectedCompany === k.name
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-slate-100 text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {k.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Company Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Hiring Process & Top Topics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Banner */}
          <div className="p-5 bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] text-white rounded-2xl space-y-2 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 font-mono">Company Prep Kit</span>
                <h4 className="text-xl font-extrabold font-display">{activeKit.name} — {activeKit.role}</h4>
              </div>
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold font-mono">
                {activeKit.ctc}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Vetted hiring benchmarks based on past campus placement drives and candidate feedback.
            </p>
          </div>

          {/* Hiring Process Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Hiring Process Workflow</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeKit.hiringProcess.map((step, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-[#0F172A]">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Tested Topics Bar Charts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Top Tested Topics</h4>
            <div className="space-y-2.5">
              {activeKit.topTopics.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-[#64748B]">
                    <span>{item.topic}</span>
                    <span className="font-mono text-[#2563EB]">{item.pct}% candidates asked</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Past Sample Questions */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Real Interview Questions</h4>
          
          <div className="p-4 bg-slate-50 border border-[#E2E8F0] rounded-2xl space-y-3">
            {activeKit.sampleQuestions.map((q, idx) => (
              <div key={idx} className="p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#0F172A] space-y-1 shadow-2xs">
                <span className="text-[10px] font-bold font-mono text-[#2563EB] uppercase">Question {idx + 1}</span>
                <p className="font-bold">{q}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => window.location.href = '/interview/coding/new'}
            className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold font-display flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Sparkles size={15} />
            <span>Practice {activeKit.name} Mock Drill</span>
          </button>
        </div>

      </div>
    </div>
  );
}
