import type { VercelRequest, VercelResponse } from "@vercel/node";

let serverLikes = 10;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. GET: 현재 수치 조회
  if (req.method === "GET") {
    return res.status(200).json({ likes: serverLikes });
  }

  // 2. DELETE: 10으로 초기화
  if (req.method === "DELETE") {
    serverLikes = 10;
    return res.status(200).json({ likes: serverLikes });
  }

  // 3. POST: 좋아요 증가 또는 리셋
  if (req.method === "POST") {
    const { shouldFail, action } = req.body || {};

    // 리셋 요청 처리
    if (action === "reset") {
      serverLikes = 10;
      return res.status(200).json({ likes: serverLikes });
    }

    // 400ms 지연
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (shouldFail) {
      return res.status(500).json({ message: "서버 에러 (500 Error)" });
    }

    serverLikes += 1;
    return res.status(200).json({ likes: serverLikes });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
