"use client";

import { useState, useEffect } from "react";

export function useContent(key, defaultValue = null) {
  const [content, setContent] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/content?key=${key}`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
          setContent(data.data[0].data);
        } else if (defaultValue) {
          setContent(defaultValue);
        }
        setError(null);
      } catch (err) {
        console.error(`Error fetching content for key "${key}":`, err);
        setError(err);
        if (defaultValue) {
          setContent(defaultValue);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [key]);

  return { content, isLoading, error };
}





