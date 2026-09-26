// ═══════════════════════════════════════════════════════════════
// RU Ready? — System Design Studio Zustand Store
// Reactive state for canvas, AI dialogue, capacity math & validation
// ═══════════════════════════════════════════════════════════════

import { create } from 'zustand';
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import {
  systemDesignApi,
  SystemDesignSession,
  CapacityInputs,
  CapacityOutputs,
  ValidationReport,
  ChatMessage,
  SystemDesignEvaluationReport,
} from '../api/systemDesign';

interface SystemDesignState {
  session: SystemDesignSession | null;
  isLoadingSession: boolean;
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  activeTab: 'interviewer' | 'capacity' | 'inspector' | 'tradeoffs' | 'problem';
  isSaving: boolean;
  isAiThinking: boolean;
  isSpeechEnabled: boolean;
  evaluationModalOpen: boolean;
  evaluationReport: SystemDesignEvaluationReport | null;
  validationReport: ValidationReport | null;
  capacityInputs: CapacityInputs | null;
  capacityOutputs: CapacityOutputs | null;
  chatMessages: ChatMessage[];
  currentStage: number;

  // Actions
  loadSession: (sessionId: string) => Promise<void>;
  createAndLoadSession: (problemId: string, userName?: string) => Promise<string>;
  setActiveTab: (tab: 'interviewer' | 'capacity' | 'inspector' | 'tradeoffs' | 'problem') => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  toggleSpeech: () => void;
  setEvaluationModalOpen: (open: boolean) => void;

  // React Flow Handlers
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (nodeType: string, label: string, category: any, subType: string, position?: { x: number; y: number }) => void;
  updateNodeConfig: (nodeId: string, config: any) => void;
  deleteSelectedNode: () => void;
  clearCanvas: () => void;
  loadReferenceArchitecture: () => void;

  // Business Logic
  saveGraphToServer: () => Promise<void>;
  calculateCapacity: (inputs: CapacityInputs) => Promise<void>;
  sendMessageToAI: (text: string) => Promise<void>;
  finishInterview: (durationSeconds: number) => Promise<void>;
  resetStore: () => void;
}

