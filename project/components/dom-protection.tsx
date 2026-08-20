'use client';

import { useEffect } from 'react';

export function DOMProtection({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const originalRemoveChild = Node.prototype.removeChild;
      Node.prototype.removeChild = function <T extends Node>(child: T): T {
        if (child.parentNode !== this) {
          if (console) {
            console.warn('Prevented removeChild crash from external DOM mutation.', child);
          }
          return child;
        }
        return originalRemoveChild.call(this, child) as T;
      };

      const originalInsertBefore = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function <T extends Node>(node: T, child: Node | null): T {
        if (child && child.parentNode !== this) {
          if (console) {
            console.warn('Prevented insertBefore crash from external DOM mutation.', node);
          }
          return node;
        }
        return originalInsertBefore.call(this, node, child) as T;
      };
    }
  }, []);

  return <>{children}</>;
}