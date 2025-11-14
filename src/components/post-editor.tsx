"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Field, FieldError, FieldGroup } from "./ui/field";
import { Textarea } from "./ui/textarea";

const createPostFormSchema = z.object({
  content: z.string().min(1).max(255),
});

export function PostEditor() {
  const form = useForm<z.infer<typeof createPostFormSchema>>({
    resolver: zodResolver(createPostFormSchema),
    defaultValues: {
      content: "",
    },
  });

  function submitHandler(data: z.infer<typeof createPostFormSchema>) {
    // TODO: create API call to create post
    console.log(data);
  }

  return (
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
