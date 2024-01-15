import { Card } from "@/src/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
} from "@/src/components/ui/table";
import { CreateEpochApiKeyButton } from "@/src/features/public-api/components/CreateEpochApiKeyButton";
import { TableBody, TableCell } from "@tremor/react";
import { useEffect, useState } from "react";

export function EpochApiKeyList(props: { projectId: string }) {
  interface EpochApiKey {
    api_key: string;
  }

  const [epochApiKey, setEpochApiKey] = useState<EpochApiKey | null>(null);

  useEffect(() => {
    async function getEpochApiKeys(): Promise<void> {
      try {
        console.log("Requesting Epoch API Keys");
        const response = await fetch(`/apiKeys?project_id=${props.projectId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error. Status ${response.status}`);
        }

        const result = (await response.json()) as EpochApiKey;
        // Assumes only a single key for now
        setEpochApiKey(result);
      } catch (error) {
        console.error("Failed to retrieve Epoch API keys", error);
      }
    }

    void getEpochApiKeys();
  }, [props.projectId]);

  return (
    <div>
      <h2 className="mb-5 text-base font-semibold leading-6 text-gray-900">
        Epoch API Keys
      </h2>
      <Card className="mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-900">Key</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-gray-500">
            {epochApiKey ? (
              <TableRow key="random" className="hover:bg-transparent">
                <TableCell>{epochApiKey.api_key}</TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
      <CreateEpochApiKeyButton projectId={props.projectId} />
    </div>
  );
}
