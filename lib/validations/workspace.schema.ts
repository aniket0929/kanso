import { z } from "zod";

export const workspaceSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
    address: z.string().optional(),
    timezone: z.string().default("UTC"),
    contactEmail: z.string().email("Invalid email address"),
});

export type WorkspaceFormValues = z.infer<typeof workspaceSchema>;
