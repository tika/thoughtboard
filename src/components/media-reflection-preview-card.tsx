"use client";

import { MusicIcon, VideoIcon, ImageIcon, LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { ParsedUrl } from "@/services/url-parser";

interface MediaMetadata {
  title?: string;
  image?: string;
  description?: string;
}

interface MediaReflectionPreviewCardProps {
  url: string;
  urlType: ParsedUrl;
}

export function MediaReflectionPreviewCard({
  url,
  urlType,
}: MediaReflectionPreviewCardProps) {
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let controller: AbortController;

    const fetchMetadata = async () => {
      // Set a timeout to show fallback if metadata takes too long
      timeoutId = setTimeout(() => {
        setIsLoading(false);
        setShowFallback(true);
      }, 2000); // 2 second timeout

      try {
        controller = new AbortController();
        // Try to fetch metadata via a proxy or direct fetch
        // For now, we'll try direct fetch but handle CORS gracefully
        const response = await fetch(url, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; MediaBot/1.0; +https://example.com/bot)",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const ogTitle =
          doc.querySelector('meta[property="og:title"]')?.getAttribute("content") ||
          doc.querySelector("title")?.textContent ||
          undefined;

        const ogImage =
          doc.querySelector('meta[property="og:image"]')?.getAttribute("content") ||
          undefined;

        const ogDescription =
          doc.querySelector('meta[property="og:description"]')?.getAttribute("content") ||
          undefined;

        clearTimeout(timeoutId);
        setIsLoading(false);

        if (ogTitle || ogImage) {
          setMetadata({
            title: ogTitle,
            image: ogImage,
            description: ogDescription,
          });
        } else {
          setShowFallback(true);
        }
      } catch (error) {
        // CORS or other fetch errors - show fallback
        clearTimeout(timeoutId);
        setIsLoading(false);
        setShowFallback(true);
      }
    };

    // Only fetch metadata for website URLs
    // For YouTube/Spotify, we can use platform-specific metadata
    if (urlType.type === "website" || urlType.type === "image") {
      fetchMetadata();
    } else {
      // For YouTube and Spotify, show platform-specific info
      setIsLoading(false);
      setShowFallback(true);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (controller) controller.abort();
    };
  }, [url, urlType.type]);

  const getPlatformIcon = () => {
    switch (urlType.type) {
      case "youtube":
        return <VideoIcon className="size-5" />;
      case "spotify":
        return <MusicIcon className="size-5" />;
      case "image":
        return <ImageIcon className="size-5" />;
      default:
        return <LinkIcon className="size-5" />;
    }
  };

  const getPlatformName = () => {
    switch (urlType.type) {
      case "youtube":
        return "YouTube";
      case "spotify":
        return "Spotify";
      case "image":
        return "Image";
      default:
        return "Link";
    }
  };

  const getTruncatedUrl = () => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace("www.", "");
      const pathname = urlObj.pathname;
      const truncatedPath =
        pathname.length > 30 ? `${pathname.slice(0, 30)}...` : pathname;
      return `${hostname}${truncatedPath}`;
    } catch {
      return url.length > 40 ? `${url.slice(0, 40)}...` : url;
    }
  };

  return (
    <Card className="mt-4 border-dashed">
      <CardContent className="p-4">
        {isLoading ? (
          // Loading skeleton
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="size-12 rounded bg-muted animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ) : metadata && !showFallback ? (
          // Metadata loaded successfully
          <div className="flex items-start gap-3">
            {metadata.image && (
              <div className="flex-shrink-0">
                <img
                  src={metadata.image}
                  alt={metadata.title || "Preview"}
                  className="size-16 rounded object-cover"
                  onError={() => setShowFallback(true)}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              {metadata.title && (
                <p className="font-medium text-sm truncate mb-1">
                  {metadata.title}
                </p>
              )}
              {metadata.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {metadata.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {getTruncatedUrl()}
              </p>
            </div>
          </div>
        ) : (
          // Fallback: Platform icon + truncated URL
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 text-muted-foreground">
              {getPlatformIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground">
                {getPlatformName()}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {getTruncatedUrl()}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

