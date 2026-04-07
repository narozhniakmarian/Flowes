import { verifyAdminSession } from "@/lib/session";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import GalleryImage from "@/models/GalleryImage";
import GalleryGrid from "./GalleryGrid";

async function getGalleryImages() {
  await dbConnect();
  const images = await GalleryImage.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(images));
}

export default async function AdminGalleryPage() {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) redirect("/admin/login");

  const images = await getGalleryImages();

  return <GalleryGrid initialImages={images} />;
}
