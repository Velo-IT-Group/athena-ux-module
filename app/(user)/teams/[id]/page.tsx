import getQueryClient from '@/app/getQueryClient';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Location } from '@/types/manage';
import React from 'react';
import { Overview } from './overview';
import { RecentSales } from './recent-sales';

type QueryParams = Promise<{ id: string }>;

type Props = { params: QueryParams };

const Page = async ({ params, ...props }: Props) => {
	console.log(props);
	const client = getQueryClient();
	const { id } = await params;
	const team = await client.fetchQuery<Location>({ queryKey: [`/system/locations/${id}`] });

	return (
		<div>
			<Navbar
				title={team.name}
				items={[
					{
						title: 'Tickets',
						// icon: 'Ticket',
						href: `/teams/${id}/tickets`,
					},
					{
						title: 'Companies',
						// icon: Building,
						href: `/teams/${id}/companies`,
					},
					{
						title: 'Contacts',
						// icon: User,
						href: `/teams/${id}/contacts`,
					},
					{
						title: 'Proposals',
						// icon: FileText,
						href: `/teams/${id}/proposals`,
					},
				]}
			/>

			<div className='flex-col flex'>
				<div className='flex-1 space-y-4 p-8 pt-6'>
					<div className='flex items-center justify-between space-y-2'>
						<h2 className='text-2xl font-bold tracking-tight'>Overview</h2>
						<div className='flex items-center space-x-2'>
							{/* <Calendar /> */}
							<Button>Download</Button>
						</div>
					</div>
					<Tabs
						defaultValue='overview'
						className='space-y-3'
					>
						<TabsList>
							<TabsTrigger value='overview'>Overview</TabsTrigger>
							<TabsTrigger
								value='analytics'
								disabled
							>
								Analytics
							</TabsTrigger>
							<TabsTrigger
								value='reports'
								disabled
							>
								Reports
							</TabsTrigger>
							<TabsTrigger
								value='notifications'
								disabled
							>
								Notifications
							</TabsTrigger>
						</TabsList>
						<TabsContent
							value='overview'
							className='space-y-4'
						>
							<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
								<Card>
									<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
										<CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											className='h-4 w-4 text-muted-foreground'
										>
											<path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
										</svg>
									</CardHeader>
									<CardContent>
										<div className='text-2xl font-bold'>$45,231.89</div>
										<p className='text-xs text-muted-foreground'>+20.1% from last month</p>
									</CardContent>
								</Card>
								<Card>
									<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
										<CardTitle className='text-sm font-medium'>Subscriptions</CardTitle>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											className='h-4 w-4 text-muted-foreground'
										>
											<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
											<circle
												cx='9'
												cy='7'
												r='4'
											/>
											<path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
										</svg>
									</CardHeader>
									<CardContent>
										<div className='text-2xl font-bold'>+2350</div>
										<p className='text-xs text-muted-foreground'>+180.1% from last month</p>
									</CardContent>
								</Card>
								<Card>
									<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
										<CardTitle className='text-sm font-medium'>Sales</CardTitle>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											className='h-4 w-4 text-muted-foreground'
										>
											<rect
												width='20'
												height='14'
												x='2'
												y='5'
												rx='2'
											/>
											<path d='M2 10h20' />
										</svg>
									</CardHeader>
									<CardContent>
										<div className='text-2xl font-bold'>+12,234</div>
										<p className='text-xs text-muted-foreground'>+19% from last month</p>
									</CardContent>
								</Card>
								<Card>
									<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
										<CardTitle className='text-sm font-medium'>Active Now</CardTitle>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											className='h-4 w-4 text-muted-foreground'
										>
											<path d='M22 12h-4l-3 9L9 3l-3 9H2' />
										</svg>
									</CardHeader>
									<CardContent>
										<div className='text-2xl font-bold'>+573</div>
										<p className='text-xs text-muted-foreground'>+201 since last hour</p>
									</CardContent>
								</Card>
							</div>
							<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
								<Card className='col-span-4'>
									<CardHeader>
										<CardTitle>Overview</CardTitle>
									</CardHeader>
									<CardContent className='pl-2'>
										<Overview />
									</CardContent>
								</Card>
								<Card className='col-span-3'>
									<CardHeader>
										<CardTitle>Recent Sales</CardTitle>
										<CardDescription>You made 265 sales this month.</CardDescription>
									</CardHeader>
									<CardContent>
										<RecentSales />
									</CardContent>
								</Card>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default Page;