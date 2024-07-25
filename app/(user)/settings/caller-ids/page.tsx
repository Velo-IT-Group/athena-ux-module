import { getPhoneNumbers } from '@/lib/twilio/phoneNumbers';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

type Props = {};

const Page = async (props: Props) => {
	const callerIds = await getPhoneNumbers();

	return (
		<Card x-chunk='dashboard-04-chunk-2'>
			<CardHeader>
				<CardTitle>Caller ID's</CardTitle>
				<CardDescription>The directory within your project, in which your plugins are located.</CardDescription>
			</CardHeader>

			<CardContent>
				<form className='flex flex-col gap-4'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead></TableHead>
								<TableHead>Friendly Name</TableHead>
								<TableHead>Phone Number</TableHead>
								<TableHead></TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{callerIds.map((callerId) => (
								<TableRow key={callerId.sid}>
									<TableCell>
										<Switch />
									</TableCell>

									<TableCell>
										<Input defaultValue={callerId.friendlyName} />
									</TableCell>

									<TableCell>
										<Input defaultValue={callerId.phoneNumber} />
									</TableCell>

									<TableCell>
										<Button
											variant='ghost'
											size='icon'
										>
											<Trash />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Input
						placeholder='Project Name'
						defaultValue='/content/plugins'
					/>

					<Select>
						<SelectTrigger>
							<SelectValue placeholder='Select a caller ID' />
						</SelectTrigger>
						<SelectContent>
							{callerIds.map((callerId) => (
								<SelectItem
									key={callerId.sid}
									value={callerId.sid}
								>
									{callerId.friendlyName}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<div className='flex items-center space-x-2'>
						<label
							htmlFor='include'
							className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
						>
							Allow administrators to change the directory.
						</label>
					</div>
				</form>
			</CardContent>

			<CardFooter className='border-t px-6 py-4'>
				<Button>Save</Button>
			</CardFooter>
		</Card>
	);
};

export default Page;
