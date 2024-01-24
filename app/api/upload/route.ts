import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/services/ai";
import { toFile } from "openai";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const file = data.file;
    // const reqFileName = data.fileName;

    if (!file) {
      return NextResponse.json(
        { error: "No files received." },
        { status: 400 }
      );
    }
    const base64Code = file.split("data:image/png;base64,")[1];
    const buffer = Buffer.from(base64Code, "base64");

    const uploadedFile = await toFile(buffer);

    const response = await openai.images.edit({
      image: uploadedFile,
      prompt: "add a forest in background",
      n: 1,
      size: "1024x1024",
    });

    return NextResponse.json({
      Message: "success",
      status: 201,
      url: response.data[0].url,
    });
  } catch (error) {
    console.log("error SERVER", error);
    return NextResponse.json({ Message: "failed", status: 500, error: error });
  }
};
