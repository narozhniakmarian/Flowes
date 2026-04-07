"use client";

import { useEffect } from "react";

export default function ThemeInitializer() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return null;
}
