import React from 'react';
import { ApplicationRecord } from '../../types';
import { STAGE_CONFIG } from '../../engine/workflow';
import { WORKFLOW_DEFINITIONS } from '../../data/seedWorkflows';
import { FORM_NO, Field, Route, SHORT_ROLE, Stamp, copyFor } from './Paper';

const human = (k: string) => k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').toLowerCase();

/** One application rendered as the physical form it replaces. */
export const DocSheet: React.FC<{ app: ApplicationRecord; stampKey?: string; children?: React.ReactNode }> = ({ app, stampKey, children }) => {
  const def = WORKFLOW_DEFINITIONS[app.workflowType];
  const extra = Object.entries(app.formData).filter(([k]) => k !== 'justification' && k !== 'submittedOnline');

  return (
    <article className={`sheet sheet-perf ${copyFor(app.currentStage)} px-5 md:px-8 pt-7 pb-6`}>
      <div className="absolute right-6 top-24 md:top-20 pointer-events-none" key={stampKey}>
        <Stamp stage={app.currentStage} animate={!!stampKey} date={app.updatedAt?.slice(0, 10)} />
      </div>

      <header className="flex justify-between items-start gap-4 border-b-2 border-navy pb-3">
        <div>
          <div className="formlabel">Form {FORM_NO[app.workflowType]} · {def?.slaDays}-day service standard</div>
          <h2 className="cond font-extrabold text-[24px] md:text-[28px] uppercase leading-tight mt-0.5">{def?.title}</h2>
        </div>
        <div className="text-right shrink-0">
          <div className="formlabel">Docket no.</div>
          <div className="typed text-[17px] font-bold">{app.id}</div>
          {app.priority === 'urgent' && <div className="cond font-black uppercase text-stampred text-[13px] tracking-wider border border-stampred px-1 mt-1 inline-block">Urgent</div>}
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-3 mt-4">
        <Field label="Applicant" className="col-span-2">{app.studentName}</Field>
        <Field label="Roll no.">{app.studentId}</Field>
        <Field label="Semester">{app.semester}</Field>
        <Field label="Department" className="col-span-2">{app.department}</Field>
        <Field label="Filed">{app.createdAt?.slice(0, 16)}</Field>
        <Field label="On desk for">{app.dwellHours} h</Field>
      </div>

      <Field label="Subject" className="mt-4">{app.title}</Field>
      {app.formData.justification && <div className="mt-4">
        <div className="formlabel">Statement of purpose</div>
        <p className="typed text-[15px] leading-[1.75] mt-1 bg-[linear-gradient(transparent_calc(1.75em-1px),rgba(27,42,107,.25)_1px)] bg-[length:100%_1.75em]">
          {String(app.formData.justification)}
        </p>
      </div>}
      {extra.length > 0 && (
        <div className="grid grid-cols-2 gap-x-5 gap-y-3 mt-4">
          {extra.map(([k, v]) => <Field key={k} label={human(k)}>{String(v)}</Field>)}
        </div>
      )}

      <div className="mt-5">
        <div className="formlabel mb-1">Enclosures ({app.attachments.length})</div>
        <ol className="typed text-[14px] list-[lower-roman] pl-6 space-y-0.5">
          {app.attachments.map((a) => (
            <li key={a.id}>{a.name} <span className="text-faint">· {a.size}{a.verified ? ' · checked' : ' · unchecked'}</span></li>
          ))}
          {app.attachments.length === 0 && <li className="list-none -ml-6 text-faint">none</li>}
        </ol>
      </div>

      <div className="mt-5">
        <div className="formlabel mb-1">Route · now with {STAGE_CONFIG[app.currentStage].label.toLowerCase()}</div>
        <Route app={app} />
      </div>

      {children}

      <section className="mt-6 pt-4 border-t-2 border-dashed border-navy/50">
        <div className="formlabel mb-2">Routing slip · every signature on this file</div>
        <ol className="space-y-2.5">
          {app.history.map((h) => (
            <li key={h.id} className="grid grid-cols-[88px_1fr] gap-3 text-[14px]">
              <span className={`cond font-black uppercase text-[13px] tracking-wider ${h.action === 'approved' ? 'text-violet' : h.action === 'rejected' ? 'text-stampred' : 'text-navy'}`}>
                {h.action.replace('requested_revision', 'returned')}
              </span>
              <span>
                <span className="font-semibold">{h.actorName}</span> <span className="text-faint">· {SHORT_ROLE[h.actorRole]} · {h.timestamp}</span>
                <span className="typed block text-[14px]">“{h.remarks}”</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
};
