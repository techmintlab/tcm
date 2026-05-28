import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

// In-memory fallback when DB is not available
let cachedSettings: any = null;

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    // Try to get settings from DB if a Settings model exists
    try {
      const mongoose = require("mongoose");
      // Check if a settings collection already exists by looking for any doc
      const db = mongoose.connection.db;
      const collections = await db.listCollections({ name: "settings" }).toArray();
      if (collections.length > 0) {
        const settings = await db.collection("settings").findOne({ _id: "global" });
        if (settings) {
          cachedSettings = settings;
          return NextResponse.json({ settings });
        }
      }
    } catch {
      // Fallback to cached settings
    }

    return NextResponse.json({
      settings: cachedSettings || {
        siteName: "TechMintLab",
        tagline: "Build Faster. Scale Smarter.",
      },
    });
  } catch (error: any) {
    console.error("Admin settings fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch settings" },
      { status: error.message?.includes("Admin") ? 403 : 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    await connectDB();

    try {
      const mongoose = require("mongoose");
      const db = mongoose.connection.db;
      const collections = await db.listCollections({ name: "settings" }).toArray();
      if (collections.length > 0) {
        await db.collection("settings").updateOne(
          { _id: "global" },
          { $set: body },
          { upsert: true }
        );
      } else {
        // Create collection and insert
        await db.createCollection("settings");
        await db.collection("settings").insertOne({ _id: "global", ...body });
      }
    } catch {
      // Cache in memory as fallback
      cachedSettings = body;
    }

    cachedSettings = body;
    return NextResponse.json({ success: true, settings: body });
  } catch (error: any) {
    console.error("Admin settings save error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save settings" },
      { status: error.message?.includes("Admin") ? 403 : 500 }
    );
  }
}
