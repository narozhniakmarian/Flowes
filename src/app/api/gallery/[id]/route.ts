import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import GalleryImage from "@/models/GalleryImage";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const image = await GalleryImage.findByIdAndDelete(id);

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
