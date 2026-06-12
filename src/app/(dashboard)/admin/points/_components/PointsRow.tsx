"use client";
import { useRef, useState, useTransition } from "react";
import { adjustPoints, setPoints } from "../_actions";

interface Props {
  userId: string;
  currentPoints: number;
}

export default function PointsRow({ userId, currentPoints }: Props) {
  const [points, setLocalPoints] = useState(currentPoints);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(String(currentPoints));
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAdjust(delta: number) {
    startTransition(async () => {
      const fd = new FormData();
      fd.append("userId", userId);
      fd.append("delta", String(delta));
      await adjustPoints(fd);
      setLocalPoints((p) => p + delta);
    });
  }

  function handleSet() {
    const val = parseInt(inputVal, 10);
    if (isNaN(val) || val < 0) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.append("userId", userId);
      fd.append("value", String(val));
      await setPoints(fd);
      setLocalPoints(val);
      setEditing(false);
    });
  }

  return (
    <div className="flex items-center gap-2">
      {editing ? (
        <>
          <input
            ref={inputRef}
            type="number"
            min="0"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSet()}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <button
            onClick={handleSet}
            disabled={pending}
            className="px-2 py-1 bg-green-600 text-white rounded text-xs font-medium disabled:opacity-50"
          >
            حفظ
          </button>
          <button
            onClick={() => { setEditing(false); setInputVal(String(points)); }}
            className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs"
          >
            إلغاء
          </button>
        </>
      ) : (
        <>
          <span className="font-bold text-gray-800 w-10 text-center tabular-nums">
            {pending ? "..." : points}
          </span>
          <button
            onClick={() => handleAdjust(-10)}
            disabled={pending}
            className="w-7 h-7 rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-40 text-sm font-bold flex items-center justify-center border border-red-200"
          >
            −
          </button>
          <button
            onClick={() => handleAdjust(10)}
            disabled={pending}
            className="w-7 h-7 rounded-md bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-40 text-sm font-bold flex items-center justify-center border border-green-200"
          >
            +
          </button>
          <button
            onClick={() => { setEditing(true); setInputVal(String(points)); setTimeout(() => inputRef.current?.focus(), 0); }}
            className="px-2 py-1 text-gray-400 hover:text-gray-600 text-xs underline"
          >
            تعديل
          </button>
        </>
      )}
    </div>
  );
}
