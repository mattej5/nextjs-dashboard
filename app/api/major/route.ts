import { NextResponse } from "next/server";
import { prisma } from "app/lib/primsa";

export async function GET() {
  try {

    // Ensure Prisma fetches an array
    const majors = await prisma.major.findMany();
    
    console.log("Database query result:", majors);

    // Make sure we are always returning an array
    if (!majors || majors.length === 0) {
      console.warn("⚠️ No universities found in the database.");
      return NextResponse.json({ universities: [] }, { status: 200 });
    }

    return NextResponse.json(majors);
  } catch (error) {
    console.error("Database fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch universities" }, { status: 500 });
  }
}