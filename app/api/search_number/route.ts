'use server';
import { getCompanies, getCompany, getContacts } from '@/lib/manage/read';
import { type NextRequest } from 'next/server';
import { Twilio } from 'twilio';

const client = new Twilio(process.env.NEXT_PUBLIC_TWILIO_API_KEY_SID, process.env.NEXT_PUBLIC_TWILIO_API_KEY_SECRET, {
	accountSid: process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
});

export async function POST(request: NextRequest) {
	const formData = await request.formData();
	const from = formData.get('from') as string;
	console.log(from);
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

	const firstContact = contacts[0];

	if (contacts.length > 1) {
		// Check to see if every contact has the same first name, last name, and a different company
		// This tells the system that this user has multiple contacts with multiple companies
		// If that's the case then return just the users name
		if (
			contacts.every(
				(contact) =>
					contact.firstName === firstContact.firstName &&
					contact.lastName === firstContact.lastName &&
					contact.company?.id === firstContact.company?.id
			)
		) {
			return Response.json(
				{
					user: firstContact,
				},
				{ status: 200 }
			);
		}

		// This tells the system that this phone number has multiple contacts with the same number
		// If that's the case then return just the company
		if (contacts.every((contact) => contact.company?.id === firstContact.company?.id)) {
			const company = await getCompany(firstContact.company?.id!, { fields: ['id', 'name', 'territory'] });
			return Response.json(
				{
					company,
					territoryName: company?.territory?.name.split(' ').join('') ?? 'TeamA',
				},
				{ status: 200 }
			);
		}

		return {
			territoryName: 'TeamA',
		};
	}

	const user = firstContact;

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
