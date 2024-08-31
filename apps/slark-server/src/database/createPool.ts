import { Pool } from 'pg';

const baseConfig = {
  user: 'postgres',
  host: 'localhost',
  password: 'root',
  port: 5432,
} as const;

const createPool = ({ database }: { database: string }) => {
  const pool = new Pool({
    ...baseConfig,
    database,

    idleTimeoutMillis: 3000,
    max: 10,
  });
  return pool;
};

export default createPool;
