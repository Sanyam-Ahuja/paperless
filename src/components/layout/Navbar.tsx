import React, { useState } from 'react';
import { usePaperlessStore } from '../../store/usePaperlessStore';
import { UserRole } from '../../types';
import { 
  FileText, 
  PlusCircle, 
  CheckSquare, 
  GitMerge, 
  BarChart3, 
  RotateCcw, 
  User, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { canRoleActOnStage } from '../../engine/workflow';

const ROLES: { id: UserRole; label: string }[] = [
  { id: 'student', label: 'Student' },
  { id: 'academic_advisor', label: 'Academic Advisor' },
  { id: 'head_of_department', label: 'Head of Dept (HOD)' },
  { id: 'dean_academics', label: 'Dean (Academics)' },
  { id: 'registrar', label: 'Registrar (Seal Authority)' },
];

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUserRole, 
    setCurrentUserRole, 
    currentUserName,
    applications, 
    resetDemoData 
  } = usePaperlessStore();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Count pending applications where current role has approval authority
  const pendingForRole = applications.filter((a) => canRoleActOnStage(a.currentStage, currentUserRole)).length;

  return (
    <header className="border-b border-slate-800 bg-[#0B1120]/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab('tracker')}
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shadow-lg shadow-sky-500/10">
              <FileText className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white font-mono">
                  Paper<span className="text-sky-400">less</span>
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                  STATE MACHINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Campus Workflow Automation & Digital Sanctions</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'tracker'
                  ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Applications ({applications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('new_app')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'new_app'
                  ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>New Petition</span>
            </button>

            <button
              onClick={() => setActiveTab('approval_desk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all relative ${
                activeTab === 'approval_desk'
                  ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Approval Desk</span>
              {pendingForRole > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold animate-pulse">
                  {pendingForRole}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('state_machine')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'state_machine'
                  ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <GitMerge className="w-3.5 h-3.5 text-purple-400" />
              <span>Workflow Graph</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'analytics'
                  ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Bottleneck SLA</span>
            </button>
          </nav>

          {/* Right Section: Role Simulator & Reset */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-500 hidden lg:inline font-mono text-[10px]">ROLE:</span>
              <select
                value={currentUserRole}
                onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-all"
              title="Reset seeded simulation data"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-white">Reset Workflow State?</h3>
            <p className="text-xs text-slate-400 mt-2">
              This will restore all administrative petitions, approvals, and audit trails back to the seeded initial status.
            </p>
            <div className="mt-5 flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 rounded-lg text-xs bg-sky-600 hover:bg-sky-500 text-white font-medium"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
