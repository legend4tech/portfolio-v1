import { getComments } from "@/app/actions/comments";
import { useQuery } from "@tanstack/react-query";

export function useComments() {
  return useQuery({
    queryKey: ["comments"],
    queryFn: getComments,
  });
}
