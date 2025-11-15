"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { client } from "@/lib/orpc";

const handleFormSchema = z.object({
  handle: z
    .string()
    .min(3, "Handle must be at least 3 characters")
    .max(50, "Handle must be at most 50 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Handle can only contain lowercase letters, numbers, and underscores",
    ),
});

type HandleFormData = z.infer<typeof handleFormSchema>;

export function HandleForm({
  userId,
  currentHandle,
}: {
  userId: string;
  currentHandle: string | null;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const form = useForm<HandleFormData>({
    resolver: zodResolver(handleFormSchema),
    defaultValues: {
      handle: currentHandle || "",
    },
  });

  const handleValue = form.watch("handle");

  // Debounced availability check
  useEffect(() => {
    // Clear previous availability state
    setIsAvailable(null);
    form.clearErrors("handle");

    if (!handleValue || handleValue.length < 3) {
      return;
    }

    // Basic format validation first
    if (!/^[a-z0-9_]+$/.test(handleValue)) {
      return;
    }

    setIsChecking(true);
    const timeout = setTimeout(async () => {
      try {
        // If handle hasn't changed, consider it available
        if (handleValue === currentHandle) {
          setIsAvailable(true);
          setIsChecking(false);
          return;
        }

        const available = await client.profile.checkHandleAvailability({
          handle: handleValue,
          excludeUserId: userId,
        });
        setIsAvailable(available);
        if (!available) {
          form.setError("handle", {
            type: "manual",
            message: "This handle is already taken",
          });
        }
      } catch (error) {
        console.error("Error checking handle availability:", error);
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [handleValue, form, currentHandle, userId]);

  const onSubmit = async (data: HandleFormData) => {
    // Skip if handle hasn't changed
    if (data.handle === currentHandle) {
      router.push("/onboarding/avatar");
      router.refresh();
      return;
    }

    // Final availability check before submitting
    try {
      const available = await client.profile.checkHandleAvailability({
        handle: data.handle,
        excludeUserId: userId,
      });
      if (!available) {
        form.setError("handle", {
          type: "manual",
          message: "This handle is already taken",
        });
        return;
      }

      await client.profile.updateHandle({
        handle: data.handle,
        clerkId: userId,
      });
      router.push("/onboarding/avatar");
      router.refresh();
    } catch (error) {
      console.error("Error updating handle:", error);
      form.setError("handle", {
        type: "manual",
        message: "Failed to update handle. Please try again.",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Choose Your Handle</CardTitle>
        <CardDescription>
          Your handle is how others will identify you on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="handle"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Handle</FieldLabel>
                  <FieldContent>
                    <div className="relative">
                      <input
                        {...field}
                        type="text"
                        className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        placeholder="your_handle"
                        aria-invalid={fieldState.invalid}
                      />
                      {isChecking && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          Checking...
                        </span>
                      )}
                    </div>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    {!fieldState.error &&
                      handleValue &&
                      handleValue.length >= 3 &&
                      !isChecking &&
                      isAvailable === true && (
                        <p className="text-sm text-green-400">Available</p>
                      )}
                  </FieldContent>
                </Field>
              )}
            />
          </FieldGroup>
          <div className="mt-6 flex justify-between">
            <Link href="/onboarding/welcome">
              <Button type="button" variant="outline">
                Previous
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={
                form.formState.isSubmitting ||
                isChecking ||
                isAvailable === false ||
                !handleValue ||
                handleValue.length < 3
              }
            >
              {form.formState.isSubmitting ? "Saving..." : "Next"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
