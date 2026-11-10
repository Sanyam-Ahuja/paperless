import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { ApplicationTrackerView } from './components/tracker/ApplicationTrackerView';
import { NewApplicationView } from './components/forms/NewApplicationView';
import { ApprovalDeskView } from './components/approvals/ApprovalDeskView';
import { StateMachineGraphView } from './components/visualizer/StateMachineGraphView';
import { BottleneckAnalyticsView } from './components/analytics/BottleneckAnalyticsView';
import { usePaperlessStore } from './store/usePaperlessStore';

export const App: React.FC = () => {
  const { activeTab } = usePaperlessStore();

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-300">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'tracker' && <ApplicationTrackerView />}
        {activeTab === 'new_app' && <NewApplicationView />}
        {activeTab === 'approval_desk' && <ApprovalDeskView />}
        {activeTab === 'state_machine' && <StateMachineGraphView />}
        {activeTab === 'analytics' && <BottleneckAnalyticsView />}
      </main>

      <footer className="border-t border-slate-800 bg-[#070B14] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Paperless — University Administrative Workflow Automation & State Machine</p>
          <p className="font-mono text-[11px] text-slate-400">
            Deterministic Finite Automaton • Cryptographic Audit Log • Zero Server Footprint
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
