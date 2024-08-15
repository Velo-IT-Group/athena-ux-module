import { getCompanies, getCompany, getContacts } from '@/lib/manage/read';
import { type NextRequest } from 'next/server';
import { Twilio } from 'twilio';

const client = new Twilio(process.env.NEXT_PUBLIC_TWILIO_API_KEY_SID, process.env.NEXT_PUBLIC_TWILIO_API_KEY_SECRET, {
	accountSid: process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
});

export const dynamic = 'force-static';

export async function POST(request: NextRequest) {
	const { from } = await request.json();
	const { nationalFormat } = await client.lookups.v2.phoneNumbers(from).fetch();

	if (!nationalFormat)
		return Response.json(
			{
				error: 'No phone number found',
			},
			{ status: 400, statusText: 'No phone number found' }
		);

	let phoneNumber = nationalFormat.replace(/\D/g, '');
	phoneNumber = phoneNumber.replace(/\(|\)/g, '');

	if (!phoneNumber)
		return Response.json(
			{
				error: 'No phone number detected',
			},
			{ status: 400, statusText: 'No phone number detected' }
		);

	const [contacts, { companies }] = await Promise.all([
		getContacts({
			childConditions: [{ parameter: { 'communicationItems/value': `'${phoneNumber}'` }, comparator: 'contains' }],
			fields: ['id', 'firstName', 'lastName', 'company'],
		}),
		getCompanies({
			conditions: [{ parameter: { phoneNumber: `'${phoneNumber}'` }, comparator: 'contains' }],
			fields: ['id', 'identifier', 'name', 'status', 'phoneNumber', 'territory'],
		}),
	]);

	const user = contacts[0] ?? undefined;
	const company =
		user && user.company
			? await getCompany(user.company.id!, { fields: ['id', 'name', 'territory'] })
			: companies[0] ?? undefined;

	let territoryName =
		company?.territory && company?.territory?.name ? company?.territory?.name.split(' ').join('') : 'TeamA';

	return Response.json(
		{
			user,
			company,
			territoryName,
		},
		{ status: 200 }
	);
}
