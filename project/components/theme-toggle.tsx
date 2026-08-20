'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = theme === 'dark';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="relative overflow-hidden border-border/60 bg-background/60 backdrop-blur transition-all duration-200 hover:scale-105"
        >
          {mounted ? (
            isDark ? (
              <Moon className="h-[1.2rem] w-[1.2rem] transition-all duration-300" />
            ) : (
              <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-300" />
            )
          ) : (
            <div className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Switch to {isDark ? 'light' : 'dark'} mode</p>
      </TooltipContent>
    </Tooltip>
  );
}
