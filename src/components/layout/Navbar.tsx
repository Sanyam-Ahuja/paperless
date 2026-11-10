import React, { useState } from 'react';
import { usePaperlessStore } from '../../store/usePaperlessStore';
import { UserRole } from '../../types';
import { canRoleActOnStage } from '../../engine/workflow';

const ROLES: { id: UserRole; label: string }[] = [
  { id: 'student', label: 'Student' },
  { id: 'academic_advisor', label: 'Faculty advisor' },
  { id: 'head_of_department', label: 'Head of department' },
  { id: 'dean_academics', label: 'Dean of academics' },
  { id: 'registrar', label: 'Registrar' },
];

type Tab = ReturnType<typeof usePaperlessStore.getState>['activeTab'];

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, currentUserRole, setCurrentUserRole, currentUserName, applications, resetDemoData } = usePaperlessStore();
  const [confirm, setConfirm] = useState(false);
  const inTray = applications.filter((a) => canRoleActOnStage(a.currentStage, currentUserRole)).length;

  const TABS: { id: Tab; label: string; tint: string; badge?: number }[] = [
    { id: 'tracker', label: 'Register', tint: 'bg-canary' },
    { id: 'approval_desk', label: 'In-tray', tint: 'bg-whitecopy', badge: inTray },
    { id: 'new_app', label: 'New form', tint: 'bg-bluecopy' },
    { id: 'state_machine', label: 'Routing', tint: 'bg-pinkcopy' },
    { id: 'analytics', label: 'Delays', tint: 'bg-[#e6dccb]' },
  ];

  return (
    <header className="bg-registry text-white">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 pt-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <button onClick={() => setActiveTab('tracker')} className="text-left">
          <div className="wide font-black text-[30px] leading-none tracking-tight">PAPERLESS</div>
          <div className="cond text-[14px] text-white/70 mt-1 uppercase tracking-[0.14em]">Office of Academic Affairs · forms &amp; sanctions</div>
        </button>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] pb-1">
          <label className="flex items-center gap-2">
            <span className="cond uppercase tracking-wider text-white/70 text-[12px]">Acting as</span>
            <select value={currentUserRole} onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
              className="bg-registry-deep border border-white/40 px-2 py-1 font-semibold">
              {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </label>
          <span className="typed !text-white/80 text-[13px] hidden lg:inline">{currentUserName}</span>
          {confirm ? (
            <span className="flex items-center gap-2 bg-registry-deep px-2 py-1">
              Restore every file?
              <button className="underline font-bold" onClick={() => { resetDemoData(); setConfirm(false); }}>Restore</button>
              <button className="underline" onClick={() => setConfirm(false)}>Keep</button>
            </span>
          ) : (
            <button onClick={() => setConfirm(true)} className="cond uppercase tracking-wider text-[12px] text-white/70 hover:text-white underline underline-offset-4">Reset demo</button>
          )}
        </div>
      </div>
      {/* folder tabs hang off the band onto the blotter */}
      <nav className="max-w-[1320px] mx-auto px-4 md:px-8 flex gap-1 overflow-x-auto pt-5 -mb-px" aria-label="Sections">
        {TABS.map((t) => {
          const on = t.id === activeTab;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} aria-current={on ? 'page' : undefined}
              className={`${t.tint} text-navy shrink-0 px-4 md:px-5 pt-2 ${on ? 'pb-3 -mb-1' : 'pb-2 opacity-75 hover:opacity-100 translate-y-1 hover:translate-y-0'} rounded-t-[6px] border border-b-0 border-navy/40 transition-all flex items-center gap-2`}>
              <span className="cond font-bold uppercase tracking-[0.06em] text-[15px]">{t.label}</span>
              {!!t.badge && <span className="bg-violet text-white text-[12px] font-bold px-1.5 rounded-full">{t.badge}</span>}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
