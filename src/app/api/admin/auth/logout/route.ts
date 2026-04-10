import { NextResponse } from "next/server";
import { deleteAdminSession } from "@/lib/session";

export async function POST() {
  await deleteAdminSession();
  return NextResponse.json({ success: true });
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
