import Avatar from "boring-avatars";
import { ArrowUpRightIcon, NotebookPenIcon } from "lucide-react";
import Link from "next/link";
import { CreateReflectionModal } from "@/components/create-reflection-modal";
import { Button, buttonVariants } from "@/components/ui/button";
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
  remark: Remark & { profile: { handle: string } };
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
      {reflectionId === null ? (
        <CreateReflectionModal
          remark={remark}
          trigger={
            <Button
              variant="ghost"
              size="icon"
              disabled={reflectionId !== null}
            >
              <NotebookPenIcon />
            </Button>
          }
        />
      ) : (
        <Link
          href={`/${remark.profile.handle}/${reflectionId}`}
          className={buttonVariants({ variant: "ghost", size: "icon" })}
        >
          <ArrowUpRightIcon />
        </Link>
      )}
    </div>
  );
}
