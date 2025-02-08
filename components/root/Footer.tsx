import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-gray-900/30 backdrop-blur-md py-6">
      <div className="container mx-auto px-6">
        <Separator className="mb-6 bg-gray-700" />
        <p className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Legend4tech. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
