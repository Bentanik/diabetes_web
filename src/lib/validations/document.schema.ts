import { validationMessages } from "@/lib/messages/validationMessages";
import { z } from "zod";

export const createDocumentSchema = z.object({
  name: z
    .string()
    .nonempty({ message: validationMessages.document_name.required }),

  description: z
    .string()
    .nonempty({ message: validationMessages.document_description.required }),
});

export type CreateDocumentFormData = z.infer<typeof createDocumentSchema>;
