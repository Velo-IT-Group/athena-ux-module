import ConversationContactDetail from './conversations/[id]/conversation-contact-detail';
import ConversationDetails from './conversations/[id]/active-conversation';
import ConversationCompanyDetail from './conversations/[id]/conversation-company-detail';
import { getTask } from '@/lib/twilio/taskrouter/helpers';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getContactCommunications } from '@/lib/manage/read';
import { auth } from '@/auth';

export default async function Page({
	searchParams,
}: {
	searchParams: {
		taskSid?: string;
		companyId?: string;
		contactId?: string;
	};
}) {
	const session = await auth();
	const task: TaskInstance | undefined = searchParams.taskSid ? await getTask(searchParams.taskSid) : undefined;
	const attributes = task ? JSON.parse(task?.attributes) : {};
	const companyId = searchParams.companyId ? parseInt(searchParams.companyId) : undefined;
	const contactId = searchParams.contactId ? parseInt(searchParams.contactId) : undefined;
	const contactCommunications = await getContactCommunications(contactId ?? session?.user?.contactId ?? 0);

	console.log(session?.user.contactId);

	console.log(session?.user.referenceId);

	return (
		<main className='grid grid-cols-[1fr_3fr] h-full w-full'>
			{/* <Suspense fallback={<Skeleton className='h-full w-full' />}>
			</Suspense> */}
			<ConversationContactDetail
				companyId={companyId ?? 250}
				contactId={contactId ?? session?.user?.contactId ?? 10}
				attributes={attributes}
			/>

			<ConversationDetails
				contactId={contactId ?? session?.user?.contactId ?? 10}
				companyId={companyId ?? 250}
				communicationItems={contactCommunications}
				className='p-6'
			/>

			{/* <ConversationCompanyDetail companyId={companyId ?? 250} /> */}
		</main>
	);
}
