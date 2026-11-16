import express from 'express';
import type { Pool } from 'pg';
import { once } from 'node:events';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { startServer } from '../../src/startup.js';

describe('server lifecycle', () => {
  const signalListeners = new Map<NodeJS.Signals, NodeJS.SignalsListener>();
  afterEach(() => {
    for (const [signal, listener] of signalListeners) process.off(signal, listener);
    signalListeners.clear();
    process.exitCode = 0;
  });

  function database() {
    return { query: vi.fn().mockResolvedValue({ rows: [] }), end: vi.fn().mockResolvedValue(undefined) };
  }

  it('checks PostgreSQL, starts listening, and closes on SIGTERM', async () => {
    const db = database();
    const previous = new Set(process.listeners('SIGTERM'));
    const server = await startServer(express(), db as unknown as Pool, 0);
    expect(server.listening).toBe(true);
    expect(db.query).toHaveBeenCalledWith('SELECT 1');
    const shutdown = process.listeners('SIGTERM').find((listener) => !previous.has(listener))!;
    signalListeners.set('SIGINT', shutdown);
    signalListeners.set('SIGTERM', shutdown);
    shutdown('SIGTERM');
    shutdown('SIGTERM');
    await once(server, 'close');
    await vi.waitFor(() => { expect(db.end).toHaveBeenCalledOnce(); });
  });

  it('closes the pool if the database check fails', async () => {
    const db = database();
    db.query.mockRejectedValue(new Error('database unavailable'));
    await expect(startServer(express(), db as unknown as Pool, 0)).rejects.toThrow('database unavailable');
    expect(db.end).toHaveBeenCalledOnce();
  });

  it('closes the pool if the port is already in use', async () => {
    const occupied = express().listen(0);
    await once(occupied, 'listening');
    const address = occupied.address();
    if (!address || typeof address === 'string') throw new Error('Missing test port.');
    const db = database();
    try {
      await expect(startServer(express(), db as unknown as Pool, address.port)).rejects.toThrow('EADDRINUSE');
      expect(db.end).toHaveBeenCalledOnce();
    } finally {
      occupied.close();
      await once(occupied, 'close');
    }
  });

  it('reports a database shutdown failure', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const db = database();
    db.end.mockRejectedValue(new Error('close failed'));
    const previous = new Set(process.listeners('SIGTERM'));
    const server = await startServer(express(), db as unknown as Pool, 0);
    const shutdown = process.listeners('SIGTERM').find((listener) => !previous.has(listener))!;
    signalListeners.set('SIGINT', shutdown);
    signalListeners.set('SIGTERM', shutdown);
    shutdown('SIGTERM');
    await once(server, 'close');
    await vi.waitFor(() => { expect(log).toHaveBeenCalledWith('Database shutdown failed.', 'close failed'); });
    expect(process.exitCode).toBe(1);
  });
});
