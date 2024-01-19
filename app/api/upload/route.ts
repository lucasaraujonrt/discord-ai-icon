import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const data = await req.json();
    const file = data.file;
    const reqFileName = data.fileName;

    console.log("file", file);

    if (!file) {
      return NextResponse.json(
        { error: "No files received." },
        { status: 400 }
      );
    }
    const base64Code = file.split("data:image/png;base64,")[1];
    const buffer = Buffer.from(base64Code, "base64");
    buffer.name = "image.png";

    const filename = reqFileName + buffer.name;
    const filePath = path.join(process.cwd(), "public/uploads/" + filename);
    await writeFile(filePath, buffer);
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
