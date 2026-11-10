import React, { useState } from 'react';
import { usePaperlessStore } from '../../store/usePaperlessStore';
import { ApplicationRecord, WorkflowStage } from '../../types';
import { STAGE_CONFIG } from '../../engine/workflow';
import { WORKFLOW_DEFINITIONS } from '../../data/seedWorkflows';
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Paperclip, 
  History, 
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Award
} from 'lucide-react';

const STAGES_ORDER: WorkflowStage[] = [
  'submitted',
  'advisor_review',
  'hod_approval',
  'dean_review',
  'registrar_seal',
  'completed',
];

export const ApplicationTrackerView: React.FC = () => {
  const { applications, filterType, setFilterType, filterStage, setFilterStage, setActiveTab, setSelectedAppId } = usePaperlessStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectedApp, setInspectedApp] = useState<ApplicationRecord | null>(null);

  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || app.workflowType === filterType;
    const matchesStage = 
      filterStage === 'all' ||
      (filterStage === 'active' && app.currentStage !== 'completed' && app.currentStage !== 'rejected') ||
      (filterStage === 'completed' && app.currentStage === 'completed') ||
      (filterStage === 'rejected' && app.currentStage === 'rejected');

    return matchesSearch && matchesType && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold uppercase">
              Administrative Ledger
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {applications.length} Electronic Petitions Recorded
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-2">University Petitions & Sanctions Tracker</h2>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Real-time audit ledger for student requests. Every stage transition is digitally signed with non-repudiable remarks.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('new_app')}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-lg shadow-sky-600/20 flex items-center space-x-1.5 self-start md:self-auto transition-all"
        >
          <span>Submit New Petition</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by ID, student, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none font-medium"
          >
            <option value="all">All Procedures</option>
            {Object.values(WORKFLOW_DEFINITIONS).map((def) => (
              <option key={def.type} value={def.type}>{def.title}</option>
            ))}
          </select>

          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {['all', 'active', 'completed', 'rejected'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStage(s)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                  filterStage === s
                    ? 'bg-sky-500/20 text-sky-300 font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.map((app) => {
          const currentConfig = STAGE_CONFIG[app.currentStage];
          const isCompleted = app.currentStage === 'completed';
          const isRejected = app.currentStage === 'rejected';

          return (
            <div
              key={app.id}
              className="bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all space-y-4"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded-lg">
                    {app.id}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-semibold">
                    {app.workflowType.replace(/_/g, ' ')}
                  </span>
                  {app.priority === 'urgent' && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase font-bold animate-pulse">
                      Urgent SLA
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Submitted {app.createdAt.split('T')[0] || app.createdAt.split(' ')[0]}</span>
                </div>
              </div>

              {/* Title & Student Meta */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {app.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-sans">
                    <span className="text-slate-200 font-medium">{app.studentName}</span> ({app.studentId}) • {app.department} • {app.semester}
                  </p>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 ${
                    isCompleted
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                      : isRejected
                      ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                      : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : isRejected ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>{currentConfig.label}</span>
                  </span>
                </div>
              </div>

              {/* Multi-tier Stage Stepper */}
              <div className="pt-2">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs font-mono">
                  {STAGES_ORDER.slice(1).map((stage) => {
                    const stageConfig = STAGE_CONFIG[stage];
                    const isPassed = app.history.some((h) => h.stage === stage && h.action === 'approved') || isCompleted;
                    const isCurrent = app.currentStage === stage;

                    return (
                      <div
                        key={stage}
                        className={`p-2 rounded-xl border flex flex-col justify-between ${
                          isPassed
                            ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                            : isCurrent
                            ? 'bg-amber-950/30 border-amber-500/60 text-amber-200 ring-1 ring-amber-500/30'
                            : 'bg-slate-900/40 border-slate-800/60 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-tight">
                            {stageConfig.label}
                          </span>
                          {isPassed && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                          {isCurrent && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
                        </div>
                        <span className="text-[9px] text-slate-500 mt-1 capitalize">
                          {stageConfig.responsibleRole?.replace(/_/g, ' ') || 'Authority'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Row: Attachments & Audit Inspector Trigger */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <div className="flex items-center space-x-2 text-slate-400">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>{app.attachments.length} Document Attachments</span>
                  {app.attachments.every((a) => a.verified) && (
                    <span className="text-emerald-400 text-[10px] font-mono flex items-center space-x-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setInspectedApp(app)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1 font-medium transition-colors"
                  >
                    <History className="w-3.5 h-3.5 text-sky-400" />
                    <span>Audit Trail ({app.history.length})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Audit Trail Modal */}
      {inspectedApp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-sky-400">{inspectedApp.id}</span>
                <h3 className="text-base font-bold text-white mt-1">{inspectedApp.title}</h3>
                <p className="text-xs text-slate-400">{inspectedApp.studentName} ({inspectedApp.department})</p>
              </div>
              <button
                onClick={() => setInspectedApp(null)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Audit History Timeline */}
            <div className="my-5 space-y-3 max-h-80 overflow-y-auto pr-1">
              <span className="text-xs font-bold text-slate-300 uppercase font-mono block">
                Immutable Event History
              </span>

              {inspectedApp.history.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{log.actorName}</span>
                    <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-sky-300 capitalize">
                      {log.actorRole.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-[10px] font-mono uppercase font-bold ${
                      log.action === 'approved' ? 'text-emerald-400' : log.action === 'rejected' ? 'text-rose-400' : 'text-slate-400'
                    }`}>
                      {log.action}
                    </span>
                  </div>
                  <p className="text-slate-300 font-sans text-[11px] pt-1 italic">
                    "{log.remarks}"
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setInspectedApp(null)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium"
              >
                Close Audit Trail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
