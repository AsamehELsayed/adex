"use client";

import { useMemo } from "react";
import { useContent } from "@/hooks/use-content";
import { useLanguage } from "@/contexts/language-context";
import { localizeContent } from "@/lib/localization";

export function useLocalizedContent(key, defaultValue = null) {
  const { content, isLoading, error } = useContent(key, defaultValue);
  const { language } = useLanguage();

  const localizedContent = useMemo(
    () => localizeContent(content || defaultValue, language),
    [content, defaultValue, language]
  );

  return { content: localizedContent, isLoading, error, language };
}
