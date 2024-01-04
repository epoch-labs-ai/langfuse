import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/src/components/ui/button";
import * as z from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";

const formSchema = z.object({
  name: z.string(),
  datasetId: z.string(),
  datasetName: z.string(),
  evalModels: z.enum(["gpt-3.5-turbo-1106", "gpt-4-1106-preview", "gpt-4"]),
});

// API Response from /evals/start
interface ApiResponse {
  eval_id: string;
}

export const NewEvalRunDialog = (props: {
  projectId: string;
  datasetId?: string;
  datasetName?: string;
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
      datasetName: "",
      datasetId: "",
      evalModels: "gpt-3.5-turbo-1106",
    },
  });

  useEffect(() => {
    if (props.datasetId) {
      form.setValue("datasetId", props.datasetId);
    }
    if (props.datasetName) {
      form.setValue("datasetName", props.datasetName);
    }
  }, [props.datasetId, props.datasetName, form]);

  async function onSubmit() {
    try {
      // Prepare the data for the POST request
      const postData = {
        eval_name: form.getValues("name"),
        dataset_id: form.getValues("datasetId"),
        dataset_name: form.getValues("datasetName"),
        project_id: props.projectId,
        models: [form.getValues("evalModels")],
      };

      // Make the POST request
      const response = await fetch("/evals/start", {
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
      // Handle success - update state, show notification, etc.
      props.onOpenChange(false);
    } catch (error) {
      console.error("Submission error:", error);
      setFormError("Failed to submit data");
    }
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
                  name="datasetId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dataset ID</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="datasetName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dataset Name</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                    </FormItem>
                  )}
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
