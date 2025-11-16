import z from "zod";

export type UrlType = "youtube" | "spotify" | "image" | "website" | "unknown";

export interface ParsedUrl {
  type: UrlType;
  id?: string;
  url: string;
}

// Zod schema for URL validation
const urlSchema = z.string().url();

/**
 * Parses a URL and returns its type and extracted metadata
 */
export function parseUrl(url: string): ParsedUrl {
  try {
    // Normalize URL - ensure it has a protocol
    let normalizedUrl = url.trim();
    if (!normalizedUrl.match(/^https?:\/\//i)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    const urlObj = new URL(normalizedUrl);

    // Check for YouTube
    if (
      urlObj.hostname === "youtube.com" ||
      urlObj.hostname === "www.youtube.com" ||
      urlObj.hostname === "youtu.be" ||
      urlObj.hostname === "m.youtube.com"
    ) {
      let videoId: string | undefined;

      // youtube.com/watch?v=VIDEO_ID
      if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v") || undefined;
      }
      // youtu.be/VIDEO_ID
      else if (urlObj.hostname === "youtu.be") {
        videoId = urlObj.pathname.slice(1) || undefined;
      }
      // youtube.com/embed/VIDEO_ID
      else if (urlObj.pathname.startsWith("/embed/")) {
        videoId = urlObj.pathname.split("/embed/")[1] || undefined;
      }

      if (videoId) {
        return {
          type: "youtube",
          id: videoId,
          url: normalizedUrl,
        };
      }
    }

    // Check for Spotify
    if (
      urlObj.hostname === "open.spotify.com" ||
      urlObj.hostname === "spotify.com"
    ) {
      const pathParts = urlObj.pathname.split("/").filter(Boolean);
      if (pathParts.length >= 2) {
        const type = pathParts[0]; // "track", "album", "playlist", etc.
        const id = pathParts[1];

        if ((type === "track" || type === "album") && id) {
          return {
            type: "spotify",
            id: `${type}:${id}`,
            url: normalizedUrl,
          };
        }
      }
    }

    // Check for direct image URLs
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
    if (imageExtensions.test(urlObj.pathname)) {
      return {
        type: "image",
        url: normalizedUrl,
      };
    }

    // Check for valid website URL
    if (urlObj.protocol === "http:" || urlObj.protocol === "https:") {
      return {
        type: "website",
        url: normalizedUrl,
      };
    }

    return {
      type: "unknown",
      url: normalizedUrl,
    };
  } catch {
    return {
      type: "unknown",
      url: url,
    };
  }
}

/**
 * Extracts the first valid URL from a text string
 * Validates URLs using z.url() to ensure they're actually valid URLs
 */
export function extractUrlFromText(text: string): string | null {
  // URL regex pattern - matches http(s):// URLs or URLs without protocol
  // For URLs without protocol, require at least one dot (domain.tld structure)
  const urlPattern =
    /(https?:\/\/[^\s]+|(?:www\.)?[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?:\/[^\s]*)?)/gi;

  const matches = text.match(urlPattern);
  if (!matches || matches.length === 0) {
    return null;
  }

  // Check each match and validate with z.url()
  for (const match of matches) {
    let urlToValidate = match.trim();

    // Skip if it doesn't look like a URL (no protocol and no dot = not a domain)
    if (!urlToValidate.match(/^https?:\/\//i)) {
      // Must have at least one dot to be a valid domain
      if (!urlToValidate.includes(".")) {
        continue;
      }
      urlToValidate = `https://${urlToValidate}`;
    }

    // Validate with Zod URL schema - this ensures it's actually a valid URL
    const validationResult = urlSchema.safeParse(urlToValidate);
    if (validationResult.success) {
      // Valid URL - parse it to get type
      const parsed = parseUrl(urlToValidate);

      // Only return if it's a valid URL type (not unknown)
      if (parsed.type !== "unknown") {
        return parsed.url;
      }
    }
  }

  return null;
}

/**
 * Removes URLs from text content
 * Handles both the original URL format and normalized URL format
 */
export function removeUrlFromText(text: string, url: string): string {
  // Normalize the URL for comparison
  let normalizedUrl = url.trim();
  if (!normalizedUrl.match(/^https?:\/\//i)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  // Try to remove both the original URL and normalized version
  let cleaned = text.replace(url, "").trim();
  cleaned = cleaned.replace(normalizedUrl, "").trim();

  // Also try without protocol
  const urlWithoutProtocol = url.replace(/^https?:\/\//i, "");
  cleaned = cleaned.replace(urlWithoutProtocol, "").trim();

  // Clean up extra whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

