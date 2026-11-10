import { 
  WorkflowStage, 
  UserRole, 
  ApplicationRecord, 
  AuditLogEntry, 
  StageBottleneck,
  WorkflowType
} from '../types';

export const STAGE_CONFIG: Record<
  WorkflowStage, 
  { label: string; responsibleRole: UserRole | null; nextSuccessStage: WorkflowStage | null }
> = {
  draft: { label: 'Drafting', responsibleRole: 'student', nextSuccessStage: 'submitted' },
  submitted: { label: 'Submission Queued', responsibleRole: 'student', nextSuccessStage: 'advisor_review' },
  advisor_review: { label: 'Advisor Review', responsibleRole: 'academic_advisor', nextSuccessStage: 'hod_approval' },
  hod_approval: { label: 'HOD Approval', responsibleRole: 'head_of_department', nextSuccessStage: 'dean_review' },
  dean_review: { label: 'Dean Academic Sanction', responsibleRole: 'dean_academics', nextSuccessStage: 'registrar_seal' },
  registrar_seal: { label: 'Registrar Seal & Issuance', responsibleRole: 'registrar', nextSuccessStage: 'completed' },
  completed: { label: 'Official Sanction Issued', responsibleRole: null, nextSuccessStage: null },
  rejected: { label: 'Application Rejected', responsibleRole: null, nextSuccessStage: null },
  revision_needed: { label: 'Amendment Requested', responsibleRole: 'student', nextSuccessStage: 'submitted' },
};

/**
 * Checks if a given actor role has authority to take action on a stage.
 */
export function canRoleActOnStage(stage: WorkflowStage, role: UserRole): boolean {
  if (role === 'registrar') return true; // Super-admin bypass for registrar
  const config = STAGE_CONFIG[stage];
  return config.responsibleRole === role;
}

/**
 * Validates state transition
 */
export function executeTransition(
  application: ApplicationRecord,
  nextStage: WorkflowStage,
  actorName: string,
  actorRole: UserRole,
  action: 'submitted' | 'approved' | 'rejected' | 'requested_revision',
  remarks: string
): ApplicationRecord {
  const auditEntry: AuditLogEntry = {
    id: `audit-${Date.now()}`,
    stage: application.currentStage,
    actorName,
    actorRole,
    action,
    remarks: remarks || `Status moved to ${STAGE_CONFIG[nextStage].label}`,
    timestamp: new Date().toISOString(),
  };

  return {
    ...application,
    currentStage: nextStage,
    updatedAt: new Date().toISOString(),
    dwellHours: 1, // reset dwell hours
    history: [auditEntry, ...application.history],
  };
}

/**
 * Computes administrative bottleneck statistics across all applications
 */
export function computeBottlenecks(applications: ApplicationRecord[]): StageBottleneck[] {
  const trackedStages: WorkflowStage[] = [
    'advisor_review',
    'hod_approval',
    'dean_review',
    'registrar_seal',
  ];

  return trackedStages.map((stage) => {
    const stageApps = applications.filter((a) => a.currentStage === stage);
    const count = stageApps.length;

    // Average dwell time
    const totalDwell = stageApps.reduce((acc, a) => acc + (a.dwellHours || 4), 0);
    const avgDwell = count > 0 ? Math.round(totalDwell / count) : 0;

    // Rejections originating from this stage
    const rejectionsAtStage = applications.filter((a) => 
      a.history.some((h) => h.stage === stage && h.action === 'rejected')
    ).length;

    const totalProcessedAtStage = count + rejectionsAtStage;
    const rejectionRate = totalProcessedAtStage > 0 
      ? Math.round((rejectionsAtStage / totalProcessedAtStage) * 100) 
      : 0;

    return {
      stage,
      label: STAGE_CONFIG[stage].label,
      activeCount: count,
      averageDwellHours: avgDwell || 14,
      rejectionRate,
    };
  });
}
