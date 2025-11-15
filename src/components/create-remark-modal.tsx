"use client";

import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { client } from "@/lib/orpc";
import { remarkSchema } from "@/lib/utils";
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

const createPostFormSchema = z.object({
  content: remarkSchema,
});

interface PostModalProps {
  trigger?: React.ReactNode;
}

export function PostModal({ trigger }: PostModalProps = {}) {
  const { user } = useUser();
  const form = useForm<z.infer<typeof createPostFormSchema>>({
    resolver: zodResolver(createPostFormSchema),
    defaultValues: {
      content: "",
    },
  });

  async function submitHandler(data: z.infer<typeof createPostFormSchema>) {
    if (!user?.id) return;

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
  }

  return (
    <Dialog>
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
            <Button type="submit" form="post-editor-form">
              Post Remark
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
