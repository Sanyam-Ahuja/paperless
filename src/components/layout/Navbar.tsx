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
  ShieldCheck,
  Building2,
  Stamp
} from 'lucide-react';
import { canRoleActOnStage } from '../../engine/workflow';

const ROLES: { id: UserRole; label: string }[] = [
  { id: 'student', label: 'Student Persona' },
  { id: 'academic_advisor', label: 'Faculty Advisor' },
  { id: 'head_of_department', label: 'Dept Head (HOD)' },
  { id: 'dean_academics', label: 'Dean of Academics' },
  { id: 'registrar', label: 'Registrar (Seal Authority)' },
];

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUserRole, 
    setCurrentUserRole, 
    applications, 
    resetDemoData 
  } = usePaperlessStore();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const pendingForRole = applications.filter((a) => canRoleActOnStage(a.currentStage, currentUserRole)).length;

  return (
    <header className="border-b border-stone-300 bg-[#FFFFFF]/90 backdrop-blur sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand with University Crest feel */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab('tracker')}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-600/30 flex items-center justify-center shadow-xs">
              <Stamp className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 font-serif">
                  Paper<span className="text-amber-800">less</span>
                </span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                  ACADEMIC SENATE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Office of Academic Affairs & Digital Sanctions</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === 'tracker'
                  ? 'bg-amber-100/70 text-amber-950 border border-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Petitions ({applications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('new_app')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === 'new_app'
                  ? 'bg-amber-100/70 text-amber-950 border border-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Draft Petition</span>
            </button>

            <button
              onClick={() => setActiveTab('approval_desk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all relative ${
                activeTab === 'approval_desk'
                  ? 'bg-amber-100/70 text-amber-950 border border-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-amber-700" />
              <span>Sanction Bench</span>
              {pendingForRole > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-red-100 text-red-800 border border-red-300 font-mono font-bold animate-pulse">
                  {pendingForRole}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('state_machine')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === 'state_machine'
                  ? 'bg-amber-100/70 text-amber-950 border border-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
              }`}
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Automaton Graph</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === 'analytics'
                  ? 'bg-amber-100/70 text-amber-950 border border-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>SLA Latency</span>
            </button>
          </nav>

          {/* Right Section: Persona Selector */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 bg-stone-100 border border-stone-300 rounded-xl px-2.5 py-1 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
              <span className="text-stone-500 font-mono text-[10px] hidden lg:inline">AUTHORITY:</span>
              <select
                value={currentUserRole}
                onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 transition-all"
              title="Reset seeded simulation data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-300 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 font-serif">Reset Institutional Records?</h3>
            <p className="text-xs text-slate-600 mt-2">
              This will restore all academic petitions, advisor endorsements, and registrar seals to original baseline state.
            </p>
            <div className="mt-5 flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 rounded-lg text-xs bg-red-700 hover:bg-red-800 text-white font-medium"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
