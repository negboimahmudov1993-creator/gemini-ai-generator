'use client';

import { Sparkles, PanelLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { useLanguage } from '@/hooks/use-language';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 border-b border-border/40 glass">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSidebar}
                aria-label={t.toggleHistory}
                className="lg:hidden"
              >
                <PanelLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t.toggleHistory}</TooltipContent>
          </Tooltip>

          <div className="flex items-center gap-2.5">
            <div className="gradient-brand flex h-9 w-9 items-center justify-center rounded-xl shadow-lg shadow-primary/20 transition-transform duration-200 hover:scale-105">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight">
                <span className="gradient-text">VibeGen</span>{' '}
                <span className="text-foreground">AI</span>
              </h1>
              <Badge
                variant="secondary"
                className="hidden border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary sm:inline-flex"
              >
                {t.badgeMvp}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            {t.builtWith}
          </a>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
