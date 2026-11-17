import { z } from 'zod';

export const rosterVerifySchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  fullName: z.string().min(2, 'Full name is required'),
  admissionYear: z.string().length(4, 'Year must be 4 digits'),
});

export type RosterVerifyInput = z.infer<typeof rosterVerifySchema>;
