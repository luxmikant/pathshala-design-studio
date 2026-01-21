import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  organizationName: z.string().min(2, "Organization name is required"),
  organizationType: z.enum(["NGO", "CSO", "GOVERNMENT", "FUNDER", "OTHER"]),
  state: z.string().optional(),
  district: z.string().optional(),
});

export async function POST(request: NextRequest) {
  console.log("[Register API] Starting registration...");
  
  try {
    const body = await request.json();
    console.log("[Register API] Received body:", { ...body, password: "***" });
    
    const validatedData = registerSchema.parse(body);
    console.log("[Register API] Validation passed");

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      console.log("[Register API] User already exists");
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    console.log("[Register API] Password hashed");

    // Create organization and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: validatedData.organizationName,
          type: validatedData.organizationType,
          state: validatedData.state || null,
          district: validatedData.district || null,
        },
      });
      console.log("[Register API] Organization created:", organization.id);

      // Create user
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          role: "ADMIN",
          organizationId: organization.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          organization: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      });
      console.log("[Register API] User created:", user.id);

      return user;
    });

    console.log("[Register API] Registration successful");
    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        user: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Register API] Error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    // Prisma errors
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
