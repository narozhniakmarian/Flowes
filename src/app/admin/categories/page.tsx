import { verifyAdminSession } from "@/lib/session";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import CategoriesTable from "./CategoriesTable";

async function getCategories() {
  await dbConnect();
  const categories = await Category.find({}).sort({ order: 1 });
  return JSON.parse(JSON.stringify(categories));
}

export default async function AdminCategoriesPage() {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) redirect("/admin/login");

  const categories = await getCategories();

  return <CategoriesTable initialCategories={categories} />;
}
