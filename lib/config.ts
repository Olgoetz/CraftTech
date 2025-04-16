const config = {
  env: {
    databaseUrl: process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
  },
  fileStorage: {
    bucketName: "crafttech-members-044552942866",
    region: "eu-central-1",
  },
};

export default config;
