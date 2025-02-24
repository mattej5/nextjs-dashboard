import { prisma } from "@/app/lib/primsa";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Define a Zod schema for validation
const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    university: z.string().min(1, "University ID is required"),
    email: z.string().email("Invalid email"),
    gradDate: z.string().min(1, "Graduation date is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  export async function POST(req: Request) {
    try {
      const body = await req.json();
      console.log("Received form data:", body);
  
      // Validate request body
      const validatedData = formSchema.parse(body);
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
  
      // Insert into database
      const newUser = await prisma.student.create({
        data: {
          Fname: validatedData.firstName,
          Lname: validatedData.lastName,
          university_id: Number(validatedData.university),
          email: validatedData.email,
          grad_date: new Date(validatedData.gradDate),
          password: hashedPassword, // Store hashed password
        },
      });
  
      console.log("User successfully created:", newUser);
  
      return NextResponse.json({ message: "Account created successfully!" }, { status: 201 });
    } catch (error) {
      console.error("Error saving user:", error);
  
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
      }
  
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }