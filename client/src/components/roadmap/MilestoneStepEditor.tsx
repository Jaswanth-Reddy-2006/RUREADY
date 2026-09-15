import React, { useState } from 'react';
import { 
  ArrowUp, ArrowDown, Trash2, Copy, Plus, X, 
  Target, BookOpen, Code2, ShieldCheck, ChevronDown, ChevronUp,
  AlertTriangle, Lightbulb, ExternalLink, Sparkles
} from 'lucide-react';
import { RoadmapNode, RoadmapSourceItem } from '../../store/useRoadmapStore';
import Button from '../ui/Button';

interface MilestoneStepEditorProps {
  step: RoadmapNode;
  index: number;
  totalSteps: number;
  onChange: (updatedStep: RoadmapNode) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

type PillarTab = 'whatShouldIDo' | 'whatIsTheSource' | 'whatIsTheExactThing' | 'socraticDefense';

export default function MilestoneStepEditor({
  step,
  index,
  totalSteps,
  onChange,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete
}: MilestoneStepEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePillarTab, setActivePillarTab] = useState<PillarTab>('whatShouldIDo');

  // Pillar 1: Action items
  const [newActionItem, setNewActionItem] = useState('');
  const [newMentalModel, setNewMentalModel] = useState('');

  // Pillar 2: Sources
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceType, setNewSourceType] = useState<RoadmapSourceItem['type']>('DOCS');
  const [newSourceDesc, setNewSourceDesc] = useState('');

  // Pillar 3: Verification criteria
  const [newCriteria, setNewCriteria] = useState('');

  const handleAddActionItem = () => {
    if (!newActionItem.trim()) return;
    onChange({
      ...step,
      whatShouldIDo: {
        ...step.whatShouldIDo,
        actionSteps: [...(step.whatShouldIDo?.actionSteps || []), newActionItem.trim()]
      }
    });
    setNewActionItem('');
  };

  const handleRemoveActionItem = (idx: number) => {
    onChange({
      ...step,
      whatShouldIDo: {
        ...step.whatShouldIDo,
        actionSteps: (step.whatShouldIDo?.actionSteps || []).filter((_, i) => i !== idx)
      }
    });
  };

  const handleAddMentalModel = () => {
    if (!newMentalModel.trim()) return;
    onChange({
      ...step,
      whatShouldIDo: {
        ...step.whatShouldIDo,
        mentalModels: [...(step.whatShouldIDo?.mentalModels || []), newMentalModel.trim()]
      }
    });
    setNewMentalModel('');
  };

  const handleRemoveMentalModel = (idx: number) => {
    onChange({
      ...step,
      whatShouldIDo: {
        ...step.whatShouldIDo,
        mentalModels: (step.whatShouldIDo?.mentalModels || []).filter((_, i) => i !== idx)
      }
    });
  };

  const handleAddSource = () => {
    if (!newSourceTitle.trim() || !newSourceUrl.trim()) return;
    const newSrc: RoadmapSourceItem = {
      id: `src-${Date.now()}`,
      title: newSourceTitle.trim(),
      url: newSourceUrl.trim(),
      type: newSourceType,
      description: newSourceDesc.trim() || 'Curated reference guide.'
    };
    onChange({
      ...step,
      whatIsTheSource: [...(step.whatIsTheSource || []), newSrc]
    });
    setNewSourceTitle('');
    setNewSourceUrl('');
    setNewSourceDesc('');
  };

  const handleRemoveSource = (srcId: string) => {
    onChange({
      ...step,
      whatIsTheSource: (step.whatIsTheSource || []).filter((s) => s.id !== srcId)
    });
  };

  const handleAddCriteria = () => {
    if (!newCriteria.trim()) return;
    onChange({
      ...step,
      whatIsTheExactThing: {
        ...step.whatIsTheExactThing,
        verificationChecklist: [...(step.whatIsTheExactThing?.verificationChecklist || []), newCriteria.trim()]
      }
    });
    setNewCriteria('');
  };

  const handleRemoveCriteria = (idx: number) => {
    onChange({
      ...step,
      whatIsTheExactThing: {
        ...step.whatIsTheExactThing,
        verificationChecklist: (step.whatIsTheExactThing?.verificationChecklist || []).filter((_, i) => i !== idx)
      }
    });
  };

  return (
    <div className="bg-white border border-[#DCE7F2] rounded-3xl shadow-sm hover:border-[#4A8BDF]/40 transition-all overflow-hidden">
      
      {/* Collapsed / Expanded Header Bar */}
      <div className="p-4 sm:p-5 bg-[#EFFAFD]/40 border-b border-[#DCE7F2] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-xl bg-[#2459A8] text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
            {index + 1}
          </span>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#A0006D]">
                {step.subHeader || `Milestone ${index + 1}`}
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.2 rounded bg-white text-[#2459A8] border border-[#DCE7F2]">
                {step.category || 'Architecture'}
              </span>
            </div>
            <h4 className="text-sm font-bold font-display text-[#11183D] mt-0.5">
              {step.title || 'Untitled Step'}
            </h4>
          </div>
        </div>

        {/* Step Actions: Move, Duplicate, Delete, Expand */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            className="p-1.5 rounded-lg text-[#526078] hover:bg-white hover:text-[#11183D] disabled:opacity-30 transition-colors cursor-pointer"
            title="Move Step Up"
          >
            <ArrowUp size={15} />
          </button>
          <button
            type="button"
            disabled={index === totalSteps - 1}
            onClick={onMoveDown}
            className="p-1.5 rounded-lg text-[#526078] hover:bg-white hover:text-[#11183D] disabled:opacity-30 transition-colors cursor-pointer"
            title="Move Step Down"
          >
            <ArrowDown size={15} />
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            className="p-1.5 rounded-lg text-[#526078] hover:bg-white hover:text-[#2459A8] transition-colors cursor-pointer"
            title="Duplicate Step"
          >
            <Copy size={14} />
          </button>
          <button
            type="button"
            disabled={totalSteps <= 1}
            onClick={onDelete}
            className="p-1.5 rounded-lg text-[#7B8799] hover:bg-[#F8EAF4] hover:text-[#A0006D] disabled:opacity-30 transition-colors cursor-pointer"
            title="Delete Step"
          >
            <Trash2 size={14} />
          </button>

          <div className="h-4 w-[1px] bg-[#DCE7F2] mx-1" />

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-[#526078] hover:bg-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold font-display"
          >
            <span>{isExpanded ? 'Collapse' : 'Edit'}</span>
            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Expanded Editor Body */}
      {isExpanded && (
        <div className="p-5 sm:p-7 space-y-6">
          
          {/* Step Meta Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="text-[11px] font-bold text-[#526078] uppercase font-display block mb-1">
                Milestone Title *
              </label>
              <input
                type="text"
                value={step.title}
                onChange={(e) => onChange({ ...step, title: e.target.value })}
                placeholder="e.g. Asynchronous Event Loop & Concurrency Internals"
                className="w-full bg-[#EFFAFD]/40 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-bold text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="text-[11px] font-bold text-[#526078] uppercase font-display block mb-1">
                Header & Sub-Header *
              </label>
              <input
                type="text"
                value={step.subHeader || ''}
                onChange={(e) => onChange({ ...step, subHeader: e.target.value })}
                placeholder="e.g. Phase 1 • Runtime Execution Mechanics"
                className="w-full bg-[#EFFAFD]/40 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-[#526078] uppercase font-display block mb-1">
                Est. Hours
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={step.estimatedHours || 15}
                onChange={(e) => onChange({ ...step, estimatedHours: parseInt(e.target.value, 10) || 10 })}
                className="w-full bg-[#EFFAFD]/40 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] font-mono focus:outline-none focus:border-[#4A8BDF]"
              />
            </div>
          </div>

          {/* 3 Pillars & Socratic Defense Tabs */}
          <div className="border border-[#DCE7F2] rounded-2xl overflow-hidden">
            
            {/* Pillar Tab Switcher */}
            <div className="flex items-center border-b border-[#DCE7F2] bg-[#EFFAFD]/30 overflow-x-auto text-xs font-bold font-display">
              {[
                { id: 'whatShouldIDo', label: '1. What Should I Do?', icon: Target, badge: 'Strategy & Mental Models' },
                { id: 'whatIsTheSource', label: '2. What Is The Source?', icon: BookOpen, badge: `${step.whatIsTheSource?.length || 0} Sources` },
                { id: 'whatIsTheExactThing', label: '3. What Is The Exact Thing?', icon: Code2, badge: 'Sandbox Drill & Starter Code' },
                { id: 'socraticDefense', label: '4. Socratic Defense', icon: ShieldCheck, badge: 'Interview Checkpoint' },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activePillarTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActivePillarTab(tab.id as PillarTab)}
                    className={`px-4 py-3 flex items-center gap-2 shrink-0 border-r border-[#DCE7F2] transition-all cursor-pointer ${
                      active
                        ? 'bg-white text-[#2459A8] border-b-2 border-b-[#2459A8]'
                        : 'text-[#526078] hover:bg-white hover:text-[#11183D]'
                    }`}
                  >
                    <Icon size={15} />
                    <span>{tab.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-[#EFFAFD] text-[#526078]">
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: What Should I Do? */}
            {activePillarTab === 'whatShouldIDo' && (
              <div className="p-5 space-y-5 bg-white">
                <div>
                  <label className="text-xs font-bold text-[#11183D] font-display flex items-center gap-1.5 mb-1">
                    <Target size={14} className="text-[#2459A8]" />
                    <span>High-Yield Strategic Objective (Summary)</span>
                  </label>
                  <p className="text-[11px] text-[#526078] mb-1.5">
                    Explain the core concept and why top companies test for it.
                  </p>
                  <textarea
                    rows={3}
                    value={step.whatShouldIDo?.summary || ''}
                    onChange={(e) =>
                      onChange({
                        ...step,
                        whatShouldIDo: { ...step.whatShouldIDo, summary: e.target.value }
                      })
                    }
                    placeholder="e.g. Master the event loop phases, call stack, and memory lifecycle so you can diagnose production memory leaks."
                    className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl p-3 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF] font-body leading-relaxed"
                  />
                </div>

                {/* Action Items */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#11183D] font-display block">
                    Concrete Action Items (Interactive Student Checklist)
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newActionItem}
                      onChange={(e) => setNewActionItem(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddActionItem(); }}}
                      placeholder="e.g. Implement custom Promise concurrency limiter handling 50 requests..."
                      className="flex-1 bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    />
                    <Button variant="secondary" size="sm" onClick={handleAddActionItem} icon={<Plus size={13} />}>
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {(step.whatShouldIDo?.actionSteps || []).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#EFFAFD]/40 border border-[#DCE7F2] text-xs">
                        <span className="text-[#334155]">{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveActionItem(idx)}
                          className="text-[#7B8799] hover:text-[#A0006D] p-1 transition-colors cursor-pointer"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mental Models */}
                <div className="space-y-2 pt-2 border-t border-[#DCE7F2]">
                  <label className="text-xs font-bold text-[#11183D] font-display flex items-center gap-1.5">
                    <Lightbulb size={14} className="text-[#168A62]" />
                    <span>Architectural Mental Models & Invariants</span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMentalModel}
                      onChange={(e) => setNewMentalModel(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddMentalModel(); }}}
                      placeholder="e.g. Single-Threaded Event Loop: JS execution is single-threaded but offloads I/O to libuv thread pool."
                      className="flex-1 bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    />
                    <Button variant="secondary" size="sm" onClick={handleAddMentalModel} icon={<Plus size={13} />}>
                      Add Model
                    </Button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {(step.whatShouldIDo?.mentalModels || []).map((model, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#E8F5F0]/40 border border-[#168A62]/30 text-xs">
                        <span className="text-[#168A62] font-medium">{model}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMentalModel(idx)}
                          className="text-[#7B8799] hover:text-[#A0006D] p-1 transition-colors cursor-pointer"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab 2: What Is The Source? */}
            {activePillarTab === 'whatIsTheSource' && (
              <div className="p-5 space-y-5 bg-white">
                <div className="p-4 rounded-2xl bg-[#EFFAFD]/60 border border-[#DCE7F2] space-y-3">
                  <span className="text-xs font-bold text-[#11183D] font-display flex items-center gap-1.5">
                    <BookOpen size={14} className="text-[#2459A8]" />
                    <span>Add Verified High-Yield Reference</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Source Title (e.g. Official MDN Event Loop Spec)"
                      value={newSourceTitle}
                      onChange={(e) => setNewSourceTitle(e.target.value)}
                      className="bg-white border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    />
                    <input
                      type="url"
                      placeholder="https://developer.mozilla.org/..."
                      value={newSourceUrl}
                      onChange={(e) => setNewSourceUrl(e.target.value)}
                      className="bg-white border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    />
                    <div className="flex gap-2">
                      <select
                        value={newSourceType}
                        onChange={(e) => setNewSourceType(e.target.value as any)}
                        className="bg-white border border-[#DCE7F2] rounded-xl px-2.5 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                      >
                        <option value="DOCS">Documentation</option>
                        <option value="VIDEO">Video Deep Dive</option>
                        <option value="BOOK">Engineering Paper / Book</option>
                        <option value="REPO">GitHub Architecture Repo</option>
                      </select>
                      <Button variant="royal" size="sm" onClick={handleAddSource} icon={<Plus size={13} />}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Sources List */}
                <div className="space-y-2">
                  {(step.whatIsTheSource || []).map((src) => (
                    <div key={src.id} className="p-3 rounded-xl bg-white border border-[#DCE7F2] flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EFFAFD] text-[#2459A8]">
                          {src.type}
                        </span>
                        <strong className="text-[#11183D] truncate">{src.title}</strong>
                        <a href={src.url} target="_blank" rel="noreferrer" className="text-[#4A8BDF] hover:underline flex items-center gap-0.5 text-[11px] shrink-0">
                          <ExternalLink size={11} /> Link
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSource(src.id)}
                        className="text-[#7B8799] hover:text-[#A0006D] p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  {(step.whatIsTheSource || []).length === 0 && (
                    <span className="text-xs text-[#7B8799] italic">No sources linked yet. Add at least 1 verified reference guide.</span>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: What Is The Exact Thing? */}
            {activePillarTab === 'whatIsTheExactThing' && (
              <div className="p-5 space-y-5 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#11183D] font-display block mb-1">
                      Practical Drill Title *
                    </label>
                    <input
                      type="text"
                      value={step.whatIsTheExactThing?.title || ''}
                      onChange={(e) =>
                        onChange({
                          ...step,
                          whatIsTheExactThing: { ...step.whatIsTheExactThing, title: e.target.value }
                        })
                      }
                      placeholder="e.g. Asynchronous Concurrency Limiter Engine"
                      className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#11183D] font-display block mb-1">
                      Concrete Deliverable *
                    </label>
                    <input
                      type="text"
                      value={step.whatIsTheExactThing?.deliverable || ''}
                      onChange={(e) =>
                        onChange({
                          ...step,
                          whatIsTheExactThing: { ...step.whatIsTheExactThing, deliverable: e.target.value }
                        })
                      }
                      placeholder="e.g. Tested TypeScript module with simulated 50-client load test"
                      className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#11183D] font-display block mb-1">
                    Drill Description & Invariants
                  </label>
                  <textarea
                    rows={2}
                    value={step.whatIsTheExactThing?.description || ''}
                    onChange={(e) =>
                      onChange({
                        ...step,
                        whatIsTheExactThing: { ...step.whatIsTheExactThing, description: e.target.value }
                      })
                    }
                    placeholder="Describe what the student will construct in Monaco and what edge cases to handle..."
                    className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl p-3 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                  />
                </div>

                {/* Starter Code */}
                <div>
                  <label className="text-xs font-bold text-[#11183D] font-display block mb-1">
                    Monaco Sandbox Starter Code (TypeScript / Python / Go / SQL)
                  </label>
                  <textarea
                    rows={5}
                    value={step.whatIsTheExactThing?.starterCode || ''}
                    onChange={(e) =>
                      onChange({
                        ...step,
                        whatIsTheExactThing: { ...step.whatIsTheExactThing, starterCode: e.target.value }
                      })
                    }
                    placeholder="// Write executable starter code here..."
                    className="w-full bg-[#11183D] text-[#EFFAFD] border border-[#DCE7F2] rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#4A8BDF] leading-relaxed"
                  />
                </div>

                {/* Verification Criteria */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#11183D] font-display block">
                    Automated Test Verification Criteria (Definition of Done)
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCriteria}
                      onChange={(e) => setNewCriteria(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCriteria(); }}}
                      placeholder="e.g. Memory overhead stays below 30MB during 10,000 operations..."
                      className="flex-1 bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    />
                    <Button variant="secondary" size="sm" onClick={handleAddCriteria} icon={<Plus size={13} />}>
                      Add Criteria
                    </Button>
                  </div>

                  <div className="space-y-1 pt-1">
                    {(step.whatIsTheExactThing?.verificationChecklist || []).map((crit, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-[#EFFAFD]/30 border border-[#DCE7F2] text-xs">
                        <span className="text-[#334155]">{crit}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCriteria(idx)}
                          className="text-[#7B8799] hover:text-[#A0006D] p-1 transition-colors cursor-pointer"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab 4: Socratic Defense Checkpoint */}
            {activePillarTab === 'socraticDefense' && (
              <div className="p-5 space-y-4 bg-white">
                <div>
                  <label className="text-xs font-bold text-[#11183D] font-display block mb-1">
                    Interview Defense Challenge Question
                  </label>
                  <p className="text-[11px] text-[#526078] mb-1.5">
                    What will an interviewer ask to test if the candidate actually understands trade-offs?
                  </p>
                  <input
                    type="text"
                    value={step.microQuestions?.[0]?.questionText || ''}
                    onChange={(e) => {
                      const currentMq = step.microQuestions?.[0] || { id: `mq-${Date.now()}`, questionText: '', focus: 'Design Trade-offs', suggestedAnswer: '' };
                      onChange({
                        ...step,
                        microQuestions: [{ ...currentMq, questionText: e.target.value }]
                      });
                    }}
                    placeholder="e.g. Why did you choose a sliding-window counter over a token bucket algorithm for your rate limiter?"
                    className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#11183D] font-display block mb-1">
                    Suggested Socratic Answer / Key Trade-offs
                  </label>
                  <textarea
                    rows={3}
                    value={step.microQuestions?.[0]?.suggestedAnswer || ''}
                    onChange={(e) => {
                      const currentMq = step.microQuestions?.[0] || { id: `mq-${Date.now()}`, questionText: '', focus: 'Design Trade-offs', suggestedAnswer: '' };
                      onChange({
                        ...step,
                        microQuestions: [{ ...currentMq, suggestedAnswer: e.target.value }]
                      });
                    }}
                    placeholder="Explain the trade-offs: memory usage, computational complexity, burst handling..."
                    className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl p-3 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF] font-body leading-relaxed"
                  />
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
