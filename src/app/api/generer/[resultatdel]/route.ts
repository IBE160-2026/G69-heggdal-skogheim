import { generer } from "@/lib/pipeline/generer";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resultatdel: string }> },
) {
  const { resultatdel } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    // Body som ikke er JSON, gir `ugyldig_inndata` i pipelinen.
    body = undefined;
  }

  const { status, json } = await generer(resultatdel, body, process.env);

  return Response.json(json, { status });
}
