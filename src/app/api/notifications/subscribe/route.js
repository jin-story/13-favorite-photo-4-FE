import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SUBSCRIBE_PATH = "/users/me/notifications/subscribe";

export async function GET(request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return Response.json(
      {
        message: "인증이 필요합니다.",
      },
      {
        status: 401,
      },
    );
  }

  const backendOrigin = process.env.BACKEND_ORIGIN;

  if (!backendOrigin) {
    return Response.json(
      {
        message: "백엔드 주소가 설정되지 않았습니다.",
      },
      {
        status: 500,
      },
    );
  }

  try {
    const response = await fetch(`${backendOrigin}${SUBSCRIBE_PATH}`, {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      signal: request.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      return Response.json(
        {
          message:
            errorData.message ||
            `SSE 연결에 실패했습니다. (status: ${response.status})`,
        },
        {
          status: response.status,
        },
      );
    }

    if (!response.body) {
      return Response.json(
        {
          message: "SSE 응답 스트림이 없습니다.",
        },
        {
          status: 502,
        },
      );
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    if (request.signal.aborted) {
      return new Response(null, {
        status: 499,
      });
    }

    console.error("SSE 프록시 연결 오류:", error);

    return Response.json(
      {
        message: "SSE 서버에 연결하지 못했습니다.",
      },
      {
        status: 502,
      },
    );
  }
}
