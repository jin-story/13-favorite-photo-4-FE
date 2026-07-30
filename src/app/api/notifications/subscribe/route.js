const BACKEND_SUBSCRIBE_PATH = "/users/me/notifications/subscribe";

export async function GET(request) {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return Response.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  try {
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

    return backendResponse;
  } catch (error) {
    console.error("SSE 백엔드 연결 실패:", error);

    return Response.json(
      { message: "백엔드 서버에 연결할 수 없습니다." },
      { status: 502 },
    );
  }
}
