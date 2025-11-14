"use client";

import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import type { Remark } from "@/db/schema";
import { client } from "@/lib/orpc";
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
import { Textarea } from "./ui/textarea";

interface CreateReflectionModalProps {
  remark: Remark;
}

const createReflectionFormSchema = z.object({
  content: z.string().min(140),
});

export function CreateReflectionModal({ remark }: CreateReflectionModalProps) {
  const { user } = useUser();
  const form = useForm<z.infer<typeof createReflectionFormSchema>>({
    resolver: zodResolver(createReflectionFormSchema),
    defaultValues: {
      content: "",
    },
  });

  async function submitHandler(
    data: z.infer<typeof createReflectionFormSchema>,
  ) {
    console.log(data);
    if (!user?.id) return;

    console.log(remark);

    const newReflection = client.reflection.create({
      content: data.content,
      remarkId: remark.id,
      userId: user.id,
    });

    toast.promise(newReflection, {
      loading: "Creating reflection...",
      success: (data) => `Reflection created successfully: ${data.content}`,
      error: "Failed to create reflection",
    });

    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Reflection</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create Reflection</DialogTitle>
        <Card>
          <CardContent>
            <p>{remark.content}</p>
          </CardContent>
        </Card>
        <form onSubmit={form.handleSubmit(submitHandler)} id="post-editor-form">
          <FieldGroup>
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Textarea
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Write something..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create Reflection</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
