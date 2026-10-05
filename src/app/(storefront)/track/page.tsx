import { redirect } from 'next/navigation';

export default async function TrackRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolved = await searchParams;
  const orderId = resolved.orderId || resolved.order || resolved.id;
  if (orderId && typeof orderId === 'string') {
    redirect(`/track-order?orderId=${encodeURIComponent(orderId)}`);
  }
  redirect('/track-order');
}
