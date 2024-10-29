import ConversationContactDetail from './conversation-contact-detail';
import ConversationDetails from './active-conversation';
import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/navbar';
import FilterHeader from '@/components/filter-header';
import { Button } from '@/components/ui/button';
import { Layers3 } from 'lucide-react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import getQueryClient from '../getQueryClient';
import { Board, Company, Contact, Priority, SystemMember } from '@/types/manage';

export default async function Page(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
	const searchParams = await props.searchParams;
	const client = getQueryClient();
	const companyId = searchParams.companyId ? parseInt(searchParams.companyId as string) : undefined;
	const contactId = searchParams.contactId ? parseInt(searchParams.contactId as string) : undefined;
	const supabase = await createClient();
	const [boards, priorities, members, companies, contacts] = await Promise.all([
		client.fetchQuery<Board[]>({
			queryKey: [
				'/service/boards',
				{
					conditions: {
						inactiveFlag: false,
						projectFlag: false,
						// 'workRole/id': [9, 5],
					},
					orderBy: { key: 'name' },
					fields: ['id', 'name'],
					pageSize: 1000,
				},
			],
		}),
		client.fetchQuery<Priority[]>({
			queryKey: ['/service/priorities', { fields: ['id', 'name'], orderBy: { key: 'name' }, pageSize: 1000 }],
		}),
		client.fetchQuery<SystemMember[]>({
			queryKey: [
				'/system/members',
				{
					conditions: { inactiveFlag: false },
					fields: ['id', 'firstName', 'lastName'],
					orderBy: { key: 'firstName' },
					pageSize: 1000,
				},
			],
		}),
		client.fetchQuery<Company[]>({
			queryKey: [
				'/company/companies',
				{
					conditions: { 'status/id': 1 },
					childConditions: { 'types/id': 1 },
					orderBy: { key: 'name', order: 'asc' },
					fields: ['id', 'name'],
					pageSize: 1000,
				},
			],
		}),
		client.fetchQuery<Contact[]>({
			queryKey: [
				'/company/contacts',
				{
					conditions: {
						'company/id': companyId ? [companyId] : undefined,
						inactiveFlag: false,
					},
					orderBy: {
						key: 'firstName',
					},
					fields: ['id', 'firstName', 'lastName'],
					pageSize: 1000,
				},
			],
		}),
	]);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<>
			<Navbar title='Dashboard'>
				<Dialog>
					<DialogTrigger asChild>
						<Button
							size='sm'
							variant='ghost'
							className='text-xs h-auto py-1.5'
						>
							<Layers3 className='mr-1.5 size-3' /> <span>New view</span>
						</Button>
					</DialogTrigger>

					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create View</DialogTitle>
						</DialogHeader>

						<form>
							<Input />
						</form>

						<DialogFooter>
							<DialogClose asChild>
								<Button
									variant='secondary'
									size='sm'
									type='button'
								>
									Cancel
								</Button>
							</DialogClose>

							<Button size='sm'>Submit</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</Navbar>

			<FilterHeader
				filters={[
					{
						label: 'Board',
						icon: 'SquareDashedKanban',
						values: boards.map((board) => ({ label: board.name, icon: 'SquareDashedKanban' })),
					},
					{
						label: 'Priority',
						icon: 'ShieldAlert',
						values: priorities.map((priority) => ({ label: priority.name, icon: 'ShieldAlert' })),
					},
					{
						label: 'Owner',
						icon: 'UserPlusf',
						values: members.map((member) => ({ label: `${member.firstName} ${member.lastName ?? ''}`, icon: 'User' })),
					},
					{
						label: 'Company',
						icon: 'Building',
						values: companies.map((company) => ({ label: company.name, icon: 'Building' })),
					},
					{
						label: 'Contact',
						icon: 'User',
						values: contacts.map((contact) => ({
							label: `${contact.firstName ?? ''} ${contact.lastName ?? ''}`,
							icon: 'User',
						})),
					},
				]}
			/>

			<main className='grid sm:grid-cols-1 md:grid-cols-[2fr_3fr] lg:grid-cols-[1fr_3fr] w-full gap-3'>
				<ConversationContactDetail contactId={contactId ?? user?.user_metadata?.contactId} />

				<ConversationDetails
					contactId={contactId}
					companyId={companyId}
					className='p-6'
				/>
			</main>
		</>
	);
}
