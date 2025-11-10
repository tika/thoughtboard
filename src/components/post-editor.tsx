"use client";

import { Text, TextArea, TextField } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const createPostSchema = z.object({
  content: z.string().min(1).max(255),
});

const placeholderChoices = [
  "What's on your mind?",
  "I'm feeling grateful for...",
  "TIL: ",
  "It's seriously underrated...",
];

export function PostEditor() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof createPostSchema>>();
  const [placeholder, setPlaceholder] = useState<string>(placeholderChoices[0]);

  useEffect(() => {
    // Only set random placeholder on client after hydration
    setPlaceholder(
      placeholderChoices[Math.floor(Math.random() * placeholderChoices.length)],
    );
  }, []);

  function submitHandler(values: z.infer<typeof createPostSchema>) {
    // TODO: create API call to create post
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <TextArea placeholder={placeholder} {...register("content")} />
      {errors.content && (
        <Text size="2" color="red">
          {errors.content.message}
        </Text>
      )}

      <input type="submit" />
    </form>
  );
}
