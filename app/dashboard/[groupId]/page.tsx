import Dashboard from '@/components/dashboard/page';

interface GroupData {
  id: string;
  name: string;
  contribution_amount: number;
  contribution_frequency: string;
  number_of_members: number;
  payout_order: 'random' | 'fixed' | 'need';
  cycle_start_date: string;
  group_code: string;
}

interface MemberData {
  id: string;
  name: string;
  status: 'paid' | 'pending';
  isYou?: boolean;
}

export default async function DashboardPage({ 
  params 
}: { 
  params: Promise<{ groupId: string }> 
}) {
  // Await the params Promise to get the actual parameters
  const { groupId } = await params;
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  console.log(`Fetching group from: ${API_BASE}/api/groups/${groupId}`);

  const groupRes = await fetch(`${API_BASE}/api/groups/${groupId}`, {
    cache: 'no-store',
  });

  if (!groupRes.ok) {
    const errorText = await groupRes.text();
    console.error('Group fetch failed:', groupRes.status, errorText);
    throw new Error('Failed to fetch group data');
  }
  const group: GroupData = await groupRes.json();

  // const membersRes = await fetch(`${API_BASE}/api/groups/${groupId}/members`, {
  //   cache: 'no-store',
  // });

  // if (!membersRes.ok) {
  //   const errorText = await membersRes.text();
  //   console.error('Members fetch failed:', membersRes.status, errorText);
  //   throw new Error('Failed to fetch members');
  // }
  // const members: MemberData[] = await membersRes.json();

  return <Dashboard group={group} members={[]} />;
}