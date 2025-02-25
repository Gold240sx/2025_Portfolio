import { NextResponse } from "next/server";
import { utapi } from "../config";
import { safeLog } from "@/utils/safeLog";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    safeLog({ display: false, log: { "Rename request body": body } });

    if (!body.fileKey || !body.newName) {
      safeLog({
        display: false,
        log: { Error: "Missing fileKey or newName in request body" },
      });
      return NextResponse.json(
        { error: "Missing fileKey or newName" },
        { status: 400 },
      );
    }

    // Rename the file using the file key
    safeLog({
      display: false,
      log: {
        "Renaming file": {
          fileKey: body.fileKey,
          newName: body.newName,
        },
      },
    });

    const result = await utapi.renameFiles({
      fileKey: body.fileKey,
      newName: body.newName,
    });

    safeLog({ display: false, log: { "Rename operation result": result } });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    safeLog({
      display: false,
      log: { "Error in rename route": error },
    });
    return NextResponse.json(
      { error: "Failed to rename file" },
      { status: 500 },
    );
  }
}
