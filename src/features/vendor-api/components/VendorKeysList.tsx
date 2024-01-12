import { useState, useEffect } from "react";
import { OpenAiKeyList } from "@/src/features/vendor-api/components/OpenAiKeyList";

export function VendorKeysList(props: { projectId: string }) {
  // Expected API Response structure
  interface OpenAiKey {
    id: string;
    api_key: string;
    added_at: Date;
  }
  interface ApiResponse {
    openai?: OpenAiKey;
  }

  const [openAiKey, setOpenAiKey] = useState<OpenAiKey | undefined>(undefined);
  const [, setIsLoading] = useState(false);
  const [, setApiError] = useState<string | null>(null);

  useEffect(() => {
    async function getVendorApiKeys() {
      setIsLoading(false);
      setApiError(null);

      try {
        console.log("Requesting vendorApiKeys");
        const response = await fetch("/vendorApiKeys", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error. Status: ${response.status}`);
        }

        // TODO parse added_at as a Date object
        const result = (await response.json()) as ApiResponse;

        console.log(result);
        // TODO do something on success
        // TODO handle case of no key
        setOpenAiKey(result.openai);
      } catch (error) {
        console.error("Failed to retrieve vendor keys", error);
        setApiError("Failed to get vendor API keys");
        // TODO do something if needed in the error case
      } finally {
        setIsLoading(false);
      }
    }

    void getVendorApiKeys();
  }, [props.projectId]);

  // const vendorApiKeys = getVendorApiKeys();

  return (
    <div>
      <h2 className="mb-5 text-base font-semibold leading-6 text-gray-900">
        Vendor API Keys
      </h2>
      <OpenAiKeyList projectId={props.projectId} openAiKey={openAiKey} />
    </div>
  );
}
