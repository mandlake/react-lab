import { useOptimistic, useState, useTransition } from "react";

// 가상 서버 API (1.5초 딜레이)
async function updateLikeOnServer(shouldFail: boolean): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (shouldFail) throw new Error("서버 통신 실패 (네트워크 에러)");

  return 1; // 1증가 성공
}

export default function OptimisticTest() {
  // 실제 서버 데이터 상태
  const [serverLikes, setServerLikes] = useState(10);
  const [shouldFail, setShouldFail] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // useOptimistic 선언 (비동기 처리 동안 임시 상태를 계산하여 노출)
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    serverLikes,
    (current: number, updateValue: number) => current + updateValue,
  );

  const handleLike = () => {
    setErrorMessage(null);

    // useOptimistic은 Transition 또는 Form Action 내부에서 실행되어야 합니다.
    startTransition(async () => {
      // 1. 낙관적 UI 즉시 반영 (+1)
      setOptimisticLikes(1);

      try {
        // 2. 가상 서버 통신
        await updateLikeOnServer(shouldFail);

        // 3. 통신 성공 시 실제 서버 상태 확정
        setServerLikes((prev) => prev + 1);
      } catch (err) {
        // 통신 실패 시 : 수동으로 숫자를 되돌리는 코드 (-1)가 전혀 없어도
        // 비동기 작업이 끝나는 순간 React가 자동으로 serverLikes 기준(원래 숫자)으로 롤백합니다.
        setErrorMessage(err instanceof Error ? err.message : "오류 발생");
      }
    });
  };

  return (
    <div
      style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "420px" }}
    >
      <h2>useOptimistic 테스트</h2>

      {/* 실패 시뮬레이션 토글 */}
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
        <span>🚨 서버 API 요청 실패 시뮬레이션</span>
      </label>

      {/* 좋아요 카드 */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "16px",
          background: "#fafafa",
        }}
      >
        <div
          style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}
        >
          ❤️ 좋아요 수: {optimisticLikes}
        </div>
        <p style={{ margin: "4px 0", fontSize: "13px", color: "#666" }}>
          (실제 확정된 서버 상태: {serverLikes})
        </p>

        <button
          onClick={handleLike}
          style={{
            marginTop: "12px",
            padding: "8px 16px",
            fontSize: "14px",
            cursor: "pointer",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
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
            padding: "8px",
            background: "#ffeef0",
            color: "#d93025",
            borderRadius: "4px",
            fontSize: "13px",
          }}
        >
          {errorMessage} (이전 상태로 자동 롤백됨)
        </div>
      )}
    </div>
  );
}
