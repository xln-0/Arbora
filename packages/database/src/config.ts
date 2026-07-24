export function getDatabaseUrl() {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB,
  } = process.env;

  if (
    !POSTGRES_USER ||
    !POSTGRES_PASSWORD ||
    !POSTGRES_HOST ||
    !POSTGRES_PORT ||
    !POSTGRES_DB
  ) {
    throw new Error("Missing PostgreSQL environment variables");
  }

  return `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;
}
