"use client";

import { useEffect, useState } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = window.localStorage.getItem("tradehub_cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 max-w-xl bg-white shadow-lg rounded-lg p-4 text-xs flex flex-col md:flex-row gap-3 items-center border border-slate-200 z-50">
      <p className="text-slate-600">
        TradeHub nutzt Cookies für grundlegende Funktionen und optionale Analyse.
        Details in der Datenschutzerklärung.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => {
            localStorage.setItem("tradehub_cookie_consent", "declined");
            setVisible(false);
          }}
          className="btn-outline text-xs"
        >
          Ablehnen
        </button>
        <button
          onClick={() => {
            localStorage.setItem("tradehub_cookie_consent", "accepted");
            setVisible(false);
          }}
          className="btn-primary text-xs"
        >
          Zustimmen
        </button>
      </div>
    </div>
  );
}
