import { getGalleryImageData } from "@/lib/actions/gallery";

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params;
  const row = await getGalleryImageData(id);
  if (!row) {
    return new Response("Not found", { status: 404 });
  }

  const buffer = Buffer.from(row.dataBase64, "base64");
  return new Response(buffer, {
    headers: {
      "Content-Type": row.mimeType || "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(buffer.byteLength),
    },
  });
}
