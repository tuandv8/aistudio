import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';

/**
 * Dropdown render qua portal → không bị clip bởi overflow-hidden của panel.
 * Tự lật lên trên khi thiếu chỗ phía dưới, reposition khi scroll/resize.
 */
export default function Popover({
  open,
  onClose,
  anchorRef,
  children,
  maxHeight = 300,
}: {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  maxHeight?: number;
}) {
  const popRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ visibility: 'hidden' });

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const a = anchorRef.current?.getBoundingClientRect();
      if (!a) return;
      const gap = 4;
      const below = window.innerHeight - a.bottom - gap;
      const above = a.top - gap;
      const up = below < 280 && above > below;
      setStyle({
        position: 'fixed',
        left: a.left,
        width: a.width,
        top: up ? a.top - gap : a.bottom + gap,
        transform: up ? 'translateY(-100%)' : 'none',
        maxHeight: Math.min(maxHeight, Math.max(140, (up ? above : below) - 8)),
        zIndex: 90,
        visibility: 'visible',
      });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, anchorRef, maxHeight]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!anchorRef.current?.contains(t) && !popRef.current?.contains(t)) onClose();
    };
    window.addEventListener('mousedown', close);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('mousedown', close);
      window.removeEventListener('keydown', esc);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;
  return createPortal(
    <div
      ref={popRef}
      style={style}
      className="modal-in overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15"
      onWheel={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body,
  );
}
