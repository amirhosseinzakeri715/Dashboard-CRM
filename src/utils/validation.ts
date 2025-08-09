import { z } from "zod"

export type schemaType= z.infer<typeof schema>

export const schema = z.object({
    title: z
        .string()
        .nonempty("Title should not be empty")
        .max(200, "Title must be less than 200 character"),
    description: z
        .string()
})