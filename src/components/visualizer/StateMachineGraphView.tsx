import React, { useState } from 'react';
import { usePaperlessStore } from '../../store/usePaperlessStore';
import { WorkflowStage } from '../../types';
import { STAGE_CONFIG } from '../../engine/workflow';
import { SHORT_ROLE, copyFor } from '../paper/Paper';

const MAIN: WorkflowStage[] = ['submitted', 'advisor_review', 'hod_approval', 'dean_review', 'registrar_seal', 'completed'];
const SHORT: Record<string, string> = { submitted: 'Submitted', advisor_review: 'Advisor review', hod_approval: 'HOD approval', dean_review: 'Dean sanction', registrar_seal: 'Registrar seal', completed: 'Sanctioned', revision_needed: 'Back to student', rejected: 'Rejected' };
const W = 150, H = 74, GAP = 40, X0 = 20, Y0 = 40;
const x = (i: number) => X0 + i * (W + GAP);

/** The routing diagram printed on the back of every form, drawn as a state machine. */
export const StateMachineGraphView: React.FC = () => {
  const { applications, setSelectedAppId, setActiveTab } = usePaperlessStore();
  const [sel, setSel] = useState<WorkflowStage>('advisor_review');
  const count = (s: WorkflowStage) => applications.filter((a) => a.currentStage === s).length;
  const inSel = applications.filter((a) => a.currentStage === sel);

  const Node: React.FC<{ s: WorkflowStage; cx: number; cy: number; dashed?: boolean; fill: string }> = ({ s, cx, cy, dashed, fill }) => {
    const on = s === sel;
    const n = count(s);
    return (
      <g onClick={() => setSel(s)} className="cursor-pointer" role="button" tabIndex={0} aria-label={`${STAGE_CONFIG[s].label}, ${n} files`}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel(s)}>
        <rect x={cx} y={cy} width={W} height={H} fill={fill} stroke="#1b2a6b" strokeWidth={on ? 3 : 1.25} strokeDasharray={dashed ? '6 4' : undefined} />
        <text x={cx + 10} y={cy + 22} fontSize="11" fontWeight="700" fill="#4a5584" style={{ fontStretch: '78%', letterSpacing: '0.06em' }}>{(SHORT_ROLE[STAGE_CONFIG[s].responsibleRole ?? ''] ?? 'Office').toUpperCase()}</text>
        <text x={cx + 10} y={cy + 42} fontSize="14" fontWeight="800" fill="#1b2a6b" style={{ fontStretch: '80%' }}>{SHORT[s]}</text>
        <text x={cx + 10} y={cy + 62} fontSize="13" fill="#1d1d1f" fontFamily="Courier Prime, monospace">{n} file{n === 1 ? '' : 's'}</text>
        {n > 0 && <circle cx={cx + W - 14} cy={cy + 14} r="7" fill="#5b2d8e" />}
      </g>
    );
  };

  const total = x(MAIN.length - 1) + W + X0;
  return (
    <div>
      <h1 className="wide font-black text-[32px] md:text-[40px] leading-none">Routing</h1>
      <p className="text-faint mt-2 mb-6 max-w-[70ch]">Every form moves left to right, one signature per box. Any desk can return a form to the student (it re-enters at the start) or reject it outright. Click a box to see what is sitting there.</p>

      <div className="bg-whitecopy border border-navy overflow-x-auto">
        <svg viewBox={`0 0 ${total} 300`} className="min-w-[980px] w-full" role="img" aria-label="Routing state machine">
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#1b2a6b" /></marker>
            <marker id="arrv" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#b3202a" /></marker>
          </defs>
          {MAIN.slice(0, -1).map((_, i) => (
            <line key={i} x1={x(i) + W} y1={Y0 + H / 2} x2={x(i + 1) - 2} y2={Y0 + H / 2} stroke="#1b2a6b" strokeWidth="1.5" markerEnd="url(#arr)" />
          ))}
          {/* return loop: from the review desks down to the amendment box, back up to submission */}
          <path d={`M ${x(2) + W / 2} ${Y0 + H} L ${x(2) + W / 2} 196 L ${x(1) + W + 4} 196`} fill="none" stroke="#1b2a6b" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#arr)" />
          <path d={`M ${x(1)} ${196 + 0} L ${x(0) + W / 2} 196 L ${x(0) + W / 2} ${Y0 + H + 4}`} fill="none" stroke="#1b2a6b" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#arr)" />
          <path d={`M ${x(3) + W / 2} ${Y0 + H} L ${x(3) + W / 2} ${196 - 2}`} fill="none" stroke="#b3202a" strokeWidth="1.5" markerEnd="url(#arrv)" />
          <text x={x(2) + W / 2 + 8} y={Y0 + H + 22} fontSize="12" fill="#4a5584">returned</text>
          <text x={x(3) + W / 2 + 8} y={Y0 + H + 22} fontSize="12" fill="#b3202a">rejected</text>
          {MAIN.map((s, i) => <Node key={s} s={s} cx={x(i)} cy={Y0} fill={s === 'completed' ? '#fdfdfb' : '#fff1a8'} />)}
          <Node s="revision_needed" cx={x(1)} cy={196 - H / 2} dashed fill="#d3e4ff" />
          <Node s="rejected" cx={x(3)} cy={196} fill="#ffd3dc" />
        </svg>
      </div>

      <section className="mt-8">
        <h2 className="cond font-extrabold uppercase text-[22px]">{STAGE_CONFIG[sel].label} <span className="typed font-normal text-[16px] normal-case text-faint">· {inSel.length} file{inSel.length === 1 ? '' : 's'}</span></h2>
        {inSel.length === 0 ? <p className="text-faint mt-2">Nothing is sitting in this box right now.</p> : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-3">
            {inSel.map((a) => (
              <button key={a.id} onClick={() => { setSelectedAppId(a.id); setActiveTab('tracker'); }} className={`sheet ${copyFor(a.currentStage)} text-left p-4 hover:-translate-y-0.5 transition-transform`}>
                <span className="typed font-bold text-[14px]">{a.id}</span>
                <span className="block font-semibold mt-1 leading-snug">{a.title}</span>
                <span className="block text-[13px] text-faint mt-1">{a.studentName} · open in register</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
