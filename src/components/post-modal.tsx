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

export function PostModal() {
  const { user } = useUser();
  const form = useForm<z.infer<typeof createPostFormSchema>>({
    resolver: zodResolver(createPostFormSchema),
    defaultValues: {
      content: "",
    },
  });

  async function submitHandler(data: z.infer<typeof createPostFormSchema>) {
    if (!user?.id) return;

    // TODO: create API call to create post
    console.log(data);
    const newRemark = await client.remark.create({
      content: data.content,
      userId: user.id,
    });

    console.log(newRemark);

    form.reset();

    toast.success("Remark created successfully");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Post</Button>
      </DialogTrigger>
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
