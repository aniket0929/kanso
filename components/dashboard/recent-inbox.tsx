import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface RecentInboxProps {
  conversations: any[];
}

export function RecentInbox({ conversations }: RecentInboxProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-md text-muted-foreground">
        No recent messages.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conversations.map((conv) => (
        <Link
          key={conv.id}
          href="/dashboard/inbox"
          className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition border border-transparent hover:border-border"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-md truncate">{conv.contact.name}</span>
              <span className="text-md text-muted-foreground">
                {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1 truncate">
              {conv.messages[0]?.content || "No messages yet"}
            </p>
          </div>
          {conv.unreadCount > 0 && (
            <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-md">
              {conv.unreadCount}
            </Badge>
          )}
        </Link>
      ))}
    </div>
  );
}
