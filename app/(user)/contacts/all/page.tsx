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
			{/* <FilterHeader filters={[]} /> */}
			<Sidebar
				collapsible="none"
				className="hidden flex-1 md:flex">
				<SidebarHeader className="gap-3.5 border-b p-4">
					<div className="flex w-full items-center justify-between">
						<div className="text-base font-medium text-foreground">
							Contacts
						</div>

						<FilterHeader
							filters={[
								{
									icon: 'Building',
									label: 'Company',
									values: companies.map((c) => ({
										icon: 'Building',
										label: c.name,
										value: String(c.id),
									})),
								},
							]}
							hideDisplay
						/>
					</div>
					<SidebarInput placeholder="Type to search..." />
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup className="px-0">
						<SidebarGroupContent>
							{contacts.map((contact) => (
								<a
									href="#"
									key={contact.id}
									className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
									<div className="flex w-full items-center gap-2">
										<span>
											{contact.firstName}{' '}
											{contact.lastName}
										</span>
										<span className="ml-auto text-xs">
											{contact?.types?.some(
												(type) => type.name === 'VIP'
											) && (
												<Badge
													variant="caution"
													className="rounded">
													VIP
												</Badge>
											)}
										</span>
									</div>
									<span className="font-medium">
										{contact.company?.name}
									</span>
									<span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
										{contact.company?.name}
									</span>
								</a>
							))}
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
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
