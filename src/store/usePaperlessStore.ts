import { create } from 'zustand';
import { 
  ApplicationRecord, 
  UserRole, 
  WorkflowStage, 
  WorkflowType 
} from '../types';
import { SEED_APPLICATIONS, WORKFLOW_DEFINITIONS } from '../data/seedWorkflows';
import { STAGE_CONFIG, executeTransition } from '../engine/workflow';

const STORAGE_KEY = 'paperless_state_v1';

interface PaperlessState {
  activeTab: 'tracker' | 'new_app' | 'approval_desk' | 'state_machine' | 'analytics';
  setActiveTab: (tab: PaperlessState['activeTab']) => void;

  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;

  currentUserName: string;
  setCurrentUserName: (name: string) => void;

  applications: ApplicationRecord[];
  selectedAppId: string | null;
  filterType: string;
  filterStage: string;

  // Actions
  setSelectedAppId: (id: string | null) => void;
  setFilterType: (type: string) => void;
  setFilterStage: (stage: string) => void;

  submitApplication: (newApp: Omit<ApplicationRecord, 'id' | 'createdAt' | 'updatedAt' | 'history' | 'currentStage' | 'dwellHours'>) => void;
  approveApplication: (appId: string, remarks: string) => void;
  rejectApplication: (appId: string, remarks: string) => void;
  requestRevision: (appId: string, remarks: string) => void;

  resetDemoData: () => void;
}

function loadPersistedApps(): ApplicationRecord[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load paperless state', e);
  }
  return null;
}

function saveApps(apps: ApplicationRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (e) {
    console.warn('Failed to save paperless state', e);
  }
}

const initialApps = loadPersistedApps() || SEED_APPLICATIONS;

export const usePaperlessStore = create<PaperlessState>((set, get) => ({
  activeTab: 'tracker',
  setActiveTab: (tab) => set({ activeTab: tab }),

  currentUserRole: 'academic_advisor', // default to an approver role so desk is immediately interactive
  setCurrentUserRole: (role) => {
    const nameMap: Record<UserRole, string> = {
      student: 'Aarav Nair (Student)',
      academic_advisor: 'Dr. Ramesh Sundaram (Advisor)',
      head_of_department: 'Prof. Vikram Sen (HOD)',
      dean_academics: 'Prof. Anjali Roy (Dean)',
      registrar: 'Dr. K. Swaminathan (Registrar)',
    };
    set({ currentUserRole: role, currentUserName: nameMap[role] });
  },

  currentUserName: 'Dr. Ramesh Sundaram (Advisor)',
  setCurrentUserName: (name) => set({ currentUserName: name }),

  applications: initialApps,
  selectedAppId: initialApps[0]?.id || null,
  filterType: 'all',
  filterStage: 'all',

  setSelectedAppId: (id) => set({ selectedAppId: id }),
  setFilterType: (type) => set({ filterType: type }),
  setFilterStage: (stage) => set({ filterStage: stage }),

  submitApplication: (newAppData) => {
    const newId = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const application: ApplicationRecord = {
      ...newAppData,
      id: newId,
      currentStage: 'advisor_review', // directly into review for demonstration speed
      createdAt: now,
      updatedAt: now,
      dwellHours: 1,
      history: [
        {
          id: `audit-${Date.now()}`,
          stage: 'submitted',
          actorName: newAppData.studentName,
          actorRole: 'student',
          action: 'submitted',
          remarks: 'Application submitted with verified document attachments.',
          timestamp: now,
        },
      ],
    };

    set((state) => {
      const updated = [application, ...state.applications];
      saveApps(updated);
      return {
        applications: updated,
        selectedAppId: application.id,
        activeTab: 'tracker',
      };
    });
  },

  approveApplication: (appId, remarks) => {
    const { applications, currentUserRole, currentUserName } = get();
    const app = applications.find((a) => a.id === appId);
    if (!app) return;

    const currentConfig = STAGE_CONFIG[app.currentStage];
    const nextStage = currentConfig.nextSuccessStage || 'completed';

    const updatedApp = executeTransition(
      app,
      nextStage,
      currentUserName,
      currentUserRole,
      'approved',
      remarks
    );

    const updatedList = applications.map((a) => (a.id === appId ? updatedApp : a));
    saveApps(updatedList);
    set({ applications: updatedList });
  },

  rejectApplication: (appId, remarks) => {
    const { applications, currentUserRole, currentUserName } = get();
    const app = applications.find((a) => a.id === appId);
    if (!app) return;

    const updatedApp = executeTransition(
      app,
      'rejected',
      currentUserName,
      currentUserRole,
      'rejected',
      remarks
    );

    const updatedList = applications.map((a) => (a.id === appId ? updatedApp : a));
    saveApps(updatedList);
    set({ applications: updatedList });
  },

  requestRevision: (appId, remarks) => {
    const { applications, currentUserRole, currentUserName } = get();
    const app = applications.find((a) => a.id === appId);
    if (!app) return;

    const updatedApp = executeTransition(
      app,
      'revision_needed',
      currentUserName,
      currentUserRole,
      'requested_revision',
      remarks
    );

    const updatedList = applications.map((a) => (a.id === appId ? updatedApp : a));
    saveApps(updatedList);
    set({ applications: updatedList });
  },

  resetDemoData: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      applications: SEED_APPLICATIONS,
      selectedAppId: SEED_APPLICATIONS[0].id,
      filterType: 'all',
      filterStage: 'all',
      activeTab: 'tracker',
    });
  },
}));
