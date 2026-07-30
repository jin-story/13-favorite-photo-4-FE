const BACKEND_SUBSCRIBE_PATH = "/users/me/notifications/subscribe";

export async function GET(request) {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return Response.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const backendResponse = await fetch(
    `${process.env.BACKEND_ORIGIN}${BACKEND_SUBSCRIBE_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!backendResponse.ok) {
    return Response.json(
      { message: "SSE 연결에 실패했습니다." },
      { status: backendResponse.status },
    );
  }

  return new Response(backendResponse.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
