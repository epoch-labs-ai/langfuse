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
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    async function getVendorApiKeys() {
      // TODO remove when endpoint ready
      const mockBackend = true;

      setIsLoading(false);
      setApiError(null);

      try {
        let result;
        if (mockBackend) {
          // Simulate a delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Mocked response
          result = {
            openai: {
              id: "some_id",
              api_key: "mocked-api-key",
              added_at: new Date(),
            },
          };
        } else {
          console.log("Requesting vendorApiKeys");
          const response = await fetch("/vendorApiKeys", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // TODO Authorization header needed?
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error. Status: ${response.status}`);
          }

          // TODO parse added_at as a Date object
          result = (await response.json()) as ApiResponse;
        }

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
