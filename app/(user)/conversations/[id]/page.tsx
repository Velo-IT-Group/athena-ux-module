import ConversationDetails from './active-conversation';
import ConversationContactDetail from './conversation-contact-detail';
import ConversationCompanyDetail from './conversation-company-detail';

import { getTask } from '@/lib/twilio/taskrouter/helpers';

type Props = {
	params: { id: string };
};

const Page = async ({ params }: Props) => {
	const task = await getTask(params.id);
	const attributes = JSON.parse(task.attributes);

	return (
		<main className='grid sm:grid-cols-[1fr_3fr_1fr] bg-muted/50 grow'>
			<ConversationContactDetail
				companyId={attributes.companyId}
				contactId={attributes.userId}
				attributes={attributes}
			/>

			<ConversationDetails
				userId={attributes.userId}
				className='p-6'
			/>

			<ConversationCompanyDetail id={attributes.companyId} />
		</main>
	);
};

export default Page;
