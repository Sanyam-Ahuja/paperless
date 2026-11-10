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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-[1320px] mx-auto px-4 md:px-8 py-8">
        {activeTab === 'tracker' && <ApplicationTrackerView />}
        {activeTab === 'new_app' && <NewApplicationView />}
        {activeTab === 'approval_desk' && <ApprovalDeskView />}
        {activeTab === 'state_machine' && <StateMachineGraphView />}
        {activeTab === 'analytics' && <BottleneckAnalyticsView />}
      </main>
      <footer className="max-w-[1320px] w-full mx-auto px-4 md:px-8 py-5 text-[13px] text-faint cond uppercase tracking-wider flex flex-col sm:flex-row justify-between gap-1">
        <span>Demonstration records · stored in this browser only</span>
        <span>Switch “Acting as” to sign from another desk</span>
      </footer>
    </div>
  );
};

export default App;
