import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/src/components/ui/button";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Label } from "@/src/components/ui/label";

const formSchema = z.object({
  name: z.string(),
  dataset: z.string(),
  evalModels: z.enum(["gpt-3.5-turbo-1106", "gpt-4-1106-preview", "gpt-4"]),
});

export const NewEvalRunDialog = (props: {
  projectId: string;
  datasetId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFormSuccess?: () => void;
}) => {
  const [formError, setFormError] = useState<string | null>(null);
  // Model options for evals
  const evalModels = [
    { label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo-1106" },
    { label: "GPT-4 Turbo", value: "gpt-4-1106-preview" },
    { label: "GPT-4", value: "gpt-4" },
    // { label: "Llama 2", value: "llama-2" },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dataset: "",
      evalModels: "gpt-3.5-turbo-1106",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    alert("Submitted MF!");
    console.log(values);
  }

  return (
    <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog.Trigger asChild>
        {/* Empty Trigger, as we're controlling the dialog programmatically */}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay-styles" />
        <Dialog.Content className="dialog-content-styles">
          <Dialog.Title className="mb-5 font-bold">Run Evaluation</Dialog.Title>
          <div>
            <Form {...form}>
              <form
                className="space-y-8"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Evaluation Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dataset"
                  render={({ field }) => {
                    console.log(field);
                    console.log(props.datasetId);
                    return (
                      <FormItem>
                        <FormLabel>Dataset ID</FormLabel>
                        <FormControl>
                          <Input {...field} value={props.datasetId} readOnly />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="evalModels"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <div>
                          {evalModels.map((type) => (
                            <label key={type.value} className="block">
                              <input
                                type="radio"
                                className="mr-2"
                                {...field}
                                value={type.value}
                                checked={field.value === type.value}
                              />
                              {type.label}
                            </label>
                          ))}
                        </div>
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
            {formError ? (
              <p className="text-red text-center">
                <span className="font-bold">Error:</span> {formError}
              </p>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
