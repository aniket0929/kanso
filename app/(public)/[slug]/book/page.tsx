import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { BookingWidget } from "@/components/public/booking-widget";

export default async function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const workspace = await db.workspace.findUnique({
    where: { slug },
    include: { services: { where: { isActive: true } } }
  });

  if (!workspace) return notFound();

  return (
    <div className="space-y-12 py-12 selection:bg-black selection:text-white">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold font-serif tracking-tight">{workspace.name}</h1>
        <p className="text-muted-foreground italic font-medium">Service Business</p>
      </div>
      <BookingWidget workspace={workspace} services={workspace.services} />
    </div>
  );
}
