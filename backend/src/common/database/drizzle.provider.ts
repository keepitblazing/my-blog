import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@/db/schema';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const postgres = require('postgres');

export const DRIZZLE = Symbol('DRIZZLE');

export const drizzleProvider = {
  provide: DRIZZLE,
  useFactory: () => {
    const connectionString = process.env.DATABASE_URL!;
    const client = postgres(connectionString);
    return drizzle(client, { schema });
  },
};

export type DrizzleDB = PostgresJsDatabase<typeof schema>;
