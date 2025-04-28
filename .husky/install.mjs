if (
  process.env.CI === "true" ||
  process.env.CI === "1" ||
  process.env.NODE_ENV === "production"
) {
  process.exit(0);
}

husky;
