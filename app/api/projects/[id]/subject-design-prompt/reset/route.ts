import { NextResponse } from "next/server";

import { resetSubjectDesignPrompt } from "@/lib/storage/projects";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const updated = await resetSubjectDesignPrompt(id);

    if (!updated) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to reset subject design prompt." },
      { status: 400 },
    );
  }
}
