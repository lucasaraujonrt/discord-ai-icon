import { NextRequest, NextResponse } from "next/server";
import { createReadStream } from "fs";
import { openai } from "@/services/ai";
import path from "path";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const data = await req.json();
  try {
    const filePath = path.resolve(
      ".",
      `public/uploads/${data.fileName}image.png`
    );

    const response = await openai.images.edit({
      model: "dall-e-2",
      image: createReadStream(filePath),
      prompt: "in anime version",
      n: 1,
      size: "1024x1024",
    });

    console.log("response", response.data);

    return NextResponse.json({ data: response.data[0].url, status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
