import { openai } from "@/services/ai";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${data.prompt}, in anime version`,
      n: 1,
      size: "1024x1024",
    });

    return NextResponse.json({
      Message: "success",
      status: 200,
      url: response.data[0].url,
    });
  } catch (error) {}
};
