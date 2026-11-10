import React, { useState } from 'react';
import { usePaperlessStore } from '../../store/usePaperlessStore';
import { WorkflowType } from '../../types';
import { WORKFLOW_DEFINITIONS } from '../../data/seedWorkflows';
import { 
  FileText, 
  UploadCloud, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  Send,
  Calendar,
  User,
  Building
} from 'lucide-react';

export const NewApplicationView: React.FC = () => {
  const { submitApplication, setActiveTab } = usePaperlessStore();

  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType>('lab_access_permit');
  const [title, setTitle] = useState('');
  const [studentName, setStudentName] = useState('Siddharth Rao');
  const [studentId, setStudentId] = useState('2023-CS-088');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('Semester 6');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [justification, setJustification] = useState('');
  const [hasAgreement, setHasAgreement] = useState(false);

  // Simulated uploaded attachments
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([
    { name: 'Research_Proposal_Abstract.pdf', size: '1.4 MB' },
    { name: 'Lab_Safety_Compliance_Signed.pdf', size: '680 KB' },
  ]);

  const currentDef = WORKFLOW_DEFINITIONS[selectedWorkflow];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !hasAgreement) return;

    submitApplication({
      workflowType: selectedWorkflow,
      title: title.trim(),
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      department: department.trim(),
      semester: semester.trim(),
      priority,
      formData: {
        justification: justification.trim(),
        submittedOnline: true,
      },
      attachments: uploadedFiles.map((f, i) => ({
        id: `att-new-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        mimeType: 'application/pdf',
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        verified: true,
      })),
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase font-semibold">
            Administrative E-Petition
          </span>
          <span className="text-xs text-slate-500 font-mono">SLA Guarantee: {currentDef.slaDays} Business Days</span>
        </div>
        <h2 className="text-xl font-bold text-white mt-2">Submit Official Administrative Petition</h2>
        <p className="text-sm text-slate-400 mt-1">
          Complete mandatory academic justifications and attach verifiable documentation. Applications enter the institutional approval state machine immediately.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 text-xs">
        {/* Procedure Selector */}
        <div>
          <label className="block text-slate-300 font-semibold mb-2">1. Select Procedure Category</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.values(WORKFLOW_DEFINITIONS).map((def) => (
              <div
                key={def.type}
                onClick={() => setSelectedWorkflow(def.type)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedWorkflow === def.type
                    ? 'bg-sky-500/20 border-sky-500/80 text-white shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-xs block text-white">{def.title}</span>
                <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{def.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Student Information Fields */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <label className="block text-slate-300 font-semibold">2. Applicant Credentials</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-400 block mb-1">Student Name</span>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Enrollment Roll No</span>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Department</span>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Semester</span>
              <input
                type="text"
                required
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Petition Specifics */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <label className="block text-slate-300 font-semibold">3. Petition Details</label>
          <div>
            <span className="text-slate-400 block mb-1">Petition Subject / Title</span>
            <input
              type="text"
              required
              placeholder="e.g. 24/7 Robotics Testbed Access for Autonomous Rover Project"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 block mb-1">Processing Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'normal' | 'urgent')}
                className="w-full px-2 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none"
              >
                <option value="normal">Normal SLA Processing</option>
                <option value="urgent">Urgent SLA (Requires Medical / Exam Proof)</option>
              </select>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Required Mandate Document</span>
              <div className="px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 truncate">
                {currentDef.requiredAttachments[0] || 'Standard Documentation'}
              </div>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Statement of Academic Purpose</span>
            <textarea
              rows={3}
              required
              placeholder="Explain the academic necessity, timelines, and faculty advisor endorsement..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Attachment Uploader */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <label className="block text-slate-300 font-semibold">4. Verified Attachments</label>
          <div className="space-y-1.5">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2 text-slate-300">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>{file.name}</span>
                  <span className="text-slate-500">({file.size})</span>
                </div>
                <span className="text-emerald-400 text-[10px] flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="pt-3 border-t border-slate-800">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={hasAgreement}
              onChange={(e) => setHasAgreement(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500"
            />
            <span className="text-slate-400 text-xs">
              I certify under university code of conduct that all declarations and document scans provided are authentic. I agree to state machine audit tracking.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('tracker')}
            className="px-4 py-2 text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!hasAgreement || !title}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-medium shadow-md shadow-sky-600/30 flex items-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Transmit Petition</span>
          </button>
        </div>
      </form>
    </div>
  );
};
