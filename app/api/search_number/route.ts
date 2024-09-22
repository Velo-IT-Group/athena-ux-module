'use server';
import { getCompanies, getCompany, getContacts } from '@/lib/manage/read';
import { createClient } from '@/utils/twilio';
import { type NextRequest } from 'next/server';

type ReturnType = {
	userId?: number;
	companyId?: number;
	name: string;
	territoryName: string;
};

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const from = searchParams.get('from');

	if (!from) {
		return Response.json(
			{
				error: 'No phone number found',
			},
			{ status: 400, statusText: 'No phone number found' }
		);
	}

	const client = await createClient();
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

	const [contacts, { data: companies }] = await Promise.all([
		getContacts({
			childConditions: { 'communicationItems/value': `'${phoneNumber}'` },
			fields: ['id', 'firstName', 'lastName', 'company'],
		}),
		getCompanies({
			conditions: { phoneNumber: `'${phoneNumber}'` },
			fields: ['id', 'identifier', 'name', 'status', 'phoneNumber', 'territory'],
		}),
	]);

	if (!contacts.length && !companies.length) {
		return Response.json(
			{
				name: nationalFormat,
				territoryName: 'TeamA',
			} as ReturnType,
			{ status: 200 }
		);
	}

	if (!contacts.length && companies.length === 1) {
		return Response.json(
			{
				companyId: companies[0].id,
				name: companies[0].name,
				territoryName: companies[0].territory?.name.split(' ').join('') ?? 'TeamA',
			} as ReturnType,
			{ status: 200 }
		);
	}

	if (contacts.length > 1) {
		const firstContact = contacts[0];
		// Check to see if every contact has the same first name, last name, and a different company
		// This tells the system that this user has multiple contacts with multiple companies
		// If that's the case then return just the users name
		if (
			contacts.every(
				(contact) =>
					(contact.firstName === firstContact.firstName &&
						contact.lastName === firstContact.lastName &&
						contact.company?.id === firstContact.company?.id) ||
					contact.company?.id !== firstContact.company?.id
			)
		) {
			const company = await getCompany(firstContact.company?.id!, { fields: ['id', 'name', 'territory'] });

			return Response.json(
				{
					userId: firstContact.id,
					// companyId: firstContact.company?.id,
					name: firstContact.firstName + ' ' + firstContact.lastName,
					territoryName: company?.territory?.name.split(' ').join('') ?? 'TeamA',
				} as ReturnType,
				{ status: 200 }
			);
		}

		// This tells the system that this phone number has multiple contacts with the same number
		// If that's the case then return just the company
		if (contacts.every((contact) => contact.company?.id === firstContact.company?.id)) {
			const company = await getCompany(firstContact.company?.id!, { fields: ['id', 'name', 'territory'] });

			return Response.json(
				{
					companyId: firstContact.company?.id,
					name: company?.name,
					territoryName: company?.territory?.name.split(' ').join('') ?? 'TeamA',
				} as ReturnType,
				{ status: 200 }
			);
		}

		return Response.json(
			{
				name: nationalFormat,
				territoryName: 'TeamA',
			} as ReturnType,
			{ status: 200 }
		);
	}

	const user = contacts[0];

	const company =
		user && user.company
			? await getCompany(user.company.id!, { fields: ['id', 'name', 'territory'] })
			: companies[0] ?? undefined;

	let territoryName =
		company?.territory && company?.territory?.name ? company?.territory?.name.split(' ').join('') : 'TeamA';

	return Response.json(
		{
			userId: user.id,
			companyId: company?.id,
			name: user.firstName + ' ' + user.lastName,
			territoryName,
		} as ReturnType,
		{ status: 200 }
	);
}
