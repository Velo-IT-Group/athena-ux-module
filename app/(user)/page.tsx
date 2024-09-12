import ConversationContactDetail from './conversation-contact-detail';
import ConversationDetails from './active-conversation';
import { getTask } from '@/lib/twilio/taskrouter/helpers';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { getContactCommunications } from '@/lib/manage/read';
import { createClient } from '@/utils/supabase/server';

export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const task: TaskInstance | undefined = searchParams.taskSid
		? await getTask(searchParams.taskSid as string)
		: undefined;
	const attributes = task ? JSON.parse(task?.attributes) : {};
	const companyId = searchParams.companyId ? parseInt(searchParams.companyId as string) : undefined;
	const contactId = searchParams.contactId ? parseInt(searchParams.contactId as string) : undefined;
	const contactCommunications = await getContactCommunications(contactId ?? user?.user_metadata?.contactId ?? 0);

	return (
		<main className='grid grid-cols-[1fr_3fr] h-full w-full'>
			<ConversationContactDetail
				companyId={companyId ?? 250}
				contactId={contactId ?? user?.user_metadata?.contactId ?? 10}
				attributes={attributes}
			/>

			<ConversationDetails
				contactId={contactId ?? user?.user_metadata?.contactId ?? 10}
				companyId={companyId ?? 250}
				communicationItems={contactCommunications}
				className='p-6'
				searchParams={searchParams}
			/>
		</main>
	);
}
