"use client";

import { MessageSquare, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      <div className="comments-container space-y-4">
        {/* <div className="text-center space-y-2">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto" />
          <h3 className="text-xl font-bold text-purple-400">Loading Comments</h3>
          <p className="text-gray-400">Fetching the latest conversations...</p>
        </div> */}
        {[...Array(3)].map((_, index) => (
          <CommentSkeleton key={index} />
        ))}
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
          <Card key={comment.id} className="glass-card ">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-800 shadow-md">
                <Avatar className="flex-shrink-0">
                  <AvatarImage src={comment.fileUrl} alt={comment.name} />
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
                  <p className="text-gray-300 break-all whitespace-pre-wrap text-lg">
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

// Loading skeleton component
const CommentSkeleton = () => (
  <div className="comment-card glass-card mb-4 overflow-hidden animate-pulse">
    <div className="comment-header flex items-center justify-between p-4 bg-gray-700/30">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-600 rounded-full" />
        <div className="h-4 bg-gray-600 rounded w-24" />
      </div>
      <div className="h-3 bg-gray-600 rounded w-16" />
    </div>
    <div className="comment-body p-4 bg-gray-800/30">
      <div className="space-y-2">
        <div className="h-3 bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-700 rounded w-5/6" />
      </div>
    </div>
  </div>
);

export default AllComments;
