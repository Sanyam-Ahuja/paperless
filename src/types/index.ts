export type WorkflowType = 
  | 'leave_application' 
  | 'bonafide_certificate' 
  | 'lab_access_permit' 
  | 'grade_reevaluation' 
  | 'equipment_requisition';

export type WorkflowStage = 
  | 'draft' 
  | 'submitted' 
  | 'advisor_review' 
  | 'hod_approval' 
  | 'dean_review' 
  | 'registrar_seal' 
  | 'completed' 
  | 'rejected' 
  | 'revision_needed';

export type UserRole = 
  | 'student' 
  | 'academic_advisor' 
  | 'head_of_department' 
  | 'dean_academics' 
  | 'registrar';

export interface DocumentAttachment {
  id: string;
  name: string;
  size: string;
  mimeType: string;
  uploadedAt: string;
  verified: boolean;
}

export interface AuditLogEntry {
  id: string;
  stage: WorkflowStage;
  actorName: string;
  actorRole: UserRole;
  action: 'submitted' | 'approved' | 'rejected' | 'requested_revision';
  remarks: string;
  timestamp: string;
}

export interface ApplicationRecord {
  id: string; // e.g. "APP-2026-0814"
  workflowType: WorkflowType;
  title: string;
  studentName: string;
  studentId: string;
  department: string;
  semester: string;
  currentStage: WorkflowStage;
  priority: 'normal' | 'urgent';
  formData: Record<string, string | number | boolean>;
  attachments: DocumentAttachment[];
  history: AuditLogEntry[];
  createdAt: string;
  updatedAt: string;
  dwellHours: number; // Simulated hours spent in current stage
}

export interface WorkflowDefinition {
  type: WorkflowType;
  title: string;
  description: string;
  slaDays: number;
  stages: WorkflowStage[];
  requiredAttachments: string[];
}

export interface StageBottleneck {
  stage: WorkflowStage;
  label: string;
  activeCount: number;
  averageDwellHours: number;
  rejectionRate: number; // 0 to 100
}
