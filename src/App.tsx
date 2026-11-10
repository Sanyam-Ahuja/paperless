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
    <div className="min-h-screen bg-[#F7F6F2] text-slate-800 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'tracker' && <ApplicationTrackerView />}
        {activeTab === 'new_app' && <NewApplicationView />}
        {activeTab === 'approval_desk' && <ApprovalDeskView />}
        {activeTab === 'state_machine' && <StateMachineGraphView />}
        {activeTab === 'analytics' && <BottleneckAnalyticsView />}
      </main>

      <footer className="border-t border-stone-300 bg-[#EFECE6] py-6 text-center text-xs text-stone-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-stone-800">
            © 2026 Office of the University Registrar • Official E-Governance & Academic Petition Portal
          </p>
          <p className="font-mono text-[11px] text-stone-500">
            Formally Verified Finite State Automaton • Authenticated Audit Trail
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
