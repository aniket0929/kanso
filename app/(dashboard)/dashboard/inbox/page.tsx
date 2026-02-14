import { getConversations } from "@/lib/actions/inbox.actions";
import { InboxClient } from "@/components/inbox/inbox-client";

export default async function InboxPage() {
  const conversations = await getConversations();

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row border rounded-xl overflow-hidden bg-card">
        <InboxClient initialConversations={conversations} />
    </div>
  );
}
