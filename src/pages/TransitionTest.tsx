"use client";

import React, { useState, useTransition } from "react";
import { HeavyList } from "./HeavyList";

export default function TransitionTestPage() {
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    startTransition(() => {
      setQuery(e.target.value);
    });
  };

  return (
    <div
      style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "400px" }}
    >
      <h2>useTransition 테스트</h2>

      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="빠르게 글자를 입력해보세요"
        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
      />

      <div
        style={{
          marginTop: "10px",
          fontSize: "14px",
          color: isPending ? "orange" : "green",
        }}
      >
        {isPending ? "⏳ 목록 렌더링 중..." : "✅ 완료"}
      </div>

      {/* isPending 상태일 때 흐리게(투명도 0.6) 처리 */}
      <div
        style={{
          marginTop: "15px",
          opacity: isPending ? 0.6 : 1,
          transition: "opacity 0.2s",
        }}
      >
        <HeavyList query={query} />
      </div>
    </div>
  );
}
