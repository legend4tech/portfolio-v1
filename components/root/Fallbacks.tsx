import { AlertCircle, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20 flex items-center justify-center ">
      <Card className="glass-card  max-w-md ">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
            <AlertCircle className="text-yellow-500" />
            Project Details Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            Sorry, we couldn't find the project Details you're looking for.
          </p>
          <Button
            asChild
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto" />
        <p className="text-lg text-gray-400">Loading project details...</p>
      </div>
    </div>
  );
}
