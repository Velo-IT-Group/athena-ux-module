import FilterHeader from '@/components/filter-header';
import ContactList from '@/components/lists/contact-list';
import React from 'react';
import { LinearCombobox } from '@/components/linear-combobox';
import Navbar from '@/components/navbar';
import { Badge } from '@/components/ui/badge';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInput,
} from '@/components/ui/sidebar';
import { getCompanies, getContacts } from '@/lib/manage/read';

type Props = {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Page = async ({ searchParams }: Props) => {
	const params = await searchParams;

	// let companyId: number = params.companyId;
	// let companies = params.company &&
	console.log(params);
	const [{ data: contacts }, { data: companies }] = await Promise.all([
		getContacts({
			conditions: {
				// 'company/id': companyId ? [companyId] : undefined,
				inactiveFlag: false,
			},
			orderBy: {
				key: 'firstName',
			},
			fields: ['id', 'firstName', 'lastName', 'company', 'types'],
			pageSize: 1000,
		}),
		getCompanies({
			conditions: { 'status/id': 1 },
			childConditions: { 'types/id': 1 },
			orderBy: { key: 'name', order: 'asc' },
			fields: ['id', 'name'],
			pageSize: 1000,
		}),
	]);
	return (
		<>
			<FilterHeader filters={[]} />

			<section className="p-3">
				<ContactList
					params={{}}
					definition={{ page: 'contact' }}
					type="table"
				/>
			</section>
		</>
	);
};

export default Page;
