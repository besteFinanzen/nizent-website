"use client";

export default function Eyebrow({ index, label }: { index: string; label: string }) {
  return (
    <span className="eyebrow">
      <span className="eb-dot" />
      <span className="eb-rule" />
      <span className="eb-text">
        <span className="eb-index">{index} · </span>
        {label}
      </span>
    </span>
  );
}
