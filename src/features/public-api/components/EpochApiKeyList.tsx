import { Card } from "@/src/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
} from "@/src/components/ui/table";
import { CreateEpochApiKeyButton } from "@/src/features/public-api/components/CreateEpochApiKeyButton";
import { TableBody } from "@tremor/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function EpochApiKeyList(props: { projectId: string }) {
  interface EpochApiKey {
    created: Date;
    api_key: string;
  }

  const [, setEpochApiKey] = useState<EpochApiKey | null>(null);

  async function getEpochApiKeys() {
    try {
      console.log("Requesting Epoch API Keys");
      const response = await fetch(`/apiKeys?project_id=${props.projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // TODO auth header
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error. Status ${response.status}`);
      }

      const result = (await response.json()) as EpochApiKey;
      setEpochApiKey(result);
    } catch (error) {
      console.error("Failed to retrieve Epoch API keys", error);
    }
  }

  void getEpochApiKeys();

  return (
    <div>
      <h2 className="mb-5 text-base font-semibold leading-6 text-gray-900">
        Epoch API Keys
      </h2>
      <Card className="mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden text-gray-900 md:table-cell">
                Created
              </TableHead>
              <TableHead className="text-gray-900">Key</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-gray-500">
            <TableRow></TableRow>
          </TableBody>
        </Table>
      </Card>
      <div>{JSON.stringify(useSession())}</div>
      <CreateEpochApiKeyButton projectId={props.projectId} />
    </div>
  );
}
