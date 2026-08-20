'use client';

import * as React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Header } from '@/components/header';
import { InputForm } from '@/components/input-form';
import { OutputCard } from '@/components/output-card';
import { HistorySidebar } from '@/components/history-sidebar';
import { useHistory } from '@/hooks/use-history';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import {
  generateContentStream,
  classifyError,
  type GenerationError,
} from '@/services/aiService';
import type { GenerationOptions, HistoryItem } from '@/types';

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function Home() {
  const {
    items,
    addHistory,
    deleteHistory,
    toggleFavorite,
    clearAll,
  } = useHistory();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [lastOpts, setLastOpts] = React.useState<GenerationOptions | null>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const [output, setOutput] = React.useState({
    content: '',
    title: '',
    wordCount: 0,
    charCount: 0,
  });

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  function showErrorToast(err: GenerationError) {
    toast({
      title: 'Ошибка при генерации. Попробуйте еще раз',
      description: err.message,
      variant: 'destructive',
    });
  }

  async function runGenerate(opts: GenerationOptions) {
    setIsGenerating(true);
    setIsStreaming(false);
    setOutput({ content: '', title: '', wordCount: 0, charCount: 0 });
    setActiveId(null);

    try {
      let finalContent = '';
      let finalTitle = '';
      let finalWordCount = 0;
      let finalCharCount = 0;

      const result = await generateContentStream(opts, (chunk, accumulated) => {
        // First chunk arrives → switch from skeleton to streaming text
        setIsStreaming(true);
        setOutput({
          content: accumulated,
          title: buildTitle(opts),
          wordCount: countWords(accumulated),
          charCount: accumulated.length,
        });
        finalContent = accumulated;
      });

      finalContent = result.content;
      finalTitle = result.title;
      finalWordCount = result.wordCount;
      finalCharCount = result.charCount;

      setOutput({
        content: finalContent,
        title: finalTitle,
        wordCount: finalWordCount,
        charCount: finalCharCount,
      });
      setLastOpts(opts);

      // Auto-save to history
      const item: HistoryItem = {
        id: makeId(),
        title: finalTitle,
        content: finalContent,
        mode: opts.mode,
        tone: opts.tone,
        length: opts.length,
        language: opts.language,
        platform: opts.socialPost?.platform,
        wordCount: finalWordCount,
        charCount: finalCharCount,
        createdAt: new Date().toISOString(),
        favorite: false,
      };
      addHistory(item);
      setActiveId(item.id);

      toast({
        title: 'Готово!',
        description: t.autoSavedDesc,
      });
    } catch (err) {
      const classified = classifyError(err);
      showErrorToast(classified);
      // Clear partial content on error
      setOutput({ content: '', title: '', wordCount: 0, charCount: 0 });
    } finally {
      setIsGenerating(false);
      setIsStreaming(false);
    }
  }

  function handleSelectHistory(item: HistoryItem) {
    setOutput({
      content: item.content,
      title: item.title,
      wordCount: item.wordCount,
      charCount: item.charCount,
    });
    setActiveId(item.id);
    setSidebarOpen(false);
  }

  function handleDeleteHistory(id: string) {
    deleteHistory(id);
    if (activeId === id) {
      setActiveId(null);
      setOutput({ content: '', title: '', wordCount: 0, charCount: 0 });
    }
  }

  function handleClearOutput() {
    setOutput({ content: '', title: '', wordCount: 0, charCount: 0 });
    setActiveId(null);
  }

  function handleRegenerate() {
    if (lastOpts) runGenerate(lastOpts);
  }

  function handleToggleFavorite() {
    if (activeId) toggleFavorite(activeId);
  }

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;
  const isFavorite = activeItem?.favorite ?? false;

  return (
    <div className="gradient-mesh min-h-screen">
      <Header onToggleSidebar={() => setSidebarOpen(true)} />

      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 sm:px-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-[5.5rem] h-[calc(100vh-7rem)]">
            <HistorySidebar
              items={items}
              activeId={activeId}
              onSelect={handleSelectHistory}
              onDelete={handleDeleteHistory}
              onToggleFavorite={toggleFavorite}
              onClearAll={clearAll}
            />
          </div>
        </aside>

        {/* Mobile sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-80 p-3 sm:max-w-xs">
            <HistorySidebar
              items={items}
              activeId={activeId}
              onSelect={handleSelectHistory}
              onDelete={handleDeleteHistory}
              onToggleFavorite={toggleFavorite}
              onClearAll={clearAll}
              onClose={() => setSidebarOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* Main workspace */}
        <main className="min-w-0 flex-1">
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="xl:sticky xl:top-[5.5rem] xl:self-start">
              <InputForm onGenerate={runGenerate} isGenerating={isGenerating} />
            </div>
            <OutputCard
              content={output.content}
              title={output.title}
              wordCount={output.wordCount}
              charCount={output.charCount}
              isGenerating={isGenerating}
              isStreaming={isStreaming}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              onRegenerate={handleRegenerate}
              onClear={handleClearOutput}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Local helpers (mirroring aiService internals for UI display) ──

function buildTitle(opts: GenerationOptions): string {
  if (opts.mode === 'cover-letter') {
    const role =
      opts.coverLetter?.jobTitle ||
      (opts.language === 'ru' ? 'Сопроводительное письмо' : 'Cover Letter');
    const co = opts.coverLetter?.company ? ` — ${opts.coverLetter.company}` : '';
    return `${role}${co}`;
  }
  return (
    opts.socialPost?.topic ||
    (opts.language === 'ru' ? 'Пост' : 'Social Post')
  );
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
