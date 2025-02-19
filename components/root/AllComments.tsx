"use client";

import { LoaderCircle, MessageSquare, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useComments } from "@/hooks/useComments";
import RelativeTime from "@/components/RelativeTime";
import { Button } from "@/components/ui/button";

function AllComments() {
  const { data: comments, isPending, isError, refetch } = useComments();
  console.log("comment", comments);
  // Loading state
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <LoaderCircle className="w-12 h-12 text-purple-500 animate-spin" />
        <p className="text-gray-400">Loading Comments...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <p className="text-red-400">Oops! Something went wrong.</p>
        <p className="text-gray-400">Failed to load comments</p>
        <Button
          onClick={() => refetch()}
          className="bg-purple-500 hover:bg-purple-600 text-white"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // No comments state
  if (!comments || comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <MessageSquare className="w-12 h-12 text-gray-500" />
        <p className="text-gray-400">
          No comments yet. Be the first to comment!
        </p>
      </div>
    );
  }

  // Render comments
  return (
    <div className="h-[400px] overflow-y-auto comments-scroll">
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-800 shadow-md">
                <Avatar className="flex-shrink-0">
                  {/* <AvatarImage src={comment.avatar} alt={comment.name} /> */}
                  <AvatarFallback>
                    {comment.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  {" "}
                  {/* min-w-0 allows flex child to shrink below its content size */}
                  <div className="flex justify-between items-center mb-2 flex-wrap">
                    <h4 className="font-semibold text-white text-sm truncate mr-2">
                      {comment.name}
                    </h4>
                    <RelativeTime
                      isoString={comment.time_posted}
                      // className="text-xs text-gray-400 flex-shrink-0"
                    />
                  </div>
                  <p className="text-gray-300 break-words whitespace-pre-wrap text-lg">
                    {comment.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AllComments;
