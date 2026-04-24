import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ApplicationDetailClient from "./ApplicationDetailClient";

export default async function ApplicationDetailPage({
  params,
}: {
  params: { applicationId: string };
}) {
  const supabase = createClient();

  const { data: application } = await supabase
    .from("mentorship_applications")
    .select("*")
    .eq("id", params.applicationId)
    .single();

  if (!application) notFound();

  return <ApplicationDetailClient application={application} />;
}
