import ConversationContactDetail from './conversation-contact-detail';
import ConversationDetails from './active-conversation';
import { getTask } from '@/lib/twilio/taskrouter/helpers';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { getContactCommunications } from '@/lib/manage/read';
import { createClient } from '@/utils/supabase/server';

export default async function Page({
	searchParams,
}: {
	searchParams: {
		taskSid?: string;
		companyId?: string;
		contactId?: string;
	};
}) {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const task: TaskInstance | undefined = searchParams.taskSid ? await getTask(searchParams.taskSid) : undefined;
	const attributes = task ? JSON.parse(task?.attributes) : {};
	const companyId = searchParams.companyId ? parseInt(searchParams.companyId) : undefined;
	const contactId = searchParams.contactId ? parseInt(searchParams.contactId) : undefined;
	const contactCommunications = await getContactCommunications(contactId ?? user?.user_metadata?.contactId ?? 0);

	return (
		<main className='grid grid-cols-[1fr_3fr] h-full w-full'>
			<ConversationContactDetail
				companyId={companyId ?? 250}
				contactId={contactId ?? session?.user?.user_metadata?.contactId ?? 10}
				attributes={attributes}
			/>

			<ConversationDetails
				contactId={contactId ?? session?.user?.user_metadata?.contactId ?? 10}
				companyId={companyId ?? 250}
				communicationItems={contactCommunications}
				className='p-6'
			/>
		</main>
	);
}
