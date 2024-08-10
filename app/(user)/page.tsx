import ConversationContactDetail from './conversations/[id]/conversation-contact-detail';
import ConversationDetails from './conversations/[id]/active-conversation';
import ConversationCompanyDetail from './conversations/[id]/conversation-company-detail';
import { getTask } from '@/lib/twilio/taskrouter/helpers';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getContactCommunications } from '@/lib/manage/read';

export default async function Page({
	searchParams,
}: {
	searchParams: {
		taskSid?: string;
		companyId?: string;
		contactId?: string;
	};
}) {
	const task: TaskInstance | undefined = searchParams.taskSid ? await getTask(searchParams.taskSid) : undefined;
	const attributes = task ? JSON.parse(task?.attributes) : {};
	const companyId = searchParams.companyId ? parseInt(searchParams.companyId) : undefined;
	const contactId = searchParams.contactId ? parseInt(searchParams.contactId) : undefined;
	const contactCommunications = await getContactCommunications(contactId ?? 0);

	return (
		<main className='grid grid-cols-[1fr_3fr_1fr] h-full w-full'>
			<Suspense fallback={<Skeleton className='h-full w-full' />}>
				<ConversationContactDetail
					companyId={companyId ?? 250}
					contactId={contactId ?? 10}
					attributes={attributes}
				/>
			</Suspense>

			<Suspense fallback={<Skeleton className='h-full w-full' />}>
				<ConversationDetails
					contactId={contactId ?? 10}
					communicationItems={contactCommunications}
					className='p-6'
				/>
			</Suspense>

			<ConversationCompanyDetail companyId={companyId ?? 250} />
		</main>
	);
}
