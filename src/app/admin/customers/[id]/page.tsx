import CustomerDetailPage from 'components/admin/customers/CustomerDetailPage';
 
export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CustomerDetailPage customerId={Number(id)} />;
} 