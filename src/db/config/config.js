module.exports = {
  dialect: process.env.DB_DIALECT || "postgres",
  host: process.env.DB_HOST || "postgres",
  port: "5432",
  username: "user",
  password: "pass",
  database: "db",
};
