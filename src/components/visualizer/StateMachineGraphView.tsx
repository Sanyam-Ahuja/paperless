import React, { useState } from 'react';
import { usePaperlessStore } from '../../store/usePaperlessStore';
import { WorkflowStage } from '../../types';
import { STAGE_CONFIG } from '../../engine/workflow';
import { GitMerge, ArrowRight, ShieldAlert, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

interface StateNode {
  id: WorkflowStage;
  label: string;
  role: string;
  type: 'initial' | 'intermediate' | 'terminal' | 'loopback';
}

const NODES: StateNode[] = [
  { id: 'submitted', label: '1. Submission Queued', role: 'Student', type: 'initial' },
  { id: 'advisor_review', label: '2. Academic Advisor Review', role: 'Advisor', type: 'intermediate' },
  { id: 'hod_approval', label: '3. Head of Department', role: 'HOD', type: 'intermediate' },
  { id: 'dean_review', label: '4. Dean Academics Sanction', role: 'Dean', type: 'intermediate' },
  { id: 'registrar_seal', label: '5. Registrar Seal & Emboss', role: 'Registrar', type: 'intermediate' },
  { id: 'completed', label: '6. Sanction Issued', role: 'System', type: 'terminal' },
  { id: 'rejected', label: 'Terminal Rejection', role: 'All Authorities', type: 'terminal' },
  { id: 'revision_needed', label: 'Amendment Loopback', role: 'Student', type: 'loopback' },
];

export const StateMachineGraphView: React.FC = () => {
  const { applications } = usePaperlessStore();
  const [selectedNode, setSelectedNode] = useState<WorkflowStage>('advisor_review');

  const getAppsInStage = (stage: WorkflowStage) => {
    return applications.filter((a) => a.currentStage === stage);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold uppercase">
            Deterministic Finite Automaton
          </span>
          <span className="text-xs text-slate-500 font-mono">Formal Verification of Academic Transitions</span>
        </div>
        <h2 className="text-xl font-bold text-white mt-2">Institutional Workflow State Machine</h2>
        <p className="text-sm text-slate-400 max-w-2xl mt-1">
          Visual representation of all valid institutional state transitions, role-based guards, and terminal conditions. Click any state node to inspect current queues and execution policies.
        </p>
      </div>

      {/* Main Flow Canvas */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase font-mono mb-4 flex items-center space-x-2">
          <GitMerge className="w-4 h-4 text-purple-400" />
          <span>Linear Sanction Pipeline (Forward Progress)</span>
        </h3>

        {/* Pipeline Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {NODES.filter((n) => n.type !== 'terminal' && n.type !== 'loopback').concat(
            NODES.filter((n) => n.id === 'completed')
          ).map((node, idx) => {
            const count = getAppsInStage(node.id).length;
            const isSelected = selectedNode === node.id;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                  isSelected
                    ? 'bg-purple-950/30 border-purple-500 ring-2 ring-purple-500/20 shadow-lg'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      STAGE 0{idx + 1}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-sky-400 text-[10px] font-mono flex items-center justify-center font-bold">
                      {count}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-2 leading-snug">
                    {node.label}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-purple-300 block truncate">
                    Role: {node.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Branching & Exceptional States */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase font-mono mb-4">
            Exception & Loopback Handlers
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Revision Loopback */}
            <div 
              onClick={() => setSelectedNode('revision_needed')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedNode === 'revision_needed'
                  ? 'bg-amber-950/30 border-amber-500'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-sm text-white">Revision Loopback (Non-Terminal)</span>
                </div>
                <span className="text-xs font-mono text-amber-300 font-bold">
                  {getAppsInStage('revision_needed').length} Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Triggered when an authority requests additional documents. Returns control to student to amend declarations without cancelling the petition.
              </p>
            </div>

            {/* Terminal Rejection */}
            <div 
              onClick={() => setSelectedNode('rejected')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedNode === 'rejected'
                  ? 'bg-rose-950/30 border-rose-500'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span className="font-bold text-sm text-white">Terminal Rejection (Sink State)</span>
                </div>
                <span className="text-xs font-mono text-rose-300 font-bold">
                  {getAppsInStage('rejected').length} Rejected
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Permanent rejection state. Can be initiated by Advisor, HOD, Dean, or Registrar upon severe policy violation or ineligible criteria.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected State Inspector */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500">INSPECTING STATE</span>
            <h3 className="text-base font-bold text-white mt-0.5">{STAGE_CONFIG[selectedNode].label}</h3>
          </div>
          <span className="text-xs font-mono text-sky-400 px-2.5 py-1 rounded bg-sky-950/60 border border-sky-800/60">
            {getAppsInStage(selectedNode).length} petitions currently in this state
          </span>
        </div>

        <div className="mt-4 space-y-2 text-xs">
          {getAppsInStage(selectedNode).length === 0 ? (
            <p className="text-slate-500 italic">No applications currently queued at this state.</p>
          ) : (
            getAppsInStage(selectedNode).map((app) => (
              <div key={app.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-sky-400">{app.id}</span>
                  <span className="text-white ml-2">{app.title}</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{app.studentName}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
