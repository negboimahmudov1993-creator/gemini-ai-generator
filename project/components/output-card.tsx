'use client';

import * as React from 'react';
import {
  Copy,
  Star,
  RefreshCw,
  Trash2,
  Check,
  FileText,
  Type,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

interface OutputCardProps {
  content: string;
  title: string;
  wordCount: number;
  charCount: number;
  isGenerating: boolean;
  isStreaming: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRegenerate: () => void;
  onClear: () => void;
}

// Преобразование текста в безопасную HTML-строку
function formatContentToHTML(text: string): string {
  const lines = text.split('\n');
  return lines
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '<div class="h-3"></div>';

      if (line.startsWith('▸ ') || line.startsWith('   • ') || line.startsWith('• ')) {
        const cleanText = line.replace(/^[▸•\s]+/, '');
        return `<div class="flex gap-2 pl-2 text-sm leading-relaxed"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></span><span>${cleanText}</span></div>`;
      }

      if (/^(Sincerely,|Dear |С уважением,|Уважаемый)/.test(trimmed)) {
        return `<p class="text-sm leading-relaxed">${line}</p>`;
      }

      if (/^#\w/.test(trimmed)) {
        return `<p class="pt-2 text-sm font-medium text-primary">${line}</p>`;
      }

      return `<p class="text-sm leading-relaxed">${line}</p>`;
    })
    .join('');
}

// Полностью изоляционный контейнер для текста: React не отслеживает его дочерние узлы
function SafeTranslatedContent({ content }: { content: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = formatContentToHTML(content);
    }
  }, [content]);

  return (
    <div
      ref={containerRef}
      translate="no"
      className="notranslate space-y-1 whitespace-pre-wrap text-foreground/90"
      suppressHydrationWarning
    />
  );
}

export function OutputCard({
  content,
  title,
  wordCount,
  charCount,
  isGenerating,
  isFavorite,
  onToggleFavorite,
  onRegenerate,
  onClear,
}: OutputCardProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isGenerating && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [content, isGenerating]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: 'Скопировано в буфер обмена!',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: t.copyFailedTitle,
        description: t.copyFailedDesc,
        variant: 'destructive',
      });
    }
  }

  const hasContent = content.length > 0;
  const showSkeletons = isGenerating && !hasContent;
  const showStreaming = isGenerating && hasContent;
  const showActions = hasContent && !isGenerating;

  return (
    <Card className="glass flex min-h-[500px] flex-col border-border/50 shadow-lg shadow-black/[0.03]">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <CardTitle className="text-base font-semibold text-foreground/90">
            <span suppressHydrationWarning>
              {title || (isMounted ? t.output : '')}
            </span>
          </CardTitle>
          {hasContent && !isGenerating && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Badge variant="secondary" className="gap-1 font-normal">
                <Type className="h-3 w-3" />
                <span suppressHydrationWarning>
                  {wordCount} {isMounted ? t.words : ''}
                </span>
              </Badge>
              <Badge variant="secondary" className="gap-1 font-normal">
                <FileText className="h-3 w-3" />
                <span suppressHydrationWarning>
                  {charCount} {isMounted ? t.chars : ''}
                </span>
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto rounded-lg border border-border/40 bg-background/40 p-4"
        >
          {showSkeletons ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-[80%] animate-shimmer" />
              <Skeleton className="h-4 w-[95%] animate-shimmer" />
              <Skeleton className="h-4 w-[60%] animate-shimmer" />
              <div className="h-3" />
              <Skeleton className="h-4 w-[90%] animate-shimmer" />
              <Skeleton className="h-4 w-[70%] animate-shimmer" />
              <div className="h-3" />
              <Skeleton className="h-4 w-[85%] animate-shimmer" />
              <Skeleton className="h-4 w-[50%] animate-shimmer" />
              <div className="flex items-center gap-2 pt-4 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span suppressHydrationWarning>{isMounted ? t.crafting : ''}</span>
              </div>
            </div>
          ) : hasContent ? (
            <div className="animate-fade-in">
              <SafeTranslatedContent content={content} />
              {showStreaming && (
                <span className="typing-cursor inline-block" aria-hidden="true" />
              )}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
                <FileText className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <p className="text-sm font-medium text-muted-foreground" suppressHydrationWarning>
                {isMounted ? t.noContentTitle : 'No content yet'}
              </p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground/70" suppressHydrationWarning>
                {isMounted ? t.noContentDesc : ''}
              </p>
            </div>
          )}
        </div>

        {showStreaming && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground animate-fade-in">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span suppressHydrationWarning>{isMounted ? t.streaming : ''}</span>
          </div>
        )}

        {showActions && (
          <div className="mt-4 flex flex-wrap items-center gap-2 animate-slide-up">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className={cn(
                'gap-1.5 transition-all duration-200',
                copied && 'border-success/40 bg-success/10 text-success'
              )}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span suppressHydrationWarning>
                {copied ? (isMounted ? t.copied : '') : (isMounted ? t.copy : '')}
              </span>
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleFavorite}
                  className={cn(
                    'gap-1.5 transition-all duration-200',
                    isFavorite && 'border-warning/40 bg-warning/10 text-warning'
                  )}
                >
                  <Star
                    className={cn(
                      'h-4 w-4',
                      isFavorite && 'fill-warning'
                    )}
                  />
                  <span suppressHydrationWarning>
                    {isFavorite ? (isMounted ? t.saved : '') : (isMounted ? t.save : '')}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span suppressHydrationWarning>
                  {isFavorite ? (isMounted ? t.removeFavorite : '') : (isMounted ? t.addToFavorites : '')}
                </span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRegenerate}
                  className="gap-1.5 transition-all duration-200"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span suppressHydrationWarning>
                    {isMounted ? t.regenerate : ''}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span suppressHydrationWarning>{isMounted ? t.regenerateTooltip : ''}</span>
              </TooltipContent>
            </Tooltip>

            <div className="ml-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="gap-1.5 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span suppressHydrationWarning>
                      {isMounted ? t.clear : ''}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span suppressHydrationWarning>{isMounted ? t.clearTooltip : ''}</span>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
