import React from 'react';

import ConversationDetails from './active-conversation';
import ConversationContactDetail from './conversation-contact-detail';
import ConversationCompanyDetail from './conversation-company-detail';
import { getCompanies } from '@/lib/manage/read';
import { Combobox } from '@/components/ui/combobox';

type Props = {
	params: { id: string };
};

const headers = new Headers();
headers.set(
	'Authorization',
	'Basic ' + btoa(process.env.NEXT_PUBLIC_API_KEY_SID! + ':' + process.env.NEXT_PUBLIC_API_KEY_SECRET!)
);

const Page = async ({ params }: Props) => {
	// const companies = await getCompanies();
	const response = await fetch(
		`https://taskrouter.twilio.com/v1/Workspaces/${process.env.NEXT_PUBLIC_WORKSPACE_SID}/Tasks/${params.id}`,
		{ headers }
	);
	const task = await response.json();
	const attributes = JSON.parse(task.attributes);
	console.log(attributes);

	return (
		<main className='grid sm:grid-cols-[1fr_3fr_1fr] bg-muted grow'>
			<ConversationContactDetail />

			<ConversationDetails className='p-6' />

			<ConversationCompanyDetail id={attributes['companyId']} />

			{/* <Combobox
				placeholder='Filter companies...'
				items={companies?.map((c) => {
					return { label: c.name, value: `${c.identifier} ${c.name}` };
				})}
			/> */}
		</main>
	);
};

export default Page;
