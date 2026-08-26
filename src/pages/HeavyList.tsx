import { memo } from "react";

// 순수 수학 연산 루프로 CPU 부하 유발 (린트 에러 없음)
function SlowItem({ text }: { text: string }) {
  // 루프 횟수로 딜레이 조절 (너무 버벅이면 숫자를 줄이세요)
  let count = 0;
  for (let i = 0; i < 2_000_000; i++) {
    count += i;
  }

  console.log(count);

  return <li>{text}</li>;
}

export const HeavyList = memo(function HeavyList({ query }: { query: string }) {
  // 100~150개 아이템 렌더링
  const items = Array.from({ length: 150 }, (_, index) => {
    return `아이템 #${index + 1} ${query ? `(검색: ${query})` : ""}`;
  });

  return (
    <ul
      style={{
        maxHeight: "300px",
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: "10px",
      }}
    >
      {items.map((item, index) => (
        <SlowItem key={index} text={item} />
      ))}
    </ul>
  );
});
