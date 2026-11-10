import React from 'react';
import { ApplicationRecord, WorkflowStage } from '../../types';
import { STAGE_CONFIG } from '../../engine/workflow';
import { WORKFLOW_DEFINITIONS } from '../../data/seedWorkflows';

/** Which carbon copy a document is printed on depends on where it sits in the process. */
export const copyFor = (stage: WorkflowStage) =>
  stage === 'completed' ? 'bg-whitecopy' : stage === 'rejected' ? 'bg-pinkcopy' : stage === 'revision_needed' ? 'bg-bluecopy' : 'bg-canary';

export const FORM_NO: Record<string, string> = {
  leave_application: 'AA-101',
  bonafide_certificate: 'AA-114',
  lab_access_permit: 'AA-203',
  grade_reevaluation: 'AA-310',
  equipment_requisition: 'AA-412',
};

export const SHORT_ROLE: Record<string, string> = {
  student: 'Student',
  academic_advisor: 'Advisor',
  head_of_department: 'HOD',
  dean_academics: 'Dean',
  registrar: 'Registrar',
};

export const Stamp: React.FC<{ stage: WorkflowStage; small?: boolean; animate?: boolean; date?: string }> = ({ stage, small, animate, date }) => {
  const map: Partial<Record<WorkflowStage, { t: string; c: string }>> = {
    completed: { t: 'Sanctioned', c: 'text-violet' },
    rejected: { t: 'Rejected', c: 'text-stampred' },
    revision_needed: { t: 'Returned', c: 'text-registry' },
  };
  const s = map[stage];
  if (!s) return null;
  return (
    <span className={`stamp ${s.c} ${animate ? 'thunk' : ''} ${small ? 'text-[11px] !border-2 !px-1.5 !py-0.5' : 'text-[26px]'}`}>
      {s.t}
      {!small && <span className="text-[10px] tracking-[0.2em] mt-1 font-bold">Office of Academic Affairs{date ? ` · ${date}` : ''}</span>}
    </span>
  );
};

/** The routing boxes printed along the foot of every form: one signature box per desk. */
export const Route: React.FC<{ app: ApplicationRecord; compact?: boolean }> = ({ app, compact }) => {
  const stages = (WORKFLOW_DEFINITIONS[app.workflowType]?.stages ?? []).filter((s) => s !== 'submitted' && s !== 'completed');
  const signed = (s: WorkflowStage) => app.currentStage === 'completed' || app.history.some((h) => h.stage === s && h.action === 'approved');
  return (
    <div className={`flex ${compact ? 'gap-1' : 'gap-0 border border-navy'}`}>
      {stages.map((s) => {
        const ok = signed(s);
        const here = app.currentStage === s;
        const role = STAGE_CONFIG[s].responsibleRole ?? '';
        return compact ? (
          <span key={s} title={`${STAGE_CONFIG[s].label}${ok ? ' · signed' : here ? ' · on desk now' : ''}`}
            className={`w-6 h-6 border border-navy grid place-items-center text-[9px] font-bold cond ${ok ? 'bg-navy text-white' : here ? 'bg-white ring-2 ring-violet' : 'bg-white/50 text-faint'}`}>
            {SHORT_ROLE[role]?.[0] ?? '·'}
          </span>
        ) : (
          <div key={s} className={`flex-1 min-w-0 px-2 py-1.5 border-r border-navy last:border-r-0 ${here ? 'bg-white/70' : ''}`}>
            <div className="formlabel truncate">{SHORT_ROLE[role]}</div>
            <div className={`typed text-[13px] h-5 truncate ${ok ? '' : 'text-faint/60'}`}>
              {ok ? 'signed' : here ? 'awaiting…' : '—'}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Field: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className = '' }) => (
  <div className={`border-b border-navy/50 pb-1 ${className}`}>
    <div className="formlabel">{label}</div>
    <div className="typed text-[15px] min-h-[22px]">{children}</div>
  </div>
);
