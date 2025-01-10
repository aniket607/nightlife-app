"use server"
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  imageUrl: z.string().url("Invalid image URL")
});

export async function putvenuedata(formData:FormData) {
    const data=Object.fromEntries(formData);
    console.log(data)
    try {
        const validatedData = formSchema.safeParse(data);
        console.log(validatedData);
        // return { success: true };
    } catch (error) {
        // if (error instanceof z.ZodError) {
        //     // Return validation errors
        //     return { success: false, errors: error.errors };
        //   }
        //   // Handle other errors
        //   return { success: false, error: "An unexpected error occurred" };
        }
    }
    