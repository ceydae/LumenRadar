import { describe, expect, it, vi } from 'vitest';
import { createPool } from './pool.js';

describe('database pool', () => {
  it('logs idle connection failures without crashing the process', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const pool = createPool('postgresql://localhost/example');
    pool.emit('error', new Error('connection lost'));
    expect(log).toHaveBeenCalledWith('Idle database connection failed.', 'connection lost');
    await pool.end();
  });
});
