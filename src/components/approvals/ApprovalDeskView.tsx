import React, { useState } from 'react';
import { usePaperlessStore } from '../../store/usePaperlessStore';
import { ApplicationRecord } from '../../types';
import { canRoleActOnStage, STAGE_CONFIG } from '../../engine/workflow';
import { 
  CheckSquare, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Paperclip, 
  ShieldCheck, 
  Stamp,
  FileCheck2,
  FileText
} from 'lucide-react';

export const ApprovalDeskView: React.FC = () => {
  const { 
    applications, 
    currentUserRole, 
    currentUserName, 
    approveApplication, 
    rejectApplication, 
    requestRevision 
  } = usePaperlessStore();

  const [activeApp, setActiveApp] = useState<ApplicationRecord | null>(null);
  const [remarks, setRemarks] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Find applications actionable by current user role
  const actionableApps = applications.filter((a) => canRoleActOnStage(a.currentStage, currentUserRole));
  const otherApps = applications.filter((a) => !canRoleActOnStage(a.currentStage, currentUserRole));

  const selectedTarget = activeApp || actionableApps[0] || applications[0];

  const handleApprove = () => {
    if (!selectedTarget) return;
    approveApplication(selectedTarget.id, remarks || 'Approved under university administrative protocol.');
    setRemarks('');
    setActionSuccessMsg(`Sanction approved for ${selectedTarget.id}!`);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const handleReject = () => {
    if (!selectedTarget) return;
    rejectApplication(selectedTarget.id, remarks || 'Application does not meet institutional compliance standards.');
    setRemarks('');
    setActionSuccessMsg(`Application ${selectedTarget.id} marked as rejected.`);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const handleRevision = () => {
    if (!selectedTarget) return;
    requestRevision(selectedTarget.id, remarks || 'Please update the requested supporting documents.');
    setRemarks('');
    setActionSuccessMsg(`Revision requested for ${selectedTarget.id}.`);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold uppercase">
              Sanction Authority Workbench
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Active Persona: {currentUserName}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-2">Administrative Approval Desk</h2>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Review pending institutional petitions, inspect cryptographic document seals, and append digitally-signed sanction verdicts to the immutable state machine.
          </p>
        </div>

        {actionSuccessMsg && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs flex items-center space-x-2 animate-bounce">
            <CheckCircle className="w-4 h-4" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Queue */}
        <div className="space-y-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-bold text-white uppercase font-mono">
                Requires Your Sanction ({actionableApps.length})
              </span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">
                {currentUserRole.replace(/_/g, ' ')}
              </span>
            </div>

            {actionableApps.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
                <p>No petitions pending your signature.</p>
                <p className="text-[10px] text-slate-600 mt-1">Switch roles in the navbar to test other desks.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {actionableApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setActiveApp(app)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedTarget?.id === app.id
                        ? 'bg-sky-500/20 border-sky-500/80 text-white shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-sky-400">{app.id}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        PENDING
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white mt-1 line-clamp-1">{app.title}</p>
                    <p className="text-[11px] text-slate-400">{app.studentName} ({app.department})</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Other Petitions Queue */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase font-mono">
                Other Applications ({otherApps.length})
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
              {otherApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setActiveApp(app)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedTarget?.id === app.id
                      ? 'bg-slate-800 border-slate-600 text-white'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-300">{app.id}</span>
                    <span className="text-[10px] font-mono text-slate-500 capitalize">
                      {STAGE_CONFIG[app.currentStage].label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 truncate mt-0.5">{app.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Petition Inspector & Sanction Workbench */}
        {selectedTarget ? (
          <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded-lg">
                    {selectedTarget.id}
                  </span>
                  <span className="text-xs font-mono uppercase text-slate-400">
                    {selectedTarget.workflowType.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1.5">{selectedTarget.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Applicant: <span className="text-white font-medium">{selectedTarget.studentName}</span> ({selectedTarget.studentId}) • {selectedTarget.department}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  {STAGE_CONFIG[selectedTarget.currentStage].label}
                </span>
              </div>
            </div>

            {/* Application Data */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">SUBMISSION DATE</span>
                <span className="text-white font-semibold mt-0.5 block">{selectedTarget.createdAt}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">SLA DWELL TIME</span>
                <span className="text-amber-400 font-semibold mt-0.5 block">{selectedTarget.dwellHours} Hours in Stage</span>
              </div>
            </div>

            {/* Justification Box */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-500 uppercase block mb-1">
                Declared Academic Statement / Form Parameters
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {String(selectedTarget.formData.justification || 'Standard academic verification requested.')}
              </p>
            </div>

            {/* Attachments Section */}
            <div>
              <span className="text-xs font-bold text-slate-300 uppercase font-mono block mb-2">
                Attached Digital Evidences ({selectedTarget.attachments.length})
              </span>
              <div className="space-y-1.5">
                {selectedTarget.attachments.map((att) => (
                  <div key={att.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center space-x-2 text-slate-300">
                      <FileText className="w-4 h-4 text-sky-400" />
                      <span>{att.name}</span>
                      <span className="text-slate-500">({att.size})</span>
                    </div>
                    <span className="text-emerald-400 text-[10px] font-mono flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Cryptographically Sealed</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sanction Decision Panel */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-white uppercase font-mono">
                Official Sanction Remarks & Audit Endorsement
              </label>
              <textarea
                rows={2}
                placeholder="Enter regulatory rationale or mandatory conditions for sanction..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              />

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  onClick={handleRevision}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-900/40 text-xs font-medium flex items-center space-x-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Request Revision</span>
                </button>

                <button
                  onClick={handleReject}
                  className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-medium flex items-center space-x-1.5"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Reject Petition</span>
                </button>

                <button
                  onClick={handleApprove}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md shadow-emerald-600/30 flex items-center space-x-1.5"
                >
                  <Stamp className="w-4 h-4" />
                  <span>Digitally Sign & Approve</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
