import Avatar from "boring-avatars";
import { NotebookPenIcon, PencilIcon } from "lucide-react";
import { CreateReflectionModal } from "@/components/create-reflection-modal";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Remark } from "@/db/schema";
import { formatRemarkTimestamp } from "@/lib/utils";

export function DisplayRemark({
  remark,
  reflectionId,
}: {
  remark: Remark;
  reflectionId: string | null;
}) {
  return (
    <div className="flex gap-2">
      <Avatar name={remark.userId} />

      <div className="flex flex-col items-start">
        <p>{remark.content}</p>
        <div>
          <Tooltip delayDuration={500}>
            <TooltipTrigger>
              <p className="text-muted-foreground">
                {formatRemarkTimestamp(remark.createdTs, remark.updatedTs)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{remark.updatedTs.toLocaleString()}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <CreateReflectionModal
        remark={remark}
        trigger={
          <Button variant="ghost" size="icon" disabled={reflectionId !== null}>
            <NotebookPenIcon />
          </Button>
        }
      />
    </div>
  );
}
