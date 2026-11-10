import { describe, it, expect } from 'vitest';
import { canRoleActOnStage, executeTransition, computeBottlenecks } from './workflow';
import { ApplicationRecord } from '../types';

describe('Paperless State Machine & Workflow Engine', () => {
  const dummyApp: ApplicationRecord = {
    id: 'APP-TEST-001',
    workflowType: 'leave_application',
    title: 'Medical Leave Test',
    studentName: 'Alice Test',
    studentId: '2023-CS-001',
    department: 'CSE',
    semester: 'Sem 6',
    currentStage: 'advisor_review',
    priority: 'normal',
    formData: { justification: 'Medical' },
    attachments: [],
    history: [],
    createdAt: '2026-02-01 10:00',
    updatedAt: '2026-02-01 10:00',
    dwellHours: 12,
  };

  it('validates role authority guards correctly for a given stage', () => {
    expect(canRoleActOnStage('advisor_review', 'academic_advisor')).toBe(true);
    expect(canRoleActOnStage('advisor_review', 'student')).toBe(false);
    expect(canRoleActOnStage('hod_approval', 'head_of_department')).toBe(true);
    expect(canRoleActOnStage('hod_approval', 'academic_advisor')).toBe(false);
  });

  it('allows registrar super-authority override on all stages', () => {
    expect(canRoleActOnStage('advisor_review', 'registrar')).toBe(true);
    expect(canRoleActOnStage('dean_review', 'registrar')).toBe(true);
  });

  it('executes state transition and records immutable audit log', () => {
    const updated = executeTransition(
      dummyApp,
      'hod_approval',
      'Dr. Turing',
      'academic_advisor',
      'approved',
      'Endorsed with medical note verified.'
    );

    expect(updated.currentStage).toBe('hod_approval');
    expect(updated.dwellHours).toBe(1);
    expect(updated.history.length).toBe(1);
    expect(updated.history[0].actorRole).toBe('academic_advisor');
    expect(updated.history[0].action).toBe('approved');
    expect(updated.history[0].remarks).toBe('Endorsed with medical note verified.');
  });

  it('computes administrative stage dwell bottlenecks and rejection rates', () => {
    const apps: ApplicationRecord[] = [
      dummyApp,
      { ...dummyApp, id: 'APP-TEST-002', currentStage: 'hod_approval', dwellHours: 24 },
      {
        ...dummyApp,
        id: 'APP-TEST-003',
        currentStage: 'rejected',
        history: [{
          id: 'log-rej',
          stage: 'advisor_review',
          actorName: 'Dr. Turing',
          actorRole: 'academic_advisor',
          action: 'rejected',
          remarks: 'Missing documents',
          timestamp: '2026-02-01',
        }],
      },
    ];

    const bottlenecks = computeBottlenecks(apps);
    expect(bottlenecks.length).toBe(4); // advisor, hod, dean, registrar

    const advisorStage = bottlenecks.find((b) => b.stage === 'advisor_review');
    expect(advisorStage).toBeDefined();
    expect(advisorStage?.activeCount).toBe(1);
    expect(advisorStage?.rejectionRate).toBeGreaterThan(0);
  });
});
