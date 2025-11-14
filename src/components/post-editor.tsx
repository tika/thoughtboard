"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Text, TextArea } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
    },
  });
  const [placeholder, setPlaceholder] = useState<string>(placeholderChoices[0]);

  useEffect(() => {
    // Only set random placeholder on client after hydration
    setPlaceholder(
      placeholderChoices[Math.floor(Math.random() * placeholderChoices.length)],
    );
  }, []);

  function submitHandler(values: z.infer<typeof createPostSchema>) {
    // TODO: create API call to create post
    console.log(values);
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Flex direction="column" gap="3">
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TextArea placeholder={placeholder} rows={4} {...field} />
          )}
        />
        {errors.content && (
          <Text size="2" color="red">
            {errors.content.message}
          </Text>
        )}

        <Button type="submit">Post</Button>
      </Flex>
    </form>
  );
}
