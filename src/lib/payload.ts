import payload from "payload";
import config from "../payload.config";

let cached = (global as any).payload;

export async function getPayloadClient() {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is missing");
  }

  if (!cached) {
    cached = await payload.init({
      config: {
        ...config,
        secret: process.env.PAYLOAD_SECRET,
      },
    });

    (global as any).payload = cached;
  }

  return cached;
}
