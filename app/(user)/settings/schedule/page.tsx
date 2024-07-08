import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Moon } from 'lucide-react';

type Props = {};

type Period = 'One Time' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
type Rule = {
	name: string;
	isClosed: boolean;
	reason: string;
	isAllDayClosure: boolean;
	recurrence?: {
		timePeriod: Period;
		month: number;
		day: number;
	};
};

const rules: Rule[] = [
	{
		name: 'Christmas Day',
		isClosed: true,
		reason: 'christmas',
		isAllDayClosure: true,
		recurrence: {
			timePeriod: 'Yearly',
			month: 12,
			day: 25,
		},
	},
	{
		name: 'Christmas Eve',
		isClosed: true,
		reason: 'christmas',
		isAllDayClosure: true,
		recurrence: {
			timePeriod: 'Yearly',
			month: 12,
			day: 24,
		},
	},
	{
		name: 'July 4th',
		isClosed: true,
		reason: 'independence',
		isAllDayClosure: true,
		recurrence: {
			timePeriod: 'Yearly',
			month: 7,
			day: 4,
		},
	},
];

const schedule: Array<{ enabled: boolean; rule?: Rule }> = [
	{ enabled: true },
	{ enabled: true },
	{ enabled: true },
	{ enabled: true },
	{ enabled: true },
	{ enabled: false },
	{ enabled: false },
];

const holidays: Array<{ enabled: boolean; rule?: Rule }> = [
	{ enabled: true, rule: rules[0] },
	{ enabled: true, rule: rules[1] },
	{ enabled: true, rule: rules[2] },
	{ enabled: true, rule: rules[0] },
	{ enabled: true, rule: rules[1] },
	{ enabled: false, rule: rules[2] },
	{ enabled: false, rule: rules[0] },
];

const names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Page = ({}: Props) => {
	return (
		<>
			<Card>
				<CardHeader className='border-b p-6'>
					<CardTitle>Business Hours</CardTitle>
					<CardDescription>Your company&apos;s business hours go here.</CardDescription>
				</CardHeader>

				<CardContent>
					<form className='pt-6 space-y-3'>
						<div className='flex items-center justify-between'>
							<div>
								<h2 className='text-sm font-medium'>Enable</h2>
								<h2 className='text-xs text-muted-foreground'>Quickly enable or disable business hours</h2>
							</div>

							<Switch />
						</div>

						<Separator />

						<div className='flex items-center justify-between'>
							<div>
								<h2 className='text-sm font-medium'>Timezone</h2>
								<h2 className='text-xs text-muted-foreground'>Set your timezone</h2>
							</div>

							<Select>
								<SelectTrigger className='max-w-md'>
									<SelectValue placeholder='Select a timezone...' />
								</SelectTrigger>
							</Select>
						</div>

						<Separator />

						{schedule.map((item, index) => (
							<div
								key={`${item.enabled}-${index}`}
								className='grid grid-cols-[1fr_2fr] gap-3 items-center'
							>
								<div className='flex items-center gap-3'>
									<Switch defaultChecked={item.enabled} />

									<span className='font-medium text-sm'>{names[index]}</span>
								</div>

								<div className='grid grid-cols-2 gap-3'>
									{item.enabled ? (
										<>
											<Input
												type='time'
												defaultValue='08:00'
											/>

											<Input
												type='time'
												defaultValue='17:00'
											/>
										</>
									) : (
										<div className='flex items-center gap-3 h-10 px-3 bg-muted/40 col-span-2 text-muted-foreground rounded-md text-sm'>
											<Moon />
											<span>Closed</span>
										</div>
									)}
								</div>
							</div>
						))}
					</form>
				</CardContent>

				<CardFooter className='border-t px-6 py-3'>
					<Button>Save</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader className='border-b p-6'>
					<CardTitle>Outside Business Hours</CardTitle>
					<CardDescription>Route callers who dial outside business hours</CardDescription>
				</CardHeader>

				<CardContent>
					<form className='pt-6 space-y-3'>
						<div className='flex items-center justify-between'>
							<div>
								<h2 className='text-sm font-medium'>Enable</h2>
								<h2 className='text-xs text-muted-foreground'>Quickly enable or disable business hours</h2>
							</div>

							<Switch />
						</div>

						<Separator />

						<div className='flex items-center justify-between'>
							<div>
								<h2 className='text-sm font-medium'>Timezone</h2>
								<h2 className='text-xs text-muted-foreground'>Set your timezone</h2>
							</div>

							<Select>
								<SelectTrigger className='max-w-md'>
									<SelectValue placeholder='Select a timezone...' />
								</SelectTrigger>
							</Select>
						</div>

						<Separator />

						{schedule.map((item, index) => (
							<div
								key={`${item.enabled}-${index}`}
								className='grid grid-cols-[1fr_2fr] gap-3 items-center'
							>
								<div className='flex items-center gap-3'>
									<Switch defaultChecked={item.enabled} />

									<span className='font-medium text-sm'>{names[index]}</span>
								</div>

								<div className='grid grid-cols-2 gap-3'>
									{item.enabled ? (
										<>
											<Input
												type='time'
												defaultValue='08:00'
											/>

											<Input
												type='time'
												defaultValue='17:00'
											/>
										</>
									) : (
										<div className='flex items-center gap-3 h-10 px-3 bg-muted/40 col-span-2 text-muted-foreground rounded-md text-sm'>
											<Moon />
											<span>Closed</span>
										</div>
									)}
								</div>
							</div>
						))}
					</form>
				</CardContent>

				<CardFooter className='border-t px-6 py-3'>
					<Button>Save</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader className='border-b p-6'>
					<CardTitle>Holidays</CardTitle>
					<CardDescription>Your company&apos;s business hours go here.</CardDescription>
				</CardHeader>

				<CardContent>
					<form className='pt-6 space-y-3'>
						{holidays.map(({ enabled, rule }) => (
							<div
								key={`${enabled}-${rule?.name}`}
								className='grid grid-cols-[1fr_2fr] gap-3 items-center'
							>
								<div className='flex items-center gap-3'>
									<Switch defaultChecked={enabled} />

									<span className='font-medium text-sm'>{rule?.name}</span>
								</div>

								<div className='grid grid-cols-2 gap-3'>
									{enabled ? (
										<div className='flex items-center gap-3 h-10 px-3 bg-muted/40 col-span-2 text-muted-foreground rounded-md text-sm'>
											<Moon />
											<span>Closed</span>
										</div>
									) : (
										<div className='flex items-center gap-3 h-10 px-3 bg-muted/40 col-span-2 text-muted-foreground rounded-md text-sm'>
											<Moon />
											<span>Closed</span>
										</div>
									)}
								</div>
							</div>
						))}
					</form>
				</CardContent>

				<CardFooter className='border-t px-6 py-4'>
					<Button>Save</Button>
				</CardFooter>
			</Card>
		</>
	);
};

export default Page;
