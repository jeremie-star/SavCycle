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
  full_name: string;
  status: 'paid' | 'pending';
  joinedDate?: string;
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
  // Fetch group data
  const groupRes = await fetch(`${API_BASE}/api/groups/${groupId}`, {
    cache: 'no-store',
  });

  if (!groupRes.ok) {
    const errorText = await groupRes.text();
    console.error('Group fetch failed:', groupRes.status, errorText);
    throw new Error('Failed to fetch group data');
  }
  const group: GroupData = await groupRes.json();

  // Fetch members data
  let members: MemberData[] = [];
  
  try {
    console.log(`Fetching members from: ${API_BASE}/api/members/group/${groupId}`);
    
    const membersRes = await fetch(`${API_BASE}/api/members/group/${groupId}`, {
      cache: 'no-store',
    });

    if (membersRes.ok) {
      members = await membersRes.json();
      console.log(`Found ${members.length} members for group ${groupId}:`, members);
    } else {
      const errorText = await membersRes.text();
      console.error('Members fetch failed:', membersRes.status, errorText);
      // Don't throw error, just use empty array
    }
  } catch (error) {
    console.error('Error fetching members:', error);
    // Continue with empty members array
  }

  return <Dashboard group={group} members={members} />;
}