import { useEffect, useOptimistic, useState, useTransition } from "react";

// 서버 상태 조회 (GET)
async function fetchServerLikes(): Promise<number> {
  const res = await fetch("/api/like");
  const data = await res.json();
  return data.likes;
}

// 좋아요 증가 요청 (POST)
async function updateLikeOnServer(shouldFail: boolean): Promise<number> {
  const response = await fetch("/api/like", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shouldFail }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "서버 통신 실패");
  }

  const data = await response.json();
  return data.likes;
}

// 서버 및 클라이언트 상태 초기화 (DELETE)
async function resetServerLikes(): Promise<number> {
  const res = await fetch("/api/like", { method: "DELETE" });
  const data = await res.json();
  return data.likes;
}

export default function OptimisticTest() {
  const [serverLikes, setServerLikes] = useState(10);
  const [shouldFail, setShouldFail] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // 컴포넌트 마운트 시 서버의 실제 현재 수치와 동기화
  useEffect(() => {
    fetchServerLikes().then((likes) => setServerLikes(likes));
  }, []);

  // 낙관적 UI 훅 (다음 수치 치환)
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    serverLikes,
    (_current: number, nextValue: number) => nextValue,
  );

  const handleLike = () => {
    setErrorMessage(null);

    // 현재 눈에 보이는 수치 + 1
    const nextLikes = optimisticLikes + 1;

    startTransition(async () => {
      // 1. UI 즉시 반영 (+1)
      setOptimisticLikes(nextLikes);

      try {
        // 2. 실제 서버 통신
        const updated = await updateLikeOnServer(shouldFail);
        setServerLikes(updated);
      } catch (err) {
        // 3. 실패 시 React가 자동으로 원래 serverLikes로 롤백
        setErrorMessage(err instanceof Error ? err.message : "오류 발생");
      }
    });
  };

  // 발표 데모 시연용 10 리셋 함수
  const handleReset = async () => {
    setErrorMessage(null);
    const resetValue = await resetServerLikes();
    setServerLikes(resetValue);
  };

  return (
    <div
      style={{ padding: "24px", fontFamily: "sans-serif", maxWidth: "420px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "20px" }}>
          useOptimistic 실전 테스트
        </h2>
        <button
          onClick={handleReset}
          style={{
            padding: "4px 10px",
            fontSize: "12px",
            background: "#f1f5f9",
            border: "1px solid #cbd5e1",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🔄 10으로 초기화
        </button>
      </div>

      {/* 500 에러 시뮬레이션 토글 */}
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={shouldFail}
          onChange={(e) => setShouldFail(e.target.checked)}
        />
        <span>🚨 서버 API 500 에러 시뮬레이션</span>
      </label>

      {/* 좋아요 카드 */}
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          padding: "18px",
          background: "#fafafa",
        }}
      >
        <div
          style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "6px" }}
        >
          ❤️ 좋아요 수: {optimisticLikes}
        </div>
        <p style={{ margin: "0 0 14px", fontSize: "13px", color: "#64748b" }}>
          (실제 서버 확정 데이터: {serverLikes})
        </p>

        <button
          onClick={handleLike}
          style={{
            padding: "9px 18px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
          }}
        >
          👍 좋아요 누르기
        </button>
      </div>

      {/* 에러 피드백 */}
      {errorMessage && (
        <div
          style={{
            marginTop: "12px",
            padding: "10px",
            background: "#fee2e2",
            color: "#dc2626",
            borderRadius: "6px",
            fontSize: "13px",
          }}
        >
          {errorMessage} (이전 상태로 자동 롤백됨)
        </div>
      )}
    </div>
  );
}
