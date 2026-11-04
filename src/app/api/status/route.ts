import { lagStatus } from "@/lib/pipeline/status";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(lagStatus(process.env));
}
