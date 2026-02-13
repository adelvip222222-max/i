import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import MessagesManager from '@/components/admin/MessagesManager';
import { Message, Site } from '@/models';

export const runtime = 'nodejs';

async function getUserMessages(userId: string) {
  try {
    await connectDB();
    
    // Get user's site
    const site = await Site.findOne({ userId });
    
    if (!site) {
      return [];
    }
    
    // Get only messages for this site
    const messages = await Message.find({ siteId: site._id })
      .sort({ createdAt: -1 })
      .lean();
    
    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export default async function AdminMessagesPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/admin-login');
  }

  const messages = await getUserMessages(session.user.id);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">الرسائل</h1>
        <p className="text-gray-600">
          إجمالي الرسائل: {messages.length}
        </p>
      </div>

      <MessagesManager initialMessages={messages} />
    </div>
  );
}
