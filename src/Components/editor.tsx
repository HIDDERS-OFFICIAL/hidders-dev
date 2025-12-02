import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";

const LINE_HEIGHT = 24;

export default function CustomEditor() {
  const [lines, setLines] = useState([]);
  const [totalLines, setTotalLines] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Cursor Position (Line, Column)
  const [cursor, setCursor] = useState({ line: 0, col: 0 });
  const containerRef = useRef(null);

  // 1. Fetch Visible Lines from Rust
  const refreshViewport = async () => {
    // Calculate how many lines fit on screen
    const visibleLines = Math.ceil(window.innerHeight / LINE_HEIGHT);
    const startLine = Math.floor(scrollOffset / LINE_HEIGHT);

    try {
      const data = await invoke("get_viewport", {
        startLine: startLine,
        height: visibleLines + 5, // Buffer
      }) as any;
      setLines(data.lines);
      setTotalLines(data.total_lines);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshViewport();
  }, [scrollOffset]);

  // 2. Handle Typing
  const handleKeyDown = async (e:any) => {
    // Prevent default browser behavior for special keys
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      await invoke("insert_char", {
        char: e.key,
        lineIdx: cursor.line,
        colIdx: cursor.col,
      });
      setCursor({ ...cursor, col: cursor.col + 1 });
      refreshViewport();
    }

    // Simple Navigation logic
    if (e.key === "ArrowDown") setCursor({ ...cursor, line: cursor.line + 1 });
    if (e.key === "ArrowUp")
      setCursor({ ...cursor, line: Math.max(0, cursor.line - 1) });
    if (e.key === "ArrowRight") setCursor({ ...cursor, col: cursor.col + 1 });
    if (e.key === "ArrowLeft")
      setCursor({ ...cursor, col: Math.max(0, cursor.col - 1) });
  };

  return (
    <div
      className="relative w-full h-full bg-[#1e1e1e] overflow-auto"
      ref={containerRef}
      //   @ts-ignore
      onScroll={(e) => setScrollOffset(e.target.scrollTop)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ fontFamily: '"Fira Code", monospace', outline: "none" }}
    >
      {/* Scroll Phantom (Forces the scrollbar to be the correct size) */}
      <div
        style={{ height: totalLines * LINE_HEIGHT }}
        className="absolute w-1"
      />

      {/* Rendered Lines */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          transform: `translateY(${
            Math.floor(scrollOffset / LINE_HEIGHT) * LINE_HEIGHT
          }px)`,
        }}
      >
        {lines.map((line, idx) => {
          const actualLineNum = Math.floor(scrollOffset / LINE_HEIGHT) + idx;
          const isCurrentLine = actualLineNum === cursor.line;

          return (
            <div
              key={idx}
              className={`flex h-[24px] items-center ${
                isCurrentLine ? "bg-[#2c2c2c]" : ""
              }`}
            >
              {/* Line Number */}
              <div className="w-12 text-gray-600 text-right pr-4 text-xs select-none">
                {actualLineNum + 1}
              </div>

              {/* Code Content */}
              <div className="text-gray-300 whitespace-pre relative">
                {/* Syntax Highlighting would happen here by splitting the string */}
                {line}

                {/* The Cursor */}
                {isCurrentLine && (
                  <div
                    className="absolute bg-[#00FF99] w-[2px] h-[18px] animate-pulse"
                    style={{ left: `${cursor.col * 8.4}px`, top: "3px" }} // 8.4px is approx char width
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
