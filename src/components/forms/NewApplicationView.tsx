import React, { useEffect, useState } from 'react';
import { usePaperlessStore } from '../../store/usePaperlessStore';
import { WorkflowType } from '../../types';
import { WORKFLOW_DEFINITIONS } from '../../data/seedWorkflows';
import { FORM_NO } from '../paper/Paper';
import { Paperclip, X } from 'lucide-react';

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

export const NewApplicationView: React.FC = () => {
  const { submitApplication, setActiveTab } = usePaperlessStore();
  const [type, setType] = useState<WorkflowType>('lab_access_permit');
  const [title, setTitle] = useState('');
  const [name, setName] = useState('Siddharth Rao');
  const [roll, setRoll] = useState('2023-CS-088');
  const [dept, setDept] = useState('Computer Science & Engineering');
  const [sem, setSem] = useState('Semester 6');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [why, setWhy] = useState('');
  const [certify, setCertify] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const def = WORKFLOW_DEFINITIONS[type];

  // the required enclosures for this form start pre-listed as sample scans
  useEffect(() => {
    setFiles(def.requiredAttachments.map((r) => ({ name: `${r.replace(/[^\w]+/g, '_')}.pdf`, size: '420 KB' })));
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  const missing = [!title.trim() && 'a subject', !why.trim() && 'a statement of purpose', !certify && 'the certification tick'].filter(Boolean) as string[];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (missing.length) return;
    submitApplication({
      workflowType: type, title: title.trim(), studentName: name.trim(), studentId: roll.trim(), department: dept.trim(), semester: sem.trim(), priority,
      formData: { justification: why.trim(), submittedOnline: true },
      attachments: files.map((f, i) => ({ id: `att-new-${Date.now()}-${i}`, name: f.name, size: f.size, mimeType: 'application/pdf', uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16), verified: true })),
    });
  };

  return (
    <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-8 items-start">
      <aside>
        <h1 className="wide font-black text-[32px] leading-none mb-2">New form</h1>
        <p className="text-faint mb-5">Pick the form, fill it in, file it. It goes straight to your advisor’s in-tray.</p>
        <div className="space-y-1.5">
          {Object.values(WORKFLOW_DEFINITIONS).map((d) => {
            const on = d.type === type;
            return (
              <button key={d.type} onClick={() => setType(d.type)} aria-pressed={on}
                className={`w-full text-left border border-navy px-3 py-2.5 transition-all ${on ? 'bg-bluecopy translate-x-2 shadow-[0_6px_14px_-8px_rgba(17,28,77,.6)]' : 'bg-whitecopy hover:translate-x-1'}`}>
                <span className="typed font-bold text-[13px]">{FORM_NO[d.type]}</span>
                <span className="block cond font-bold text-[16px] leading-tight">{d.title}</span>
                <span className="block text-[12.5px] text-faint mt-0.5">{d.stages.length - 2} signatures · {d.slaDays}-day standard</span>
              </button>
            );
          })}
        </div>
      </aside>

      <form onSubmit={submit} className="sheet sheet-perf bg-bluecopy px-5 md:px-10 pt-8 pb-8">
        <header className="flex justify-between gap-4 border-b-2 border-navy pb-3 mb-6">
          <div>
            <div className="formlabel">Form {FORM_NO[type]} · Office of Academic Affairs</div>
            <h2 className="cond font-extrabold text-[26px] uppercase leading-tight">{def.title}</h2>
            <p className="text-[13.5px] text-faint mt-1 max-w-[60ch]">{def.description}</p>
          </div>
          <div className="text-right shrink-0"><div className="formlabel">Docket no.</div><div className="typed text-faint">assigned on filing</div></div>
        </header>

        <fieldset className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
          <legend className="formlabel !text-navy mb-2">Part A · Applicant</legend>
          <label><span className="formlabel">Full name</span><input className="typein" value={name} onChange={(e) => setName(e.target.value)} required /></label>
          <label><span className="formlabel">Roll no.</span><input className="typein" value={roll} onChange={(e) => setRoll(e.target.value)} required /></label>
          <label><span className="formlabel">Department</span><input className="typein" value={dept} onChange={(e) => setDept(e.target.value)} required /></label>
          <label><span className="formlabel">Semester</span><input className="typein" value={sem} onChange={(e) => setSem(e.target.value)} required /></label>
        </fieldset>

        <fieldset className="mt-8 space-y-4">
          <legend className="formlabel !text-navy mb-2">Part B · Request</legend>
          <label className="block"><span className="formlabel">Subject</span><input className="typein" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="24/7 robotics testbed access for rover project" /></label>
          <label className="block"><span className="formlabel">Statement of purpose</span>
            <textarea rows={4} className="typein leading-[1.75] resize-y bg-[linear-gradient(transparent_calc(1.75em-1px),rgba(27,42,107,.3)_1px)] bg-[length:100%_1.75em] border-b-0" value={why} onChange={(e) => setWhy(e.target.value)} placeholder="Why you need it, for how long, and who supervises" />
          </label>
          <div>
            <span className="formlabel">Handling</span>
            <div className="flex gap-6 mt-1">
              {(['normal', 'urgent'] as const).map((p) => (
                <label key={p} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="priority" checked={priority === p} onChange={() => setPriority(p)} className="accent-navy w-4 h-4" />
                  <span className="typed capitalize">{p}</span>{p === 'urgent' && <span className="text-[12.5px] text-faint">(medical or exam proof expected)</span>}
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="formlabel !text-navy mb-2">Part C · Enclosures</legend>
          <p className="text-[13px] text-faint mb-2">Required for this form: {def.requiredAttachments.join('; ')}. Files stay in your browser.</p>
          <ol className="typed text-[14px] space-y-1 list-[lower-roman] pl-6">
            {files.map((f, i) => (
              <li key={i}><span className="inline-flex items-center gap-2">{f.name} <span className="text-faint">· {f.size}</span>
                <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-faint hover:text-stampred"><X size={14} /></button></span></li>
            ))}
          </ol>
          <label className="navbtn !py-1.5 mt-3 cursor-pointer"><Paperclip size={15} /> Attach a file
            <input type="file" className="sr-only" multiple onChange={(e) => setFiles([...files, ...Array.from(e.target.files ?? []).map((f) => ({ name: f.name, size: kb(f.size) }))])} />
          </label>
        </fieldset>

        <label className="flex items-start gap-3 mt-8 border-t-2 border-navy pt-4 cursor-pointer">
          <input type="checkbox" checked={certify} onChange={(e) => setCertify(e.target.checked)} className="accent-navy w-4 h-4 mt-1" />
          <span className="text-[14px]">I certify that the statements above and the enclosed documents are genuine, and that every desk that handles this form may see them.</span>
        </label>

        <div className="flex flex-wrap items-center justify-end gap-3 mt-6">
          {missing.length > 0 && <span className="text-[13px] text-faint mr-auto">Still needs {missing.join(', ')}.</span>}
          <button type="button" className="navbtn" onClick={() => setActiveTab('tracker')}>Discard</button>
          <button type="submit" className="navbtn navbtn-solid" disabled={missing.length > 0}>File this form</button>
        </div>
      </form>
    </div>
  );
};
