import Loading from "@/components/root/Fallbacks";
import ProjectDetailsPage from "@/components/root/ProjectDetails";
import { Suspense } from "react";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log(id);
  return (
    <Suspense fallback={<Loading />}>
      <ProjectDetailsPage id={id} />
    </Suspense>
  );
}

export default Page;
