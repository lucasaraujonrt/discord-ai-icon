export async function POST(req: Request) {
  console.log("req", req);

  const response = await fetch(req.fileUrl);

  return new Response(response.body, {
    headers: {
      ...response.headers, // copy the previous headers
      "content-disposition": `attachment; filename="uuid"`,
    },
  });
}
