export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ status: "ok", message: "Use backend API at NEXT_PUBLIC_API_URL" });
}
