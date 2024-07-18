export default () => ({
  app: {
    host: process.env.APP_HOST || 'localhost',
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    secret: process.env.SESSION_SECRET || 'secret',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'testdb',
    synchronize: process.env.DB_SYNCHRONIZE || true,
  },
});
