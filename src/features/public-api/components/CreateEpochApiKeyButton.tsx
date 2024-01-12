import { Button } from "@/src/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusIcon } from "lucide-react";
// import { useSession } from "next-auth/react";
import { useState } from "react";

// interface ApiResponse {
//   success: boolean;
// }

export function CreateEpochApiKeyButton(props: { projectId: string }) {
  const [open, setOpen] = useState(false);

  async function createEpochApiKey() {
    console.log("onSubmit triggered");

    try {
      const postData = {
        project_id: props.projectId,
      };

      const response = await fetch("/apiKeys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // const result = (await response.json()) as ApiResponse;
      setOpen(false);
    } catch (error) {
      console.log("Submission error:", error);
    }
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <Dialog.Root open={open} onOpenChange={createEpochApiKey}>
      <Dialog.Trigger asChild>
        <Button variant="secondary">
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Create Epoch API Key
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay-styles" />
        <Dialog.Content className="dialog-content-styles">
          <Dialog.Title className="mb-5 font-bold">Create API Key</Dialog.Title>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
