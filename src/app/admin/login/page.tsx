"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type LoginStatus =
  | "idle"
  | "sending"
  | "waiting"
  | "approved"
  | "denied"
  | "expired"
  | "error";

const POLL_INTERVAL_MS = 2_000;

export default function AdminLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const requestIdRef = useRef<string | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Cleanup polling on unmount ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  // ─── Request access ───────────────────────────────────────────────────────
  async function requestAccess() {
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/auth/request", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Request failed.");
        return;
      }

      requestIdRef.current = data.requestId;
      setStatus("waiting");
      startPolling(data.requestId);
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  // ─── Poll for approval ────────────────────────────────────────────────────
  function startPolling(requestId: string) {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);

    pollTimerRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/admin/auth/status?requestId=${requestId}`,
        );
        const data = await res.json();

        if (data.status === "approved") {
          clearInterval(pollTimerRef.current!);
          setStatus("approved");
          setTimeout(() => router.push("/admin"), 1_200);
        } else if (data.status === "denied") {
          clearInterval(pollTimerRef.current!);
          setStatus("denied");
        } else if (data.status === "expired") {
          clearInterval(pollTimerRef.current!);
          setStatus("expired");
        }
      } catch {
        // Keep polling through transient network errors
      }
    }, POLL_INTERVAL_MS);
  }

  function retry() {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    requestIdRef.current = null;
    setStatus("idle");
    setErrorMsg("");
  }

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.logo}>🌸</span>
          <h1 className={styles.title}>FlowerS Admin</h1>
          <p className={styles.subtitle}>
            Verify your identity via Telegram to access the admin panel.
          </p>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Status area */}
        <div className={styles.body}>
          {status === "idle" && (
            <button className={styles.btn} onClick={requestAccess}>
              <TelegramIcon />
              Request Access via Telegram
            </button>
          )}

          {status === "sending" && (
            <div className={styles.statusRow}>
              <Spinner />
              <span>Sending request…</span>
            </div>
          )}

          {status === "waiting" && (
            <div className={styles.waitingBlock}>
              <div className={styles.pulse} />
              <p className={styles.waitingTitle}>Check your Telegram</p>
              <p className={styles.waitingHint}>
                A message with Approve / Deny buttons has been sent.
                This page will update automatically.
              </p>
            </div>
          )}

          {status === "approved" && (
            <div className={styles.statusRow + " " + styles.success}>
              <span className={styles.icon}>✅</span>
              <span>Access granted! Redirecting…</span>
            </div>
          )}

          {status === "denied" && (
            <div className={styles.feedbackBlock}>
              <span className={styles.icon}>❌</span>
              <p>Access was denied.</p>
              <button className={styles.btnSecondary} onClick={retry}>
                Try Again
              </button>
            </div>
          )}

          {status === "expired" && (
            <div className={styles.feedbackBlock}>
              <span className={styles.icon}>⏱</span>
              <p>Request expired (5-minute limit).</p>
              <button className={styles.btnSecondary} onClick={retry}>
                Try Again
              </button>
            </div>
          )}

          {status === "error" && (
            <div className={styles.feedbackBlock}>
              <span className={styles.icon}>⚠️</span>
              <p>{errorMsg}</p>
              <button className={styles.btnSecondary} onClick={retry}>
                Try Again
              </button>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}

// ─── Small inline components ──────────────────────────────────────────────────

function Spinner() {
  return <span className={styles.spinner} aria-label="Loading" />;
}

function TelegramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
    </svg>
  );
}
