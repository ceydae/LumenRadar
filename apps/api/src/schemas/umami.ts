import { z } from 'zod';

export const umamiWebsiteSchema = z.object({ id: z.uuid() });

export const umamiStatsSchema = z.object({ pageviews: z.int().nonnegative() });

export const umamiDomainSchema = z.hostname().regex(
  /^(?:localhost|.+\.[a-z0-9-]{2,63})$/,
);

const timestamp = z.string().regex(/^\d+$/).pipe(
  z.coerce.number<string>().int().min(0).max(8_640_000_000_000_000),
);

export const analyticsRangeSchema = z.object({
  startAt: timestamp.optional(),
  endAt: timestamp.optional(),
}).refine(
  ({ startAt, endAt }: { startAt?: number; endAt?: number }): boolean =>
    (startAt === undefined && endAt === undefined) ||
    (startAt !== undefined && endAt !== undefined && endAt > startAt),
  'Omit both timestamps or provide both with endAt greater than startAt.',
);
