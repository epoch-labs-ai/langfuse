import { Button } from "@/src/components/ui/button";
import { PlusIcon } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ApiResponse {
  success: boolean;
}

const formSchema = z.object({
  // TODO Add custom validation
  apiKey: z.string().min(1),
});

export function CreateOpenAiKeyButton(props: {
  projectId: string;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
    },
  });

  async function onSubmit() {
    console.log("onSubmit triggered");

    try {
      const postData = {
        project_id: props.projectId,
        openai_key: form.getValues("apiKey"),
      };

      // Make the request
      const response = await fetch("/vendorApiKeys/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = (await response.json()) as ApiResponse;
      console.log(result);
      // Propagate the change out to the parent component or prompt to run the api key retrieval
      setOpen(false);
    } catch (error) {
      console.error("Submission error:", error);
      setFormError("Failed to save key");
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="secondary" disabled={props.disabled}>
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Add OpenAI Key
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay-styles" />
        <Dialog.Content className="dialog-content-styles">
          <Dialog.Title className="mb-5 font-bold">Add OpenAI Key</Dialog.Title>
          <div>
            <Form {...form}>
              <form
                className="space-y-8"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-4">
                  <Button type="submit" className="primary">
                    Submit
                  </Button>
                  <Dialog.Close asChild>
                    <Button className="rounded border border-gray-400 bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">
                      Cancel
                    </Button>
                  </Dialog.Close>
                </div>
              </form>
            </Form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
    // <div>
    // </div>
  );
}
