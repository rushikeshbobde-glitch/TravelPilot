import { describe, it, expect } from 'vitest';
import { AssistantToolsService } from '../../src/services/assistantTools';
import { INITIAL_GOA_TRIP } from '../../src/lib/mockData';

describe('AssistantToolsService Unit Tests', () => {
  it('should execute GET_TRIP tool successfully', () => {
    const res = AssistantToolsService.executeTool('GET_TRIP', {}, INITIAL_GOA_TRIP);
    expect(res.success).toBe(true);
    expect(res.data.destination).toBe('Goa, India');
  });

  it('should execute GET_BUDGET tool successfully', () => {
    const res = AssistantToolsService.executeTool('GET_BUDGET', {}, INITIAL_GOA_TRIP);
    expect(res.success).toBe(true);
    expect(res.data.total_budget).toBe(25000);
  });

  it('should execute CHECK_CONFLICTS tool successfully', () => {
    const res = AssistantToolsService.executeTool('CHECK_CONFLICTS', {}, INITIAL_GOA_TRIP);
    expect(res.success).toBe(true);
    expect(res.message).toBeDefined();
  });

  it('should execute REMOVE_ACTIVITY tool successfully', () => {
    const res = AssistantToolsService.executeTool(
      'REMOVE_ACTIVITY',
      { category: 'Shopping' },
      INITIAL_GOA_TRIP
    );
    expect(res.success).toBe(true);
  });
});
