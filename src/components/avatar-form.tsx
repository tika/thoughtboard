"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ProfileAvatar } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createAvatarUploadUrl } from "@/lib/blob";
import { client } from "@/lib/orpc";

type AvatarOption = "boringavatar" | "upload";

export function AvatarForm({
  userId,
  currentAvatarUrl,
  handle,
}: {
  userId: string;
  currentAvatarUrl: string | null;
  handle: string;
}) {
  const router = useRouter();
  const { user } = useUser();
  const [selectedOption, setSelectedOption] = useState<AvatarOption>(
    currentAvatarUrl ? "upload" : "boringavatar",
  );
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(
    currentAvatarUrl,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!user) return;

    setIsUploading(true);
    try {
      const url = await createAvatarUploadUrl(file, user.id);
      setUploadedUrl(url);
      // Automatically switch to upload option when file is uploaded
      setSelectedOption("upload");
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (selectedOption === "upload" && !uploadedUrl) {
        throw new Error("Please upload an image");
      }

      // Determine the final avatar URL based on selection
      const avatarUrl = selectedOption === "boringavatar" ? null : uploadedUrl;

      // Ensure we have a valid value: null for boringavatar, or a URL for upload
      if (selectedOption === "upload" && !avatarUrl) {
        throw new Error("Please upload an image");
      }

      await client.profile.updateAvatar({
        avatarUrl: avatarUrl,
        clerkId: userId,
      });
      router.push("/onboarding/completed");
      router.refresh();
    } catch (error) {
      console.error("Error updating avatar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute preview URL: explicitly null for boringavatar, uploadedUrl for upload
  // When boringavatar is selected, always use null to show generated avatar
  // When upload is selected, use uploadedUrl if available, otherwise null
  const previewAvatarUrl: string | null =
    selectedOption === "boringavatar"
      ? null
      : uploadedUrl && uploadedUrl.length > 0
        ? uploadedUrl
        : null;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Choose Your Avatar</CardTitle>
        <CardDescription>
          Select how you&apos;d like your avatar to appear on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <RadioGroup
            value={selectedOption}
            onValueChange={(value) => setSelectedOption(value as AvatarOption)}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="boringavatar" id="boringavatar" />
              <Label htmlFor="boringavatar" className="cursor-pointer">
                Use generated avatar
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="upload" id="upload" />
              <Label htmlFor="upload" className="cursor-pointer">
                Upload custom image
              </Label>
            </div>
          </RadioGroup>

          {selectedOption === "upload" && (
            <FieldGroup>
              <Field>
                <FieldLabel>Upload Image</FieldLabel>
                <FieldContent>
                  <input
                    ref={inputFileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file);
                      }
                    }}
                    className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  {isUploading && (
                    <p className="text-sm text-muted-foreground">
                      Uploading...
                    </p>
                  )}
                </FieldContent>
              </Field>
            </FieldGroup>
          )}

          <div className="flex items-center justify-center py-4">
            <ProfileAvatar
              key={`${selectedOption}-${previewAvatarUrl || "null"}`}
              profile={{
                avatarUrl: previewAvatarUrl,
                handle: handle || "user",
              }}
              size={96}
            />
          </div>

          <div className="flex justify-between">
            <Link href="/onboarding/handle">
              <Button type="button" variant="outline">
                Previous
              </Button>
            </Link>
            <Button
              onClick={onSubmit}
              disabled={
                isSubmitting ||
                isUploading ||
                (selectedOption === "upload" && !uploadedUrl)
              }
            >
              {isSubmitting ? "Saving..." : "Next"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
