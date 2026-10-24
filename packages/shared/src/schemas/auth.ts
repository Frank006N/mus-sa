import { z } from 'zod';

// MUT Registration Number Format: AB123/1234/5678
export const regNumberSchema = z.string()
  .min(12, "Invalid registration number")
  .regex(/^[A-Z]{2}\d{3}\/\d{4}\/\d{4}$/, "Format must be AB123/1234/5678");

export const rosterVerifySchema = z.object({
  regNumber: regNumberSchema,
  surname: z.string().min(2),
  yearOfStudy: z.number().min(1).max(6),
});

export type RosterVerifyInput = z.infer<typeof rosterVerifySchema>;
