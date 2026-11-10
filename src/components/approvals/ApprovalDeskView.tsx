import React, { useState } from 'react';
import { usePaperlessStore } from '../../store/usePaperlessStore';
import { canRoleActOnStage, STAGE_CONFIG } from '../../engine/workflow';
import { FORM_NO, SHORT_ROLE, copyFor } from '../paper/Paper';
import { DocSheet } from '../paper/DocSheet';

export const ApprovalDeskView: React.FC = () => {
  const { applications, currentUserRole, currentUserName, approveApplication, rejectApplication, requestRevision } = usePaperlessStore();
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');
  const [stampKey, setStampKey] = useState<string | undefined>();
  const [note, setNote] = useState('');
  const [showOthers, setShowOthers] = useState(false);

  const mine = applications.filter((a) => canRoleActOnStage(a.currentStage, currentUserRole));
  const others = applications.filter((a) => !canRoleActOnStage(a.currentStage, currentUserRole));
  const sel = applications.find((a) => a.id === pickedId) || mine[0] || applications[0];
  const canAct = sel && canRoleActOnStage(sel.currentStage, currentUserRole);

  const act = (kind: 'approve' | 'return' | 'reject') => {
    if (!sel) return;
    const fallback = { approve: 'Approved under standing academic regulations.', return: 'Please supply the missing supporting documents and refile.', reject: 'Does not meet the eligibility criteria for this request.' }[kind];
    ({ approve: approveApplication, return: requestRevision, reject: rejectApplication })[kind](sel.id, remarks.trim() || fallback);
    setRemarks('');
    setStampKey(`${sel.id}-${Date.now()}`);
    setNote(`${sel.id} ${kind === 'approve' ? 'signed and sent on' : kind === 'return' ? 'returned to the student' : 'rejected and closed'}.`);
    setTimeout(() => setNote(''), 3500);
  };

  const Item: React.FC<{ id: string }> = ({ id }) => {
    const a = applications.find((x) => x.id === id)!;
    const on = sel?.id === id;
    return (
      <button onClick={() => { setPickedId(id); setStampKey(undefined); }}
        className={`w-full text-left px-3 py-2.5 border border-navy/50 ${copyFor(a.currentStage)} ${on ? 'translate-x-2 shadow-[0_8px_16px_-10px_rgba(17,28,77,.7)] border-navy' : 'hover:translate-x-1'} transition-transform`}>
        <span className="flex justify-between gap-2 text-[13px]"><span className="typed font-bold">{a.id}</span><span className="formlabel">{FORM_NO[a.workflowType]}</span></span>
        <span className="block font-semibold leading-snug mt-0.5">{a.title}</span>
        <span className="block text-[12.5px] text-faint">{a.studentName} · {a.dwellHours} h on desk{a.priority === 'urgent' ? ' · urgent' : ''}</span>
      </button>
    );
  };

  return (
    <div className="grid lg:grid-cols-[320px_minmax(0,1fr)] gap-8 items-start">
      <aside>
        <h1 className="wide font-black text-[32px] leading-none">In-tray</h1>
        <p className="text-faint mt-1 mb-5">{currentUserName} · {SHORT_ROLE[currentUserRole]} desk</p>
        {mine.length === 0 ? (
          <div className="border-2 border-dashed border-navy/40 p-6 text-center">
            <p className="font-semibold">Tray empty.</p>
            <p className="text-[13.5px] text-faint mt-1">Nothing is waiting on a {SHORT_ROLE[currentUserRole].toLowerCase()} signature. Switch “Acting as” to sit at another desk.</p>
          </div>
        ) : (
          <div className="space-y-1.5">{mine.map((a) => <Item key={a.id} id={a.id} />)}</div>
        )}
        <button className="formlabel mt-6 underline underline-offset-4 hover:text-navy" onClick={() => setShowOthers(!showOthers)}>
          {showOthers ? 'Hide' : 'Show'} {others.length} files on other desks
        </button>
        {showOthers && <div className="space-y-1.5 mt-2 opacity-90">{others.map((a) => <Item key={a.id} id={a.id} />)}</div>}
      </aside>

      <div>
        {note && <div role="status" className="mb-4 bg-navy text-white px-4 py-2 cond font-bold uppercase tracking-wider text-[14px]">{note}</div>}
        {sel && (
          <DocSheet app={sel} stampKey={stampKey}>
            <section className={`mt-6 p-4 border-2 ${canAct ? 'border-violet bg-white/60' : 'border-navy/30'}`}>
              {canAct ? (
                <>
                  <label className="block">
                    <span className="formlabel !text-violet">For office use · your remarks</span>
                    <textarea rows={2} className="typein mt-1" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Conditions, reasons, what is missing" />
                  </label>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button onClick={() => act('approve')} className="stamp !transform-none !opacity-100 !mix-blend-normal text-violet !text-[17px] hover:bg-violet hover:text-white px-4 py-2">Approve &amp; sign</button>
                    <button onClick={() => act('return')} className="stamp !transform-none !opacity-100 !mix-blend-normal text-registry !text-[17px] hover:bg-registry hover:text-white px-4 py-2">Return for amendment</button>
                    <button onClick={() => act('reject')} className="stamp !transform-none !opacity-100 !mix-blend-normal text-stampred !text-[17px] hover:bg-stampred hover:text-white px-4 py-2">Reject</button>
                  </div>
                  <p className="text-[12.5px] text-faint mt-3">Approving sends it to {STAGE_CONFIG[STAGE_CONFIG[sel.currentStage].nextSuccessStage ?? 'completed'].label.toLowerCase()}. Every action is written to the routing slip below.</p>
                </>
              ) : (
                <p className="text-[14px] text-faint">This file is with the {SHORT_ROLE[STAGE_CONFIG[sel.currentStage].responsibleRole ?? ''] ?? 'office'} desk{['completed', 'rejected'].includes(sel.currentStage) ? ' and is closed' : ''}. You can read it but not sign it.</p>
              )}
            </section>
          </DocSheet>
        )}
      </div>
    </div>
  );
};
