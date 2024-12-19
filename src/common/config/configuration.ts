export default () => ({
  app: {
    host: process.env.APP_HOST || 'localhost',
    port: parseInt(process.env.APP_PORT, 10) || 4000,
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
  oauth: {
    google: {
      apiKey: process.env.GOOGLE_API_KEY,
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      scope: process.env.GOOGLE_SCOPE?.split(' '),
    },
  },
  session: {
    secret: process.env.SESSION_SECRET,
  },
  frontend: {
    url: process.env.FRONTEND_URL,
  },
});
