import { Card } from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
//import { TrashIcon } from "lucide-react";
import { CreateOpenAiKeyButton } from "@/src/features/vendor-api/components/CreateOpenAiKeyButton";

interface openAiKey {
  id: string;
  api_key: string;
  added_at: Date;
}

export function OpenAiKeyList(props: {
  projectId: string;
  openAiKey?: openAiKey;
}) {
  return (
    <div className="ml-5">
      <h3 className="mb-5 text-base font-medium leading-6 text-gray-900">
        OpenAI
      </h3>
      <Card className="mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden text-gray-900 md:table-cell">
                Added
              </TableHead>
              <TableHead className="text-gray-900 md:table-cell">Key</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-gray-500">
            {props.openAiKey ? (
              <TableRow
                key={props.openAiKey.id}
                className="hover:bg-transparent"
              >
                <TableCell className="hidden md:table-cell">
                  {props.openAiKey.added_at.toLocaleDateString()}
                </TableCell>
                <TableCell>{props.openAiKey.api_key}</TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
      <CreateOpenAiKeyButton
        projectId={props.projectId}
        disabled={!!props.openAiKey}
      />
    </div>
  );
}
