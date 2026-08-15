"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function OwnerStudioAccess() {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) return null;

  return (
    <>
      <Link
        href="/studio"
        className="owner-studio-access"
        aria-label="Open Marbella For Sale control panel"
      >
        <span className="owner-studio-access__status" aria-hidden="true" />
        <span className="owner-studio-access__copy">
          <small>Private access</small>
          <strong>Control panel</strong>
        </span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      </Link>

      <style>{`
        .owner-studio-access {
          position: fixed;
          z-index: 44;
          top: 110px;
          right: clamp(16px, 2vw, 30px);
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          gap: 11px;
          padding: 9px 13px 9px 12px;
          border: 1px solid rgba(28, 38, 35, .14);
          background: rgba(250, 249, 246, .9);
          color: var(--ink);
          box-shadow: 0 12px 34px rgba(12, 28, 22, .08);
          backdrop-filter: blur(16px) saturate(1.08);
          -webkit-backdrop-filter: blur(16px) saturate(1.08);
          transition: transform .3s cubic-bezier(.16,1,.3,1), border-color .3s ease, background .3s ease, box-shadow .3s ease;
        }

        .owner-studio-access:hover {
          transform: translateY(-2px);
          border-color: rgba(28, 38, 35, .28);
          background: rgba(250, 249, 246, .98);
          box-shadow: 0 16px 40px rgba(12, 28, 22, .12);
        }

        .owner-studio-access__status {
          width: 7px;
          height: 7px;
          flex: none;
          border-radius: 50%;
          background: var(--sand);
          box-shadow: 0 0 0 4px rgba(209, 185, 148, .18);
        }

        .owner-studio-access__copy {
          display: flex;
          flex-direction: column;
          gap: 3px;
          line-height: 1;
        }

        .owner-studio-access__copy small {
          color: #748079;
          font-size: 6px;
          font-weight: 650;
          letter-spacing: .17em;
          text-transform: uppercase;
        }

        .owner-studio-access__copy strong {
          font-size: 9px;
          font-weight: 650;
          letter-spacing: .11em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .owner-studio-access svg {
          width: 18px;
          height: 18px;
          flex: none;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.35;
          transition: transform .3s cubic-bezier(.16,1,.3,1);
        }

        .owner-studio-access:hover svg {
          transform: translateX(2px);
        }

        @media (max-width: 1180px) {
          .owner-studio-access {
            top: 104px;
          }
        }

        @media (max-width: 800px) {
          .owner-studio-access {
            top: 88px;
            right: 14px;
            min-height: 43px;
            gap: 9px;
            padding: 8px 10px;
          }

          .owner-studio-access__copy small {
            display: none;
          }

          .owner-studio-access__copy strong {
            font-size: 8px;
          }

          .owner-studio-access svg {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
    </>
  );
}
