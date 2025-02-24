import { NextResponse } from "next/server";
import { prisma } from "app/lib/primsa";

export async function GET() {
  try {
    console.log("✅ Fetching universities from database...");

    // Ensure Prisma fetches an array
    const universities = await prisma.university.findMany();
    
    console.log("Database query result:", universities);

    // Make sure we are always returning an array
    if (!universities || universities.length === 0) {
      console.warn("⚠️ No universities found in the database.");
      return NextResponse.json({ universities: [] }, { status: 200 });
    }

    return NextResponse.json(universities);
  } catch (error) {
    console.error("Database fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch universities" }, { status: 500 });
  }
}