"use client";
import React from "react";
import { Button } from "@/components/ui/moving-border";

export function FloatingJoinButton({ onClick, label = "Join Queue" }: { onClick?: () => void; label?: string }) {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        borderRadius="1.75rem"
        containerClassName="h-12"
        className="bg-slate-900 text-white border-slate-700 hover:bg-slate-800 transition-colors"
        onClick={onClick}
      >
        {label}
      </Button>
    </div>
  );
}