export const useSystemDesignStore = create<SystemDesignState>((set, get) => ({
  session: null,
  isLoadingSession: false,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  activeTab: 'interviewer',
  isSaving: false,
  isAiThinking: false,
  isSpeechEnabled: true,
  evaluationModalOpen: false,
  evaluationReport: null,
  validationReport: null,
  capacityInputs: null,
  capacityOutputs: null,
  chatMessages: [],
  currentStage: 1,

  loadSession: async (sessionId: string) => {
    set({ isLoadingSession: true });
    try {
      const session = await systemDesignApi.getSession(sessionId);
      const graphNodes = (session.graphData?.nodes || []).map((n: any) => ({
        ...n,
        type: n.type || 'archNode',
        position: n.position || { x: 100, y: 100 },
      }));
      const graphEdges = session.graphData?.edges || [];

      set({
        session,
        nodes: graphNodes,
        edges: graphEdges,
        capacityInputs: session.capacityInputs,
        capacityOutputs: session.capacityOutputs || null,
        validationReport: session.validationState || null,
        chatMessages: session.transcript || [],
        currentStage: session.stage || 1,
        evaluationReport: session.evaluation || null,
        isLoadingSession: false,
      });
    } catch (err) {
      console.error('[SystemDesignStore] Error loading session:', err);
      set({ isLoadingSession: false });
    }
  },

  createAndLoadSession: async (problemId: string, userName?: string) => {
    set({ isLoadingSession: true });
    try {
      const session = await systemDesignApi.createSession({ problemId, userName });
      const graphNodes = (session.graphData?.nodes || []).map((n: any) => ({
        ...n,
        type: n.type || 'archNode',
        position: n.position || { x: 100, y: 100 },
      }));
      const graphEdges = session.graphData?.edges || [];

      set({
        session,
        nodes: graphNodes,
        edges: graphEdges,
        capacityInputs: session.capacityInputs,
        capacityOutputs: session.capacityOutputs || null,
        validationReport: session.validationState || null,
        chatMessages: session.transcript || [],
        currentStage: session.stage || 1,
        isLoadingSession: false,
      });

      return session.id;
    } catch (err) {
      console.error('[SystemDesignStore] Error creating session:', err);
      set({ isLoadingSession: false });
      throw err;
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
  toggleSpeech: () => set((s) => ({ isSpeechEnabled: !s.isSpeechEnabled })),
  setEvaluationModalOpen: (open) => set({ evaluationModalOpen: open }),

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  onConnect: (connection) => {
    const newEdge: Edge = {
      ...connection,
      id: `e_${connection.source}_${connection.target}_${Date.now()}`,
      animated: true,
      data: { protocol: 'HTTP_REST' },
      style: { stroke: '#4A8BDF', strokeWidth: 2 },
    };
    set((state) => ({
      edges: addEdge(newEdge, state.edges),
    }));
    get().saveGraphToServer();
  },

  addNode: (nodeType, label, category, subType, position) => {
    const id = `node_${subType}_${Date.now().toString(36)}`;
    const newNode: Node = {
      id,
      type: 'archNode',
      position: position || {
        x: 200 + Math.random() * 200,
        y: 150 + Math.random() * 200,
      },
      data: {
        label,
        category,
        subType,
        config: {
          instances: 2,
          replication: 3,
        },
      },
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
      selectedNodeId: id,
    }));

    get().saveGraphToServer();
  },

  updateNodeConfig: (nodeId, config) => {
    set((state) => ({
      nodes: state.nodes.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              config: { ...((n.data as any).config || {}), ...config },
            },
          };
        }
        return n;
      }),
    }));
    get().saveGraphToServer();
  },

  deleteSelectedNode: () => {
    const { selectedNodeId, nodes, edges } = get();
    if (!selectedNodeId) return;

    set({
      nodes: nodes.filter((n) => n.id !== selectedNodeId),
      edges: edges.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId),
      selectedNodeId: null,
    });
    get().saveGraphToServer();
  },

  clearCanvas: () => {
    set({ nodes: [], edges: [], selectedNodeId: null });
    get().saveGraphToServer();
  },

  loadReferenceArchitecture: () => {
    const { session } = get();
    if (!session?.problem?.referenceArchitecture) return;

    const ref = session.problem.referenceArchitecture;
    const refNodes = (ref.nodes || []).map((n: any) => ({
      ...n,
      type: 'archNode',
    }));
    const refEdges = (ref.edges || []).map((e: any) => ({
      ...e,
      animated: true,
      style: { stroke: '#4A8BDF', strokeWidth: 2 },
    }));

    set({
      nodes: refNodes,
      edges: refEdges,
    });
    get().saveGraphToServer();
  },

  saveGraphToServer: async () => {
    const { session, nodes, edges } = get();
    if (!session?.id) return;

    set({ isSaving: true });
    try {
      const res = await systemDesignApi.saveGraph(session.id, { nodes, edges });
      if (res.validation) {
        set({ validationReport: res.validation });
      }
    } catch (err) {
      console.error('[SystemDesignStore] Error saving graph:', err);
    } finally {
      set({ isSaving: false });
    }
  },

  calculateCapacity: async (inputs: CapacityInputs) => {
    const { session } = get();
    if (!session?.id) return;

    try {
      const outputs = await systemDesignApi.updateCapacity(session.id, inputs);
      set({ capacityInputs: inputs, capacityOutputs: outputs });
    } catch (err) {
      console.error('[SystemDesignStore] Error calculating capacity:', err);
    }
  },

  sendMessageToAI: async (text: string) => {
    const { session, chatMessages } = get();
    if (!session?.id || !text.trim()) return;

    const optimisticUserMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'candidate',
      content: text,
      timestamp: new Date().toISOString(),
      stage: get().currentStage,
    };

    set({
      chatMessages: [...chatMessages, optimisticUserMsg],
      isAiThinking: true,
    });

    try {
      const aiReply = await systemDesignApi.sendChatMessage(session.id, text);
      set((state) => ({
        chatMessages: [...state.chatMessages, aiReply],
        currentStage: aiReply.stage || state.currentStage,
        isAiThinking: false,
      }));

      // Speak AI message if audio speech is enabled
      if (get().isSpeechEnabled && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const cleanText = aiReply.content.replace(/[*_#`[\]()]/g, '');
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.rate = 1.05;
          window.speechSynthesis.speak(utterance);
        } catch {
          // ignore speech synthesis errors
        }
      }
    } catch (err) {
      console.error('[SystemDesignStore] Error sending chat message:', err);
      set({ isAiThinking: false });
    }
  },

  finishInterview: async (durationSeconds: number) => {
    const { session } = get();
    if (!session?.id) return;

    try {
      const report = await systemDesignApi.finishSession(session.id, durationSeconds);
      set({
        evaluationReport: report,
        evaluationModalOpen: true,
      });
    } catch (err) {
      console.error('[SystemDesignStore] Error finishing interview:', err);
    }
  },

  resetStore: () => {
    set({
      session: null,
      isLoadingSession: false,
      nodes: [],
      edges: [],
      selectedNodeId: null,
      activeTab: 'interviewer',
      isSaving: false,
      isAiThinking: false,
      evaluationModalOpen: false,
      evaluationReport: null,
      validationReport: null,
      capacityInputs: null,
      capacityOutputs: null,
      chatMessages: [],
      currentStage: 1,
    });
  },
}));
