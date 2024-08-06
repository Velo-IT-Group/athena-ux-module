import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { listFlows } from '@/lib/twilio/studio/read';
import { relativeDate } from '@/utils/date';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import FlowOptions from './flow-options';

type Props = {};

const Page = async (props: Props) => {
	const flows = await listFlows();
	return (
		<Tabs
			className='grid place-items-start gap-3'
			defaultValue='active'
		>
			<header className=''>
				<h1>Workflows</h1>
			</header>

			<TabsList>
				<TabsTrigger
					value='active'
					className='px-6'
				>
					Active
				</TabsTrigger>
				<TabsTrigger
					value='inactive'
					className='px-6'
				>
					Inactive
				</TabsTrigger>
			</TabsList>

			<TabsContent
				value='active'
				className='grid grid-cols-2 gap-3 w-full'
			>
				{flows.map((flow) => (
					<Card className='flex flex-col w-full'>
						<CardHeader className='grid grid-cols-[1fr_110px] items-start gap-4 space-y-0'>
							<div className='space-y-1'>
								<CardTitle>{flow.friendlyName}</CardTitle>
							</div>
							<div className='flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground'>
								<Button
									variant='secondary'
									className='px-3 shadow-none'
									asChild
								>
									<Link href={`/settings/paths/${flow.sid}`}>
										<Pencil className='mr-2 h-4 w-4' />
										Edit
									</Link>
								</Button>

								<Separator
									orientation='vertical'
									className='h-[20px]'
								/>

								<FlowOptions flow={flow} />
							</div>
						</CardHeader>

						<CardContent>
							<p className='text-sm text-muted-foreground'>{}</p>
						</CardContent>

						<CardFooter className='flex flex-row items-center justify-between space-x-4 text-sm text-muted-foreground w-full'>
							<div className='flex items-center text-muted-foreground text-xs animate-in fade-in truncate capitalize'>
								Updated {relativeDate(new Date(flow.dateUpdated))}
							</div>
						</CardFooter>
					</Card>
				))}
			</TabsContent>
		</Tabs>
	);
};

export default Page;
