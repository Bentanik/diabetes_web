import { validationMessages } from "@/lib/messages/validationMessages";
import { z } from "zod";

export const createKnowledgeBaseSchema = z.object({
  name: z
    .string()
    .nonempty({ message: validationMessages.knowledge_name.required }),

  description: z
    .string()
    .nonempty({ message: validationMessages.knowledge_description.required }),
});

export type CreateKnowledgeBaseFormData = z.infer<
  typeof createKnowledgeBaseSchema
>;
