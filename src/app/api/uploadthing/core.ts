import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { utapi } from "./config";
import { safeLog } from "@/utils/safeLog";

const f = createUploadthing();

// Simple auth function (you can enhance this)
const auth = (req: Request) => ({ id: "fakeId" });

export const ourFileRouter = {
  imageUploader: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    // .middleware(async ({ req }) => {
    // 	const user = await auth(req)
    // 	if (!user) throw new UploadThingError("Unauthorized")
    // 	return { userId: user.id }
    // })
    .onUploadComplete(async ({ metadata, file }) => {
      // console.log("Upload complete for userId:", metadata.userId)
      safeLog({ display: false, log: { "file url": file.url } });

      return {
        url: file.url,
        // uploadedBy: metadata.userId,
      };
    }),

  renameUpload: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      // Get the file key and new name from the request
      const body = await req.json();
      safeLog({ display: false, log: { "Rename request body": body } });

      const { fileKey, newName } = body;
      if (!fileKey || !newName) {
        safeLog({
          display: false,
          log: { "Missing required fields": { fileKey, newName } },
        });
        throw new UploadThingError("Missing file key or new name");
      }

      return { userId: user.id, fileKey, newName };
    })
    .onUploadComplete(async ({ metadata }) => {
      try {
        safeLog({
          display: false,
          log: {
            "Attempting to rename file": {
              fileKey: metadata.fileKey,
              newName: metadata.newName,
            },
          },
        });

        const result = await utapi.renameFiles({
          fileKey: metadata.fileKey,
          newName: metadata.newName,
        });
        safeLog({
          display: false,
          log: { "Rename operation result": result },
        });

        return {
          success: true,
          newName: metadata.newName,
          result,
        };
      } catch (error) {
        safeLog({
          display: false,
          log: { "Error renaming file": error },
        });
        throw new UploadThingError("Failed to rename file");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
