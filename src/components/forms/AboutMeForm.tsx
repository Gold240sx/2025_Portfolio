"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const aboutMeFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
});

type AboutMeFormValues = z.infer<typeof aboutMeFormSchema>;

export function AboutMeForm({ defaultTitle = "" }) {
  const { toast } = useToast();
  const utils = api.useUtils();

  const form = useForm<AboutMeFormValues>({
    resolver: zodResolver(aboutMeFormSchema),
    defaultValues: {
      title: defaultTitle,
    },
  });

  const { mutate: updateTitle, isPending } =
    api.siteContent.updateAboutMeTitle.useMutation({
      onSuccess: () => {
        toast({
          title: "Title updated successfully!",
        });
        utils.siteContent.getAboutMeTitle.invalidate();
      },
      onError: (error) => {
        toast({
          title: "Error updating title",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  function onSubmit(data: AboutMeFormValues) {
    updateTitle({ title: data.title });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Me Page</FormLabel>
              <FormControl>
                <Input placeholder="Enter title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Title"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
