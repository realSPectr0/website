import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    SITE_URL: z.string().url().optional(),
    // Secret keys — NEVER exposed to the client
    RESEND_API_KEY: z.string().min(1).optional(),
    CONTACT_EMAIL: z.string().email().optional(),
    FROM_EMAIL: z.string().min(1).optional(),
  },

  client: {
    NEXT_PUBLIC_TO_EMAIL: z.string().email().optional(),
  },

  runtimeEnv: {
    SITE_URL: process.env.SITE_URL,

    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
    FROM_EMAIL: process.env.FROM_EMAIL,

    NEXT_PUBLIC_TO_EMAIL: process.env.NEXT_PUBLIC_TO_EMAIL,
  },

  /**
   * - *extra safety* so no server var accidentally leaks to the client:
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION && process.env.SKIP_ENV_VALIDATION !== 'false',
});
