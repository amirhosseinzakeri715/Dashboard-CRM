import UserDetailPage from "components/admin/user/UserDetailPage";

export default async function UserPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;
  return <UserDetailPage id={id} />;
} 