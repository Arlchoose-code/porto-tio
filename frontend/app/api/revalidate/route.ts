import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const secret =
      request.headers.get("x-revalidate-secret") ||
      body.secret;

    const expectedSecret =
      process.env.REVALIDATE_SECRET || "tio_revalidation_secret_key_2026";

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { status: false, message: "Invalid revalidation secret" },
        { status: 401 }
      );
    }

    const paths: string[] = body.paths || [];
    if (!paths.length) {
      return NextResponse.json(
        { status: false, message: "Paths array is required" },
        { status: 400 }
      );
    }

    for (const path of paths) {
      revalidatePath(path);
      console.log(`[Revalidation] Purged cache for path: ${path}`);
    }

    return NextResponse.json({
      status: true,
      message: `Successfully revalidated ${paths.length} paths`,
      revalidated_paths: paths,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: error.message || "Revalidation failed" },
      { status: 500 }
    );
  }
}
