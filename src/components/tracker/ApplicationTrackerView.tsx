import React, { useState } from 'react';
import { usePaperlessStore } from '../../store/usePaperlessStore';
import { STAGE_CONFIG } from '../../engine/workflow';
import { WORKFLOW_DEFINITIONS } from '../../data/seedWorkflows';
import { FORM_NO, Route, Stamp } from '../paper/Paper';
import { DocSheet } from '../paper/DocSheet';
import { Plus, Search } from 'lucide-react';

export const ApplicationTrackerView: React.FC = () => {
  const { applications, filterType, setFilterType, filterStage, setFilterStage, setActiveTab, selectedAppId, setSelectedAppId } = usePaperlessStore();
  const [q, setQ] = useState('');

  const rows = applications.filter((a) => {
    const t = q.toLowerCase();
    const okQ = !t || [a.id, a.studentName, a.studentId, a.title].some((s) => s.toLowerCase().includes(t));
    const okType = filterType === 'all' || a.workflowType === filterType;
    const okStage = filterStage === 'all'
      || (filterStage === 'active' && !['completed', 'rejected'].includes(a.currentStage))
      || a.currentStage === filterStage;
    return okQ && okType && okStage;
  });
  const sel = applications.find((a) => a.id === selectedAppId) || rows[0];

  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 items-start">
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <h1 className="wide font-black text-[32px] md:text-[40px] leading-none">The register</h1>
          <button className="navbtn navbtn-solid" onClick={() => setActiveTab('new_app')}><Plus size={16} /> File a new form</button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <label className="relative flex-1">
            <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-faint" />
            <input className="w-full bg-whitecopy border border-navy pl-8 pr-2 py-2 typed text-[14px]" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Docket, name, roll no." />
          </label>
          <select className="bg-whitecopy border border-navy px-2 py-2 text-[14px]" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Every form</option>
            {Object.values(WORKFLOW_DEFINITIONS).map((d) => <option key={d.type} value={d.type}>{FORM_NO[d.type]} · {d.title}</option>)}
          </select>
        </div>
        <div className="flex border border-navy w-fit mb-4 bg-whitecopy" role="tablist">
          {[['all', 'All'], ['active', 'Open'], ['completed', 'Sanctioned'], ['rejected', 'Rejected']].map(([k, l]) => (
            <button key={k} role="tab" aria-selected={filterStage === k} onClick={() => setFilterStage(k)}
              className={`cond font-bold uppercase tracking-wider text-[13px] px-3 py-1.5 border-r border-navy last:border-0 ${filterStage === k ? 'bg-navy text-white' : 'hover:bg-canary'}`}>{l}</button>
          ))}
        </div>

        <div className="bg-whitecopy border border-navy">
          <div className="hidden md:grid grid-cols-[110px_1fr_150px_90px] gap-3 px-3 py-2 border-b-2 border-navy formlabel">
            <span>Docket</span><span>Subject · applicant</span><span>Route</span><span className="text-right">Status</span>
          </div>
          {rows.length === 0 && <p className="p-10 text-center text-faint">No file in the register matches. Clear the search or pick “All”.</p>}
          {rows.map((a) => {
            const on = sel?.id === a.id;
            return (
              <button key={a.id} onClick={() => setSelectedAppId(a.id)}
                className={`w-full text-left grid md:grid-cols-[110px_1fr_150px_90px] gap-x-3 gap-y-1.5 px-3 py-3 border-b border-navy/25 last:border-0 ${on ? 'bg-canary' : 'hover:bg-canary/40'}`}>
                <span>
                  <span className="typed font-bold text-[14px] block">{a.id}</span>
                  <span className="formlabel">{FORM_NO[a.workflowType]}</span>
                </span>
                <span className="min-w-0">
                  <span className="font-semibold block truncate">{a.title}</span>
                  <span className="text-[13px] text-faint">{a.studentName} · {a.department}</span>
                </span>
                <span className="self-center"><Route app={a} compact /></span>
                <span className="self-center md:text-right">
                  {['completed', 'rejected', 'revision_needed'].includes(a.currentStage)
                    ? <Stamp stage={a.currentStage} small />
                    : <span className="cond text-[13px] font-semibold">{STAGE_CONFIG[a.currentStage].label}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="xl:sticky xl:top-6">
        {sel ? <DocSheet app={sel} /> : <p className="text-faint p-10 text-center">Pick a file from the register to read it.</p>}
      </div>
    </div>
  );
};
