import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import GalleryImage from "@/models/GalleryImage";
import { verifyAdminSession } from "@/lib/session";
import cloudinary, { uploadImage } from "@/lib/cloudinary";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const images = await GalleryImage.find({}).sort({ order: 1, createdAt: -1 }).lean();

    return NextResponse.json(images.map(img => ({
      ...img,
      _id: img._id.toString()
    })));
  } catch (error) {
    console.error("Failed to fetch gallery images:", error);
    return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result: any = await uploadImage(buffer, 'gallery');
    
    await dbConnect();
    const galleryImage = new GalleryImage({
      id: randomUUID(),
      url: result.secure_url,
      publicId: result.public_id,
      order: 0,
      active: true
    });

    await galleryImage.save();
    return NextResponse.json(galleryImage);
  } catch (error) {
    console.error("Failed to upload gallery image:", error);
    return NextResponse.json({ error: "Failed to upload gallery image" }, { status: 500 });
  }
}
