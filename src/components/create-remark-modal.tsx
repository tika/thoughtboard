"use client";

import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { client } from "@/lib/orpc";
import { remarkSchema } from "@/lib/utils";
import {
  extractUrlFromText,
  parseUrl,
  removeUrlFromText,
  type ParsedUrl,
} from "@/services/url-parser";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Field, FieldError, FieldGroup } from "./ui/field";
import { MediaReflectionPreviewCard } from "./media-reflection-preview-card";
import { Textarea } from "./ui/textarea";

const createPostFormSchema = z.object({
  content: remarkSchema,
});

interface PostModalProps {
  trigger?: React.ReactNode;
}

export function PostModal({ trigger }: PostModalProps = {}) {
  const { user } = useUser();
  const [detectedUrl, setDetectedUrl] = useState<string | null>(null);
  const [parsedUrl, setParsedUrl] = useState<ParsedUrl | null>(null);

  const form = useForm<z.infer<typeof createPostFormSchema>>({
    resolver: zodResolver(createPostFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const url = extractUrlFromText(pastedText);

    if (url && !detectedUrl) {
      // Validate URL with z.url() before proceeding
      const urlValidation = z.string().url().safeParse(url);
      if (!urlValidation.success) {
        return; // Not a valid URL, don't process
      }

      // Only detect first URL
      const parsed = parseUrl(url);
      if (parsed.type !== "unknown") {
        // Let the paste happen first, then clean up
        // Use requestAnimationFrame to check after paste completes
        requestAnimationFrame(() => {
          const currentValue = form.getValues("content");
          const cleanedValue = removeUrlFromText(currentValue, url).trim();

          if (cleanedValue !== currentValue) {
            setDetectedUrl(url);
            setParsedUrl(parsed);
            form.setValue("content", cleanedValue, { shouldValidate: true });
          }
        });
      }
    }
  };

  const handleInputChange = (value: string) => {
    // Only check if an existing detected URL was removed
    // Don't try to detect new URLs while typing - that interferes with normal typing
    if (detectedUrl) {
      const normalizedUrl = detectedUrl.startsWith("http")
        ? detectedUrl
        : `https://${detectedUrl}`;
      const urlWithoutProtocol = detectedUrl.replace(/^https?:\/\//i, "");

      if (
        !value.includes(detectedUrl) &&
        !value.includes(normalizedUrl) &&
        !value.includes(urlWithoutProtocol)
      ) {
        // URL was removed, clear the detected URL
        setDetectedUrl(null);
        setParsedUrl(null);
      }
    }
  };

  async function submitHandler(data: z.infer<typeof createPostFormSchema>) {
    if (!user?.id) return;

    // Create a standard Remark - no automatic Reflection creation
    // The preview card is just for UI feedback, but Reflections are created manually later
    const newRemark = client.remark.create({
      content: data.content,
      userId: user.id,
    });

    toast.promise(newRemark, {
      loading: "Creating remark...",
      success: (data) => `Remark created successfully: ${data.content}`,
      error: "Failed to create remark",
    });

    form.reset();
    setDetectedUrl(null);
    setParsedUrl(null);
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset URL state when dialog closes
      setDetectedUrl(null);
      setParsedUrl(null);
      form.reset();
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger ?? <Button>Post</Button>}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Post Remark</DialogTitle>
        <form onSubmit={form.handleSubmit(submitHandler)} id="post-editor-form">
          <FieldGroup>
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Textarea
                    {...field}
                    onPaste={handlePaste}
                    onChange={(e) => {
                      field.onChange(e);
                      handleInputChange(e.target.value);
                    }}
                    aria-invalid={fieldState.invalid}
                    placeholder="Write something..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {detectedUrl && parsedUrl && (
              <MediaReflectionPreviewCard url={detectedUrl} urlType={parsedUrl} />
            )}
          </FieldGroup>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setDetectedUrl(null);
                  setParsedUrl(null);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" form="post-editor-form">
              Post Remark
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
