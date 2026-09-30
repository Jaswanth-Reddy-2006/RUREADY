import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BuilderRoadmapState, 
  BuilderPhase, 
  BuilderMilestone, 
  BuilderSprint, 
  BuilderTask, 
  SelectedItemRef 
} from './types';
import { 
  createDefaultRoadmapState, 
  loadDraftFromLocalStorage, 
  saveDraftToLocalStorage,
  clearDraftFromLocalStorage,
  publishRoadmapService
} from './roadmapService';
import { RoadmapSetup } from './RoadmapSetup';
import { RoadmapTree } from './RoadmapTree';
import { PhaseEditor } from './PhaseEditor';
import { MilestoneEditor } from './MilestoneEditor';
import { SprintEditor } from './SprintEditor';
import { TaskEditor } from './TaskEditor';
import { RoadmapSummary } from './RoadmapSummary';
import { PublishRoadmapModal } from './PublishRoadmapModal';
import { RoadmapPreviewModal } from './RoadmapPreviewModal';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Save, 
  Menu, 
  X,
  FileText
} from 'lucide-react';

export const ManualRoadmapBuilderContainer: React.FC = () => {
  const navigate = useNavigate();

  // Current Step: 1 = Basic Setup, 2 = Main Builder
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Main Builder State
  const [state, setState] = useState<BuilderRoadmapState>(() => {
    return loadDraftFromLocalStorage() || createDefaultRoadmapState();
  });

  // Selected item reference in tree
  const [selectedItem, setSelectedItem] = useState<SelectedItemRef>({
    type: 'roadmap'
  });

  // Expanded Tree nodes
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  // Save status indicator
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Modals state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isMobileTreeOpen, setIsMobileTreeOpen] = useState(false);

  // Auto-save debounce timer
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save effect whenever state changes
  useEffect(() => {
    setSaveStatus('saving');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveDraftToLocalStorage(state);
      setSaveStatus('saved');
    }, 800);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [state]);

  // Handle Step 1 setup completion
  const handleSetupComplete = (setupData: Partial<BuilderRoadmapState>) => {
    setState(prev => ({
      ...prev,
      ...setupData,
      updatedAt: new Date().toISOString()
    }));
    setCurrentStep(2);
  };

  // Selection Helper
  const handleSelectItem = (item: SelectedItemRef) => {
    setSelectedItem(item);
    setIsMobileTreeOpen(false); // auto close mobile tree drawer
  };

  // Node Expansion Toggle
  const handleToggleExpand = (id: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // ========================================================
  // CREATION HANDLERS
  // ========================================================
  const handleAddPhase = () => {
    const newPhase: BuilderPhase = {
      id: 'phase-' + Date.now(),
      title: 'New Phase',
      description: '',
      objective: '',
      estimatedDuration: '2 weeks',
      milestones: []
    };

    setState(prev => ({
      ...prev,
      phases: [...prev.phases, newPhase]
    }));

    // Expand & select newly created phase
    setExpandedNodes(prev => ({ ...prev, [newPhase.id]: true }));
    setSelectedItem({ type: 'phase', phaseId: newPhase.id });
  };

  const handleAddMilestone = (phaseId: string) => {
    const newMilestone: BuilderMilestone = {
      id: 'ms-' + Date.now(),
      title: 'New Milestone',
      objective: '',
      estimatedDuration: '1 week',
      skills: [],
      completionCriteria: [],
      sprints: []
    };

    setState(prev => ({
      ...prev,
      phases: prev.phases.map(phase => {
        if (phase.id === phaseId) {
          return {
            ...phase,
            milestones: [...phase.milestones, newMilestone]
          };
        }
        return phase;
      })
    }));

    // Expand parent & select newly created milestone
    setExpandedNodes(prev => ({
      ...prev,
      [phaseId]: true,
      [newMilestone.id]: true
    }));
    setSelectedItem({ type: 'milestone', phaseId, milestoneId: newMilestone.id });
  };

  const handleAddSprint = (phaseId: string, milestoneId: string) => {
    const newSprint: BuilderSprint = {
      id: 'sp-' + Date.now(),
      title: 'New Sprint',
      description: '',
      goal: '',
      durationDays: 7,
      tasks: []
    };

    setState(prev => ({
      ...prev,
      phases: prev.phases.map(phase => {
        if (phase.id === phaseId) {
          return {
            ...phase,
            milestones: phase.milestones.map(milestone => {
              if (milestone.id === milestoneId) {
                return {
                  ...milestone,
                  sprints: [...milestone.sprints, newSprint]
                };
              }
              return milestone;
            })
          };
        }
        return phase;
      })
    }));

    // Expand parent & select newly created sprint
    setExpandedNodes(prev => ({
      ...prev,
      [milestoneId]: true,
      [newSprint.id]: true
    }));
    setSelectedItem({ type: 'sprint', phaseId, milestoneId, sprintId: newSprint.id });
  };

  const handleAddTask = (phaseId: string, milestoneId: string, sprintId: string) => {
    const newTask: BuilderTask = {
      id: 'tk-' + Date.now(),
      title: 'New Task',
      description: '',
      type: 'learning',
      estimatedMinutes: 30,
      required: true,
      skills: [],
      resources: []
    };

    setState(prev => ({
      ...prev,
      phases: prev.phases.map(phase => {
        if (phase.id === phaseId) {
          return {
            ...phase,
            milestones: phase.milestones.map(milestone => {
              if (milestone.id === milestoneId) {
                return {
                  ...milestone,
                  sprints: milestone.sprints.map(sprint => {
                    if (sprint.id === sprintId) {
                      return {
                        ...sprint,
                        tasks: [...sprint.tasks, newTask]
                      };
                    }
                    return sprint;
                  })
                };
              }
              return milestone;
            })
          };
        }
        return phase;
      })
    }));

    setExpandedNodes(prev => ({ ...prev, [sprintId]: true }));
    setSelectedItem({ type: 'task', phaseId, milestoneId, sprintId, taskId: newTask.id });
  };

  // ========================================================
  // UPDATE HANDLERS
  // ========================================================
  const handleUpdatePhase = (updatedPhase: BuilderPhase) => {
    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => (p.id === updatedPhase.id ? updatedPhase : p))
    }));
  };

  const handleUpdateMilestone = (phaseId: string, updatedMilestone: BuilderMilestone) => {
    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => {
        if (p.id === phaseId) {
          return {
            ...p,
            milestones: p.milestones.map(m => (m.id === updatedMilestone.id ? updatedMilestone : m))
          };
        }
        return p;
      })
    }));
  };

  const handleUpdateSprint = (phaseId: string, milestoneId: string, updatedSprint: BuilderSprint) => {
    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => {
        if (p.id === phaseId) {
          return {
            ...p,
            milestones: p.milestones.map(m => {
              if (m.id === milestoneId) {
                return {
                  ...m,
                  sprints: m.sprints.map(s => (s.id === updatedSprint.id ? updatedSprint : s))
                };
              }
              return m;
            })
          };
        }
        return p;
      })
    }));
  };

  const handleUpdateTask = (phaseId: string, milestoneId: string, sprintId: string, updatedTask: BuilderTask) => {
    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => {
        if (p.id === phaseId) {
          return {
            ...p,
            milestones: p.milestones.map(m => {
              if (m.id === milestoneId) {
                return {
                  ...m,
                  sprints: m.sprints.map(s => {
                    if (s.id === sprintId) {
                      return {
                        ...s,
                        tasks: s.tasks.map(t => (t.id === updatedTask.id ? updatedTask : t))
                      };
                    }
                    return s;
                  })
                };
              }
              return m;
            })
          };
        }
        return p;
      })
    }));
  };

  // ========================================================
  // DELETE HANDLERS
  // ========================================================
  const handleDeletePhase = (phaseId: string) => {
    setState(prev => ({
      ...prev,
      phases: prev.phases.filter(p => p.id !== phaseId)
    }));
    setSelectedItem({ type: 'roadmap' });
  };

  const handleDeleteMilestone = (phaseId: string, milestoneId: string) => {
    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => {
        if (p.id === phaseId) {
          return {
            ...p,
            milestones: p.milestones.filter(m => m.id !== milestoneId)
          };
        }
        return p;
      })
    }));
    setSelectedItem({ type: 'phase', phaseId });
  };

  const handleDeleteSprint = (phaseId: string, milestoneId: string, sprintId: string) => {
    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => {
        if (p.id === phaseId) {
          return {
            ...p,
            milestones: p.milestones.map(m => {
              if (m.id === milestoneId) {
                return {
                  ...m,
                  sprints: m.sprints.filter(s => s.id !== sprintId)
                };
              }
              return m;
            })
          };
        }
        return p;
      })
    }));
    setSelectedItem({ type: 'milestone', phaseId, milestoneId });
  };

  const handleDeleteTask = (phaseId: string, milestoneId: string, sprintId: string, taskId: string) => {
    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => {
        if (p.id === phaseId) {
          return {
            ...p,
            milestones: p.milestones.map(m => {
              if (m.id === milestoneId) {
                return {
                  ...m,
                  sprints: m.sprints.map(s => {
                    if (s.id === sprintId) {
                      return {
                        ...s,
                        tasks: s.tasks.filter(t => t.id !== taskId)
                      };
                    }
                    return s;
                  })
                };
              }
              return m;
            })
          };
        }
        return p;
      })
    }));
    setSelectedItem({ type: 'sprint', phaseId, milestoneId, sprintId });
  };

  // ========================================================
  // REORDERING HANDLERS
  // ========================================================
  const handleMovePhase = (phaseId: string, direction: 'up' | 'down') => {
    const idx = state.phases.findIndex(p => p.id === phaseId);
    if (idx < 0) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= state.phases.length) return;

    const newPhases = [...state.phases];
    const [moved] = newPhases.splice(idx, 1);
    newPhases.splice(targetIdx, 0, moved);

    setState(prev => ({ ...prev, phases: newPhases }));
  };

  const handleMoveMilestone = (phaseId: string, milestoneId: string, direction: 'up' | 'down') => {
    const phase = state.phases.find(p => p.id === phaseId);
    if (!phase) return;

    const idx = phase.milestones.findIndex(m => m.id === milestoneId);
    if (idx < 0) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= phase.milestones.length) return;

    const newMilestones = [...phase.milestones];
    const [moved] = newMilestones.splice(idx, 1);
    newMilestones.splice(targetIdx, 0, moved);

    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => (p.id === phaseId ? { ...p, milestones: newMilestones } : p))
    }));
  };

  const handleMoveSprint = (phaseId: string, milestoneId: string, sprintId: string, direction: 'up' | 'down') => {
    const phase = state.phases.find(p => p.id === phaseId);
    const milestone = phase?.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    const idx = milestone.sprints.findIndex(s => s.id === sprintId);
    if (idx < 0) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= milestone.sprints.length) return;

    const newSprints = [...milestone.sprints];
    const [moved] = newSprints.splice(idx, 1);
    newSprints.splice(targetIdx, 0, moved);

    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => {
        if (p.id === phaseId) {
          return {
            ...p,
            milestones: p.milestones.map(m => (m.id === milestoneId ? { ...m, sprints: newSprints } : m))
          };
        }
        return p;
      })
    }));
  };

  const handleMoveTask = (phaseId: string, milestoneId: string, sprintId: string, taskId: string, direction: 'up' | 'down') => {
    const phase = state.phases.find(p => p.id === phaseId);
    const milestone = phase?.milestones.find(m => m.id === milestoneId);
    const sprint = milestone?.sprints.find(s => s.id === sprintId);
    if (!sprint) return;

    const idx = sprint.tasks.findIndex(t => t.id === taskId);
    if (idx < 0) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sprint.tasks.length) return;

    const newTasks = [...sprint.tasks];
    const [moved] = newTasks.splice(idx, 1);
    newTasks.splice(targetIdx, 0, moved);

    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => {
        if (p.id === phaseId) {
          return {
            ...p,
            milestones: p.milestones.map(m => {
              if (m.id === milestoneId) {
                return {
                  ...m,
                  sprints: m.sprints.map(s => (s.id === sprintId ? { ...s, tasks: newTasks } : s))
                };
              }
              return m;
            })
          };
        }
        return p;
      })
    }));
  };

  const handleDuplicateTask = (phaseId: string, milestoneId: string, sprintId: string, taskId: string) => {
    const phase = state.phases.find(p => p.id === phaseId);
    const milestone = phase?.milestones.find(m => m.id === milestoneId);
    const sprint = milestone?.sprints.find(s => s.id === sprintId);
    const targetTask = sprint?.tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const dupTask: BuilderTask = {
      ...targetTask,
      id: 'tk-' + Date.now(),
      title: `${targetTask.title} (Copy)`
    };

    setState(prev => ({
      ...prev,
      phases: prev.phases.map(p => {
        if (p.id === phaseId) {
          return {
            ...p,
            milestones: p.milestones.map(m => {
              if (m.id === milestoneId) {
                return {
                  ...m,
                  sprints: m.sprints.map(s => {
                    if (s.id === sprintId) {
                      return {
                        ...s,
                        tasks: [...s.tasks, dupTask]
                      };
                    }
                    return s;
                  })
                };
              }
              return m;
            })
          };
        }
        return p;
      })
    }));
  };

  // Publish flow confirmation
  const handleConfirmPublish = () => {
    publishRoadmapService(state);
    clearDraftFromLocalStorage();
    setIsPublishOpen(false);
    navigate('/roadmap');
  };

  // Find targeted item objects for Center Column Editor
  const currentPhase = state.phases.find(p => p.id === selectedItem.phaseId);
  const currentMilestone = currentPhase?.milestones.find(m => m.id === selectedItem.milestoneId);
  const currentSprint = currentMilestone?.sprints.find(s => s.id === selectedItem.sprintId);
  const currentTask = currentSprint?.tasks.find(t => t.id === selectedItem.taskId);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/roadmap')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            title="Back to Roadmaps"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                Roadmap Builder
              </span>
              <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Draft
              </span>
            </div>
            <h1 className="text-base font-bold text-white truncate max-w-xs sm:max-w-md">
              {state.title || 'Untitled Roadmap'}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {currentStep === 2 && (
            <>
              {/* Mobile tree trigger */}
              <button
                onClick={() => setIsMobileTreeOpen(!isMobileTreeOpen)}
                className="lg:hidden p-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsPreviewOpen(true)}
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
              >
                <span>Preview</span>
              </button>

              <button
                onClick={() => setIsPublishOpen(true)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition-all"
              >
                <span>Publish</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Container Body */}
      {currentStep === 1 ? (
        /* STEP 1: BASIC ROADMAP SETUP SCREEN */
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <RoadmapSetup
            initialData={state}
            onComplete={handleSetupComplete}
          />
        </main>
      ) : (
        /* STEP 2: MAIN ROADMAP BUILDER (3-PANE LAYOUT) */
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* ======================================================== */}
          {/* LEFT SIDEBAR: ROADMAP STRUCTURE TREE (~240px) */}
          {/* ======================================================== */}
          <aside className={`
            fixed inset-y-0 left-0 z-30 w-72 bg-slate-950 border-r border-slate-800/80 p-4 transition-transform duration-200 transform lg:static lg:translate-x-0 lg:w-64 shrink-0
            ${isMobileTreeOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Roadmap Structure</h3>
              <button
                onClick={() => setIsMobileTreeOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <RoadmapTree
              state={state}
              selectedItem={selectedItem}
              onSelectItem={handleSelectItem}
              expandedNodes={expandedNodes}
              onToggleExpand={handleToggleExpand}
              onAddPhase={handleAddPhase}
              onAddMilestone={handleAddMilestone}
              onAddSprint={handleAddSprint}
              onAddTask={handleAddTask}
              onMovePhase={handleMovePhase}
              onMoveMilestone={handleMoveMilestone}
              onMoveSprint={handleMoveSprint}
              onMoveTask={handleMoveTask}
            />
          </aside>

          {/* Overlay for mobile tree */}
          {isMobileTreeOpen && (
            <div
              onClick={() => setIsMobileTreeOpen(false)}
              className="fixed inset-0 bg-slate-950/80 z-20 lg:hidden"
            />
          )}

          {/* ======================================================== */}
          {/* CENTER COLUMN: CURRENT ITEM EDITOR */}
          {/* ======================================================== */}
          <section className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
            {/* Context Breadcrumbs */}
            <div className="mb-4 text-xs text-slate-400 flex items-center space-x-2 overflow-x-auto">
              <span className="font-semibold text-purple-400">{state.title || 'Roadmap'}</span>
              {currentPhase && (
                <>
                  <span>›</span>
                  <span className="text-slate-300">{currentPhase.title}</span>
                </>
              )}
              {currentMilestone && (
                <>
                  <span>›</span>
                  <span className="text-slate-300">{currentMilestone.title}</span>
                </>
              )}
              {currentSprint && (
                <>
                  <span>›</span>
                  <span className="text-slate-300">{currentSprint.title}</span>
                </>
              )}
              {currentTask && (
                <>
                  <span>›</span>
                  <span className="text-slate-200 font-medium">{currentTask.title}</span>
                </>
              )}
            </div>

            {/* Render Node-Specific Editor */}
            {selectedItem.type === 'roadmap' && (
              <div className="max-w-4xl mx-auto p-8 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Roadmap General Settings</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    You are viewing the root level of your roadmap. Update basic info or start adding phases.
                  </p>
                </div>
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl border border-slate-700 transition-colors"
                  >
                    Edit Roadmap Basic Details →
                  </button>
                </div>
              </div>
            )}

            {selectedItem.type === 'phase' && currentPhase && (
              <PhaseEditor
                phase={currentPhase}
                onUpdate={handleUpdatePhase}
                onDelete={() => handleDeletePhase(currentPhase.id)}
                onAddMilestone={() => handleAddMilestone(currentPhase.id)}
                onSelectMilestone={(msId: string) =>
                  handleSelectItem({ type: 'milestone', phaseId: currentPhase.id, milestoneId: msId })
                }
                onDeleteMilestone={(msId: string) => handleDeleteMilestone(currentPhase.id, msId)}
                onMoveMilestone={(msId: string, dir: 'up' | 'down') => handleMoveMilestone(currentPhase.id, msId, dir)}
              />
            )}

            {selectedItem.type === 'milestone' && selectedItem.phaseId && currentMilestone && (
              <MilestoneEditor
                milestone={currentMilestone}
                onUpdate={(updated) => handleUpdateMilestone(selectedItem.phaseId!, updated)}
                onDelete={() => handleDeleteMilestone(selectedItem.phaseId!, currentMilestone.id)}
                onAddSprint={() => handleAddSprint(selectedItem.phaseId!, currentMilestone.id)}
                onSelectSprint={(spId) =>
                  handleSelectItem({
                    type: 'sprint',
                    phaseId: selectedItem.phaseId,
                    milestoneId: currentMilestone.id,
                    sprintId: spId
                  })
                }
                onDeleteSprint={(spId) =>
                  handleDeleteSprint(selectedItem.phaseId!, currentMilestone.id, spId)
                }
                onMoveSprint={(spId, dir) =>
                  handleMoveSprint(selectedItem.phaseId!, currentMilestone.id, spId, dir)
                }
              />
            )}

            {selectedItem.type === 'sprint' && selectedItem.phaseId && selectedItem.milestoneId && currentSprint && (
              <SprintEditor
                sprint={currentSprint}
                onUpdate={(updated) =>
                  handleUpdateSprint(selectedItem.phaseId!, selectedItem.milestoneId!, updated)
                }
                onDelete={() =>
                  handleDeleteSprint(selectedItem.phaseId!, selectedItem.milestoneId!, currentSprint.id)
                }
                onAddTask={() =>
                  handleAddTask(selectedItem.phaseId!, selectedItem.milestoneId!, currentSprint.id)
                }
                onSelectTask={(tkId) =>
                  handleSelectItem({
                    type: 'task',
                    phaseId: selectedItem.phaseId,
                    milestoneId: selectedItem.milestoneId,
                    sprintId: currentSprint.id,
                    taskId: tkId
                  })
                }
                onDeleteTask={(tkId) =>
                  handleDeleteTask(selectedItem.phaseId!, selectedItem.milestoneId!, currentSprint.id, tkId)
                }
                onDuplicateTask={(tkId) =>
                  handleDuplicateTask(selectedItem.phaseId!, selectedItem.milestoneId!, currentSprint.id, tkId)
                }
                onMoveTask={(tkId, dir) =>
                  handleMoveTask(selectedItem.phaseId!, selectedItem.milestoneId!, currentSprint.id, tkId, dir)
                }
              />
            )}

            {selectedItem.type === 'task' && selectedItem.phaseId && selectedItem.milestoneId && selectedItem.sprintId && currentTask && (
              <TaskEditor
                task={currentTask}
                onUpdate={(updated) =>
                  handleUpdateTask(selectedItem.phaseId!, selectedItem.milestoneId!, selectedItem.sprintId!, updated)
                }
                onDelete={() =>
                  handleDeleteTask(selectedItem.phaseId!, selectedItem.milestoneId!, selectedItem.sprintId!, currentTask.id)
                }
              />
            )}
          </section>

          {/* ======================================================== */}
          {/* RIGHT SIDEBAR: LIVE ROADMAP PREVIEW / SUMMARY (~280px) */}
          {/* ======================================================== */}
          <aside className="hidden lg:block w-72 p-4 border-l border-slate-800/80 shrink-0 overflow-y-auto custom-scrollbar">
            <RoadmapSummary
              state={state}
              saveStatus={saveStatus}
              onPreview={() => setIsPreviewOpen(true)}
              onPublish={() => setIsPublishOpen(true)}
            />
          </aside>
        </main>
      )}

      {/* Modals */}
      <PublishRoadmapModal
        isOpen={isPublishOpen}
        state={state}
        onClose={() => setIsPublishOpen(false)}
        onConfirmPublish={handleConfirmPublish}
        onNavigateToItem={(target) => handleSelectItem(target)}
      />

      <RoadmapPreviewModal
        isOpen={isPreviewOpen}
        state={state}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};
