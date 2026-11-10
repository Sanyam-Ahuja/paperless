import React from 'react';
import { usePaperlessStore } from '../../store/usePaperlessStore';
import { computeBottlenecks } from '../../engine/workflow';

export const BottleneckAnalyticsView: React.FC = () => {
  const { applications } = usePaperlessStore();
  const rows = computeBottlenecks(applications);
  const done = applications.filter((a) => a.currentStage === 'completed').length;
  const rej = applications.filter((a) => a.currentStage === 'rejected').length;
  const open = applications.length - done - rej;
  const worst = [...rows].sort((a, b) => b.averageDwellHours - a.averageDwellHours)[0];
  const max = Math.max(48, ...rows.map((r) => r.averageDwellHours));
  const SLA = 24;

  return (
    <div className="max-w-[1000px]">
      <h1 className="wide font-black text-[32px] md:text-[40px] leading-none">Where files wait</h1>
      <p className="text-[19px] mt-4 max-w-[60ch] leading-snug">
        Of <b>{applications.length}</b> files in the register, <b>{done}</b> are sanctioned, <b>{rej}</b> rejected and <b>{open}</b> still moving.
        The slowest desk right now is <b className="bg-canary px-1">{worst?.label}</b>, where a file waits <b>{worst?.averageDwellHours} hours</b> on average.
      </p>

      <section className="sheet bg-whitecopy mt-8 p-5 md:p-8">
        <div className="flex justify-between items-baseline border-b-2 border-navy pb-2 mb-5">
          <h2 className="cond font-extrabold uppercase text-[20px]">Average hours on each desk</h2>
          <span className="text-[13px] text-faint">dashed line · {SLA} h service standard</span>
        </div>
        <div className="space-y-5">
          {rows.map((r) => {
            const over = r.averageDwellHours > SLA;
            return (
              <div key={r.stage} className="grid md:grid-cols-[200px_1fr_140px] gap-x-5 gap-y-1 items-center">
                <div>
                  <div className="font-bold leading-tight">{r.label}</div>
                  <div className="text-[13px] text-faint">{r.activeCount} waiting now</div>
                </div>
                <div className="relative h-8 bg-blotter/40 border border-navy/30">
                  <div className={`h-full ${over ? 'bg-stampred/85' : 'bg-navy'}`} style={{ width: `${(r.averageDwellHours / max) * 100}%` }} />
                  <span className="absolute top-[-4px] bottom-[-4px] border-l-2 border-dashed border-violet" style={{ left: `${(SLA / max) * 100}%` }} aria-hidden />
                  <span className="absolute inset-y-0 left-2 flex items-center typed text-[13px] font-bold text-white mix-blend-difference">{r.averageDwellHours} h</span>
                </div>
                <div className="text-[13px] md:text-right"><span className="typed">{r.rejectionRate}%</span> <span className="text-faint">rejected here</span></div>
              </div>
            );
          })}
        </div>
      </section>
      <p className="text-[13px] text-faint mt-4">Hours on desk are simulated per file for this demonstration.</p>
    </div>
  );
};
