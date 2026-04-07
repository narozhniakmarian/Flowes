import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import GalleryImage from "@/models/GalleryImage";
import { verifyAdminSession } from "@/lib/session";
import { deleteImage } from "@/lib/cloudinary";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const image = await GalleryImage.findOneAndDelete({ id: params.id });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    try {
      await deleteImage(image.publicId);
    } catch (cloudinaryError) {
      console.error("Failed to delete image from Cloudinary:", cloudinaryError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete gallery image:", error);
    return NextResponse.json({ error: "Failed to delete gallery image" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    const image = await GalleryImage.findOneAndUpdate(
      { id: params.id },
      { order: body.order, active: body.active },
      { new: true }
    );

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error("Failed to update gallery image:", error);
    return NextResponse.json({ error: "Failed to update gallery image" }, { status: 500 });
  }
}
