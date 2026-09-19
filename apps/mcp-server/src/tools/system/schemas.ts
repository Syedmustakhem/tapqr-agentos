import { z } from "zod";

export const emptyToolInputSchema = z.object({});

export type EmptyToolInput = z.infer<
  typeof emptyToolInputSchema
>;