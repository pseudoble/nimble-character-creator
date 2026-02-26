"use client";

import { useCallback, useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";

interface RollResult {
  label: string;
  dieValue: number;
  modifier: number;
  total: number;
}

export interface DiceOverlayHandle {
  roll: (label: string, modifier: number) => void;
}

export const DiceOverlay = forwardRef<DiceOverlayHandle>(
  function DiceOverlay(_, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const diceBoxRef = useRef<any>(null);
    const initPromiseRef = useRef<Promise<void> | null>(null);
    const failedRef = useRef(false);
    const [rolling, setRolling] = useState(false);
    const [fading, setFading] = useState(false);
    const [toast, setToast] = useState<RollResult | null>(null);
    const toastTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const clearTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const fadeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const pendingLabelRef = useRef<string>("");
    const pendingModifierRef = useRef<number>(0);

    // Dismiss toast
    const dismissToast = useCallback(() => {
      clearTimeout(toastTimerRef.current);
      setToast(null);
    }, []);

    // Lazy init dice-box
    const ensureInit = useCallback(async () => {
      if (failedRef.current) return;
      if (diceBoxRef.current) return;
      if (initPromiseRef.current) {
        await initPromiseRef.current;
        return;
      }

      initPromiseRef.current = (async () => {
        try {
          const { default: DiceBox } = await import("@3d-dice/dice-box");
          const box = new DiceBox("#dice-overlay-canvas", {
            assetPath: "/assets/",
            theme: "default",
            scale: 6,
            enableShadows: true,
          });

          box.onRollComplete = (results: any[]) => {
            const group = results[0];
            if (!group) return;

            const dieValue = group.rolls?.[0]?.value ?? 0;
            const modifier = pendingModifierRef.current;
            const total = dieValue + modifier;

            setToast({
              label: pendingLabelRef.current,
              dieValue,
              modifier,
              total,
            });
            setRolling(false);

            // Fade out container after 2s, then clear dice
            clearTimeout(clearTimerRef.current);
            clearTimeout(fadeTimerRef.current);
            clearTimerRef.current = setTimeout(() => {
              setFading(true);
              // Clear after the CSS transition finishes
              fadeTimerRef.current = setTimeout(() => {
                box.clear();
                setFading(false);
              }, 2000);
            }, 2000);
          };

          await box.init();
          diceBoxRef.current = box;
        } catch (err) {
          console.warn("dice-box failed to initialize:", err);
          failedRef.current = true;
          setRolling(false);
        }
      })();

      await initPromiseRef.current;
    }, []);

    // Roll method exposed via ref
    const roll = useCallback(
      async (label: string, modifier: number) => {
        if (failedRef.current) return;

        pendingLabelRef.current = label;
        pendingModifierRef.current = modifier;

        dismissToast();
        clearTimeout(clearTimerRef.current);
        clearTimeout(fadeTimerRef.current);
        setFading(false);
        setRolling(true);

        await ensureInit();
        if (!diceBoxRef.current) return;

        const notation = modifier === 0 ? "1d20" : modifier > 0 ? `1d20+${modifier}` : `1d20${modifier}`;
        diceBoxRef.current.roll(notation);
      },
      [ensureInit, dismissToast]
    );

    useImperativeHandle(ref, () => ({ roll }), [roll]);

    // Auto-dismiss toast after 4 seconds
    useEffect(() => {
      if (!toast) return;
      toastTimerRef.current = setTimeout(dismissToast, 4000);
      return () => clearTimeout(toastTimerRef.current);
    }, [toast, dismissToast]);

    const formatModifier = (n: number) => (n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`);

    return (
      <>
        {/* Full-viewport invisible dice canvas */}
        <div
          id="dice-overlay-canvas"
          ref={containerRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 50,
            pointerEvents: rolling ? "auto" : "none",
            opacity: fading ? 0 : 1,
            transition: "opacity 2s ease-out",
          }}
        />

        {/* Roll result toast */}
        {toast && (
          <div
            onClick={dismissToast}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-200"
          >
            <div className="rounded-lg border border-neon-cyan/30 bg-surface-2 px-5 py-3 shadow-lg shadow-neon-cyan/10">
              <p className="text-sm text-text-low font-mono uppercase tracking-wider mb-1">
                {toast.label}
              </p>
              <p className="text-xl font-mono text-text-high">
                <span className="text-neon-cyan">{toast.dieValue}</span>
                <span className="text-text-low mx-1">{formatModifier(toast.modifier)}</span>
                <span className="text-text-low mx-1">=</span>
                <span className="text-neon-cyan font-bold">{toast.total}</span>
              </p>
            </div>
          </div>
        )}
      </>
    );
  }
);
