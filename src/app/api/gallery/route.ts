import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import GalleryImage from "@/models/GalleryImage";

export async function GET() {
  try {
    await dbConnect();
    const images = await GalleryImage.find({}).sort({ order: 1 });
    return NextResponse.json(images);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Auto-generate id from publicId if missing
    if (!body.id && body.publicId) {
      body.id = body.publicId;
    }

    const image = await GalleryImage.create(body);
    return NextResponse.json(image, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
