"use client";

import { useEffect, useRef, useState } from "react";

const aiPlayers = [
  { name: "AI 1", role: "The Analyst", suspicion: "Waiting for drawings" },
  { name: "AI 2", role: "The Skeptic", suspicion: "Waiting for drawings" },
  { name: "AI 3", role: "The Wildcard", suspicion: "Waiting for drawings" },
];

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const [phase, setPhase] = useState<"draw" | "discuss">("draw");
  const [chat, setChat] = useState<string[]>([
    "The AIs will discuss the drawings after the timer ends.",
  ]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#111827";
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    const p = point(event);
    if (!ctx || !p) return;
    drawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    const p = point(event);
    if (!ctx || !p) return;
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    drawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.fillStyle = "#111827";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#111827";
  };

  const submitChat = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setChat((current) => [...current, `You: ${trimmed}`]);
    setMessage("");
  };

  return (
    <main className="game-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AI SOCIAL DEDUCTION</p>
          <h1>Quick Don&apos;t Draw</h1>
        </div>
        <div className="round-pill">ROUND 1 · {phase === "draw" ? "DRAW" : "DISCUSS"}</div>
      </header>

      <section className="game-grid">
        <div className="main-column">
          <div className="prompt-card">
            <span>Your secret prompt</span>
            <strong>???</strong>
            <small>The prompt will be revealed when the round begins.</small>
          </div>

          <div className="canvas-card">
            <div className="canvas-header">
              <span>YOUR DRAWING</span>
              <span className="timer">00:30</span>
            </div>
            <canvas
              ref={canvasRef}
              className="drawing-canvas"
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
              onPointerLeave={stopDrawing}
            />
            <div className="canvas-actions">
              <button className="secondary" onClick={clearCanvas}>Clear</button>
              <button className="primary" onClick={() => setPhase("discuss")}>Submit drawing</button>
            </div>
          </div>

          <div className="ai-grid">
            {aiPlayers.map((ai) => (
              <article className="ai-card" key={ai.name}>
                <div className="ai-avatar">{ai.name.replace("AI ", "")}</div>
                <div>
                  <strong>{ai.name}</strong>
                  <span>{ai.role}</span>
                </div>
                <p>{phase === "draw" ? ai.suspicion : "Analyzing the evidence…"}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="chat-card">
          <div className="chat-header">
            <div>
              <span className="eyebrow">DISCUSSION</span>
              <h2>AI Chat</h2>
            </div>
            <span className="online-dot">● LIVE</span>
          </div>

          <div className="chat-log">
            {chat.map((line, index) => (
              <div className={line.startsWith("You:") ? "chat-message you" : "chat-message system"} key={`${line}-${index}`}>
                {line}
              </div>
            ))}
            {phase === "discuss" && (
              <>
                <div className="chat-message ai"><b>AI 1:</b> I&apos;m reviewing the drawings now. Something feels off.</div>
                <div className="chat-message ai"><b>AI 2:</b> We should compare the unusual details before accusing anyone.</div>
                <div className="chat-message ai"><b>AI 3:</b> I already have a suspect. I&apos;m not saying who yet.</div>
              </>
            )}
          </div>

          <div className="chat-input">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submitChat();
                }
              }}
              placeholder="Say something to the AIs…"
              rows={2}
            />
            <button className="primary" onClick={submitChat}>Send</button>
          </div>
        </aside>
      </section>
    </main>
  );
}
