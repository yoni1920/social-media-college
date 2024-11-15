const config = {
  dbHost: process.env.DB_HOST ?? "127.0.0.1",
  dbPort: process.env.DB_PORT ?? "27017",
  dbName: process.env.DB_NAME ?? "local_test",
  dbUsername: process.env.DB_USERNAME ?? "",
  dbPassword: process.env.DB_PASSWORD ?? "",
};

export default {
  connectionUrl: `mongodb://${config.dbUsername}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}?authSource=admin`,
};
