import React from 'react';
import { usePaperlessStore } from '../../store/usePaperlessStore';
import { computeBottlenecks } from '../../engine/workflow';
import { BarChart3, Clock, AlertTriangle, CheckCircle, TrendingUp, ShieldAlert } from 'lucide-react';

export const BottleneckAnalyticsView: React.FC = () => {
  const { applications } = usePaperlessStore();

  const bottlenecks = computeBottlenecks(applications);

  const completedCount = applications.filter((a) => a.currentStage === 'completed').length;
  const rejectedCount = applications.filter((a) => a.currentStage === 'rejected').length;
  const totalCompletedOrRejected = completedCount + rejectedCount;
  const completionRate = applications.length > 0
    ? Math.round((completedCount / applications.length) * 100)
    : 0;

  // Find worst bottleneck
  const worstBottleneck = [...bottlenecks].sort((a, b) => b.averageDwellHours - a.averageDwellHours)[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold uppercase">
            Administrative Operations Telemetry
          </span>
          <span className="text-xs text-slate-500 font-mono">Service Level Agreement (SLA) Tracking</span>
        </div>
        <h2 className="text-xl font-bold text-white mt-2">Bottleneck Diagnostics & Dwell Latency</h2>
        <p className="text-sm text-slate-400 max-w-2xl mt-1">
          Monitor desk-by-desk latency, approval backlogs, and stage rejection drop-off rates across administrative departments.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>COMPLETION RATE</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {completionRate}%
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">{completedCount} of {applications.length} finalized</p>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>WORST BOTTLENECK</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-base font-bold text-white mt-1 truncate">
            {worstBottleneck?.label || 'None'}
          </div>
          <p className="text-[10px] text-amber-400 font-mono mt-0.5">{worstBottleneck?.averageDwellHours}h avg dwell</p>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>REJECTED PETITIONS</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
            {rejectedCount}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Policy non-compliance sink</p>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ACTIVE WORK IN PROGRESS</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400 mt-1">
            {applications.length - totalCompletedOrRejected}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Currently moving in pipeline</p>
        </div>
      </div>

      {/* Stage Latency Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-sky-400" />
          <span>Stage-by-Stage Latency & Backlog Analysis</span>
        </h3>

        <div className="space-y-3">
          {bottlenecks.map((item) => {
            const isWorst = item.stage === worstBottleneck?.stage;

            return (
              <div
                key={item.stage}
                className={`p-4 rounded-xl border transition-all ${
                  isWorst
                    ? 'bg-amber-950/20 border-amber-500/50'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-white">{item.label}</h4>
                      {isWorst && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                          Highest Latency
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      Queue: {item.activeCount} applications waiting
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 font-mono text-xs">
                    <div className="text-right">
                      <span className="text-slate-500 block text-[10px]">AVG DWELL</span>
                      <span className="font-bold text-sky-400">{item.averageDwellHours} Hours</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[10px]">REJECTION RATE</span>
                      <span className={`font-bold ${item.rejectionRate > 15 ? 'text-rose-400' : 'text-slate-300'}`}>
                        {item.rejectionRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, (item.averageDwellHours / 48) * 100)}%` }}
                    className={`h-full rounded-full transition-all ${
                      item.averageDwellHours > 30 ? 'bg-amber-500' : 'bg-sky-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
