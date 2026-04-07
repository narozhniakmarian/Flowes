import { verifyAdminSession } from "@/lib/session";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import AuthLog from "@/models/AuthLog";
import SettingsClient from "./SettingsClient";

async function getAuthLogs() {
  await dbConnect();
  const logs = await AuthLog.find({}).sort({ createdAt: -1 }).limit(20);
  return JSON.parse(JSON.stringify(logs));
}

export default async function AdminSettingsPage() {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) redirect("/admin/login");

  const logs = await getAuthLogs();

  return <SettingsClient initialLogs={logs} />;
}
