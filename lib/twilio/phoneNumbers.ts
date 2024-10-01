'use server';
import { createClient } from '@/utils/twilio';
import { getCompanies, getCompany, getContacts } from '../manage/read';

export const getPhoneNumbers = async () => {
	const client = await createClient();
	// client.outgoingCallerIds.list({ limit: 100 });
	const phoneNumbers = await client.incomingPhoneNumbers.list({
		limit: 100,
	});

	return phoneNumbers.map((number) => {
		delete number['_context'];
		// @ts-ignore
		delete number['_proxy'];
		// @ts-ignore
		delete number['_solution'];
		// @ts-ignore
		delete number['_version'];
		// @ts-ignore
		delete number['toJSON'];
		// @ts-ignore
		delete number['update'];
		// @ts-ignore
		delete number['userDefinedMessages'];
		// @ts-ignore
		delete number['userDefinedMessageSubscriptions'];
		// @ts-ignore
		delete number['events'];
		// @ts-ignore
		delete number['_proxy'];
		// @ts-ignore
		delete number['_solution'];
		// @ts-ignore
		delete number['_version'];
		// @ts-ignore
		delete number['toJSON'];
		// @ts-ignore
		delete number['update'];
		// @ts-ignore
		delete number['userDefinedMessages'];
		// @ts-ignore
		delete number['userDefinedMessageSubscriptions'];
		// @ts-ignore
		delete number['events'];
		// @ts-ignore
		delete number['fetch'];
		// @ts-ignore
		delete number['notifications'];
		// @ts-ignore
		delete number['payments'];
		// @ts-ignore
		delete number['recordings'];
		// @ts-ignore
		delete number['remove'];
		// @ts-ignore
		delete number['siprec'];
		// @ts-ignore
		delete number['streams'];
		// @ts-ignore
		delete number['transcriptions'];
		return number;
	});
};

export const lookupPhoneNumber = async (from: string) => {
	const client = await createClient();
	const { nationalFormat } = await client.lookups.v2.phoneNumbers(from).fetch();

	if (!nationalFormat) return;


	let phoneNumber = nationalFormat.replace(/\D/g, '');
	phoneNumber = phoneNumber.replace(/\(|\)/g, '');

	if (!phoneNumber) return;

	const [{data: contacts}, { data: companies }] = await Promise.all([
		getContacts({
			// conditions: { inactiveFlag: false }, 
			childConditions: { 'communicationItems/value': `'${phoneNumber}'` },
			fields: ['id', 'firstName', 'lastName', 'company', 'inactiveFlag'],
		}),
		getCompanies({
			conditions: { phoneNumber: `'${phoneNumber}'` },
			fields: ['id', 'identifier', 'name', 'status', 'phoneNumber', 'territory'],
		}),
	]);

	// No contacts found but found company
	if (!contacts.length && companies.length) {
		if (companies.length > 2) {
			
		}
		
	} else if (contacts.length && !companies.length) {
		if (contacts.length > 2 && contacts.every(c => !c.inactiveFlag)) {
			
		}
	}

	if (!contacts.length && !companies.length) {
		return {
				name: nationalFormat,
				territoryName: 'TeamA',
			};
	}

	if (!contacts.length && companies.length === 1) {
		return {
			companyId: companies[0].id,
			name: companies[0].name,
			territoryName: companies[0].territory?.name.split(' ').join('') ?? 'TeamA'
		}
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

			return {
					userId: firstContact.id,
					name: firstContact.firstName + ' ' + firstContact.lastName,
					territoryName: company?.territory?.name.split(' ').join('') ?? 'TeamA',
				}
		}

		// This tells the system that this phone number has multiple contacts with the same number
		// If that's the case then return just the company
		if (contacts.every((contact) => contact.company?.id === firstContact.company?.id)) {
			const company = await getCompany(firstContact.company?.id!, { fields: ['id', 'name', 'territory'] });

			return {
					companyId: firstContact.company?.id,
					name: company?.name,
					territoryName: company?.territory?.name.split(' ').join('') ?? 'TeamA',
				}
		}

		return {
				name: nationalFormat,
				territoryName: 'TeamA',
			}
	}

	const user = contacts[0];

	const company =
		user && user.company
			? await getCompany(user.company.id!, { fields: ['id', 'name', 'territory'] })
			: companies[0] ?? undefined;

	let territoryName =
		company?.territory && company?.territory?.name ? company?.territory?.name.split(' ').join('') : 'TeamA';

	return {
			userId: user.id,
			companyId: company?.id,
			name: user.firstName + ' ' + user.lastName,
			territoryName,
		}
}