'use client';

import * as React from 'react';
import { Sparkles, Briefcase, Share2, LoaderCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/hooks/use-language';
import type {
  GenerationMode,
  GenerationOptions,
  Length,
  Platform,
  Tone,
} from '@/types';

interface InputFormProps {
  onGenerate: (opts: GenerationOptions) => void;
  isGenerating: boolean;
}

export function InputForm({ onGenerate, isGenerating }: InputFormProps) {
  const { lang, t } = useLanguage();

  const [mode, setMode] = React.useState<GenerationMode>('cover-letter');
  const [tone, setTone] = React.useState<Tone>('professional');
  const [length, setLength] = React.useState<Length>('medium');

  const [jobTitle, setJobTitle] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [skills, setSkills] = React.useState('');

  const [topic, setTopic] = React.useState('');
  const [keyPoints, setKeyPoints] = React.useState('');
  const [platform, setPlatform] = React.useState<Platform>('linkedin');

  const coverLetterValid = jobTitle.trim().length > 0;
  const socialPostValid = topic.trim().length > 0;
  const isValid = mode === 'cover-letter' ? coverLetterValid : socialPostValid;

  const toneOptions = Object.entries(t.tones).map(([value, label]) => ({
    value: value as Tone,
    label,
  }));
  const lengthOptions = Object.entries(t.lengths).map(([value, label]) => ({
    value: value as Length,
    label,
  }));
  const platformOptions = Object.entries(t.platforms).map(([value, label]) => ({
    value: value as Platform,
    label,
  }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || isGenerating) return;

    onGenerate({
      mode,
      tone,
      length,
      language: lang,
      coverLetter:
        mode === 'cover-letter'
          ? {
              jobTitle: jobTitle.trim(),
              company: company.trim() || undefined,
              skills: skills.trim(),
            }
          : undefined,
      socialPost:
        mode === 'social-post'
          ? {
              topic: topic.trim(),
              keyPoints: keyPoints.trim(),
              platform,
            }
          : undefined,
    });
  }

  return (
    <Card className="glass border-border/50 shadow-lg shadow-black/[0.03]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <span className="gradient-text">{t.createContent}</span>
        </CardTitle>
        <CardDescription>{t.formDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as GenerationMode)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cover-letter" className="gap-2">
                <Briefcase className="h-4 w-4" />
                {t.coverLetter}
              </TabsTrigger>
              <TabsTrigger value="social-post" className="gap-2">
                <Share2 className="h-4 w-4" />
                {t.socialPost}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cover-letter" className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">
                  {t.jobTitle} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="jobTitle"
                  placeholder={t.jobTitlePlaceholder}
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  aria-required="true"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">{t.targetCompanyOptional}</Label>
                <Input
                  id="company"
                  placeholder={t.companyPlaceholder}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">{t.keySkills}</Label>
                <Textarea
                  id="skills"
                  rows={5}
                  placeholder={t.skillsPlaceholder}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="social-post" className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="topic">
                  {t.topic} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="topic"
                  placeholder={t.topicPlaceholder}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  aria-required="true"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keyPoints">{t.keyPoints}</Label>
                <Textarea
                  id="keyPoints"
                  rows={5}
                  placeholder={t.keyPointsPlaceholder}
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform">{t.targetPlatform}</Label>
                <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
                  <SelectTrigger id="platform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone">{t.tone}</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">{t.targetLength}</Label>
              <Select value={length} onValueChange={(v) => setLength(v as Length)}>
                <SelectTrigger id="length">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lengthOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isValid || isGenerating}
            className="gradient-brand w-full gap-2 text-base font-semibold shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
            size="lg"
          >
            {isGenerating ? (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
            {isGenerating ? t.generating : t.generate}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
