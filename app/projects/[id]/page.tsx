import Loading from "@/components/root/Fallbacks";
import ProjectDetailsPage from "@/components/root/ProjectDetails";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Project Details",
};

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <ProjectDetailsPage id={id} />
    </Suspense>
  );
}

export default Page;
