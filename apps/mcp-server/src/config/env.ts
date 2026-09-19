import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(3000),

  HOST: z
    .string()
    .trim()
    .min(1)
    .default("127.0.0.1"),

  TAPQR_API_BASE_URL: z
    .string()
    .trim()
    .url()
    .transform((value) => value.replace(/\/+$/, "")),

  TAPQR_API_TOKEN: z
    .string()
    .trim()
    .optional(),

  TAPQR_API_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(1000)
    .max(60000)
    .default(10000)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid AgentOS environment configuration:"
  );

  console.error(
    JSON.stringify(
      parsed.error.flatten().fieldErrors,
      null,
      2
    )
  );

  throw new Error(
    "Invalid AgentOS environment configuration."
  );
}

export const env = parsed.data;