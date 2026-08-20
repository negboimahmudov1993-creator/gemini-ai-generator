'use client';

import * as React from 'react';
import {
  History,
  Trash2,
  Star,
  Briefcase,
  Share2,
  Inbox,
  PanelLeftClose,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';
import type { HistoryItem } from '@/types';

interface HistorySidebarProps {
  items: HistoryItem[];
  activeId: string | null;
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onClearAll: () => void;
  onClose?: () => void;
}

function formatRelative(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'just-now';
  if (diffMin < 60) return `min:${diffMin}`;
  if (diffHr < 24) return `hr:${diffHr}`;
  if (diffDay < 7) return `day:${diffDay}`;
  return d.toLocaleDateString();
}

function renderRelative(dateStr: string, t: ReturnType<typeof useLanguage>['t']): string {
  const rel = formatRelative(dateStr);
  if (rel === 'just-now') return t.justNow;
  const [type, nStr] = rel.split(':');
  const n = parseInt(nStr, 10);
  if (type === 'min') return t.minutesAgo(n);
  if (type === 'hr') return t.hoursAgo(n);
  if (type === 'day') return t.daysAgo(n);
  return rel;
}

export function HistorySidebar({
  items,
  activeId,
  onSelect,
  onDelete,
  onToggleFavorite,
  onClearAll,
  onClose,
}: HistorySidebarProps) {
  const { t } = useLanguage();
  const favorites = items.filter((i) => i.favorite);
  const recent = items.filter((i) => !i.favorite);

  return (
    <Card className="glass flex h-full flex-col border-border/50 shadow-lg shadow-black/[0.03]">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-4 w-4 text-primary" />
          {t.history}
        </CardTitle>
        <div className="flex items-center gap-1">
          {onClose && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 lg:hidden"
                  onClick={onClose}
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t.closeSidebar}</TooltipContent>
            </Tooltip>
          )}
          {items.length > 0 && (
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      aria-label={t.clearAllHistory}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>{t.clearAllHistory}</TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.clearAllTitle}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t.clearAllDesc(items.length)}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onClearAll}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {t.clearAll}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50">
              <Inbox className="h-7 w-7 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {t.noHistoryTitle}
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              {t.noHistoryDesc}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-full px-3 pb-3">
            <div className="space-y-4">
              {favorites.length > 0 && (
                <div>
                  <p className="mb-2 flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    {t.favorites}
                  </p>
                  <div className="space-y-1.5">
                    {favorites.map((item) => (
                      <HistoryRow
                        key={item.id}
                        item={item}
                        active={activeId === item.id}
                        onSelect={onSelect}
                        onDelete={onDelete}
                        onToggleFavorite={onToggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              )}

              {recent.length > 0 && (
                <div>
                  {favorites.length > 0 && (
                    <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t.recent}
                    </p>
                  )}
                  <div className="space-y-1.5">
                    {recent.map((item) => (
                      <HistoryRow
                        key={item.id}
                        item={item}
                        active={activeId === item.id}
                        onSelect={onSelect}
                        onDelete={onDelete}
                        onToggleFavorite={onToggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

interface HistoryRowProps {
  item: HistoryItem;
  active: boolean;
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

function HistoryRow({
  item,
  active,
  onSelect,
  onDelete,
  onToggleFavorite,
}: HistoryRowProps) {
  const { t } = useLanguage();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item);
        }
      }}
      className={cn(
        'group relative cursor-pointer rounded-lg border p-3 transition-all duration-200',
        active
          ? 'border-primary/40 bg-primary/5 shadow-sm'
          : 'border-border/40 bg-background/30 hover:border-border/60 hover:bg-background/50'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {item.mode === 'cover-letter' ? (
              <Briefcase className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            ) : (
              <Share2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            )}
            <p className="truncate text-sm font-medium text-foreground/90">
              {item.title}
            </p>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Badge
              variant="secondary"
              className="px-1.5 py-0 text-[10px] font-normal"
            >
              {t.tones[item.tone]}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              {renderRelative(item.createdAt, t)}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(item.id);
                }}
                aria-label={item.favorite ? t.removeFavorite : t.addToFavorites}
              >
                <Star
                  className={cn(
                    'h-3.5 w-3.5',
                    item.favorite
                      ? 'fill-warning text-warning'
                      : 'text-muted-foreground'
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {item.favorite ? t.removeFavorite : t.addToFavorites}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                aria-label={t.deleteFromHistory}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t.delete}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
