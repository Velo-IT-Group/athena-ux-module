import ConversationContactDetail from './conversation-contact-detail';
import ConversationDetails from './active-conversation';

export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const companyId = searchParams.companyId ? parseInt(searchParams.companyId as string) : undefined;
	const contactId = searchParams.contactId ? parseInt(searchParams.contactId as string) : undefined;

	return (
		<main className='grid h-full w-full p-6 gap-3'>
			{/* <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1> */}
			{/* <ConversationContactDetail contactId={contactId} /> */}

			<ConversationDetails
				contactId={contactId}
				companyId={companyId}
				// className='p-6'
			/>
		</main>
	);
}
