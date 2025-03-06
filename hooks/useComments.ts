import { getComments } from "@/app/actions/comments";
import { CommentTypes } from "@/types/commentTypes";
import { useQuery } from "@tanstack/react-query";

export function useComments() {
  return useQuery<CommentTypes[]>({
    queryKey: ["comments"],
    queryFn: getComments,
  });
}
