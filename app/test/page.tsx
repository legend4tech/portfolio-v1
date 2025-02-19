// app/test.js (or any server component)
import { getComments } from "@/app/actions/comments";

export default async function Test() {
  const comments = await getComments();
  console.log(comments);
  return <div>Test</div>;
}
