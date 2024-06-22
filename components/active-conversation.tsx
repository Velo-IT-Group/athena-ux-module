import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CircleCheckIcon, SettingsIcon } from 'lucide-react';
import Image from 'next/image';

type Props = {
	className?: string;
};

export function ActiveConversation({ className }: Props) {
	return (
		<div className={className}>
			<div className='flex items-center justify-between mb-6'>
				<div className='flex items-center space-x-4'>
					<Avatar>
						<AvatarImage src='/placeholder-user.jpg' />
						<AvatarFallback>JW</AvatarFallback>
					</Avatar>
					<div>
						<h1 className='text-2xl font-bold'>Jully Webb</h1>
						<p className='text-sm text-gray-500'>+1 814-458-3724</p>
						<Badge variant='default'>Talking — 01:58 via Virtual Agent Transfer</Badge>
						<Badge variant='destructive'>REC</Badge>
					</div>
				</div>
				<SettingsIcon className='w-6 h-6' />
			</div>

			<div className='flex items-center space-x-4 mb-6'>
				<Button variant='outline'>Hold</Button>
				<Button variant='outline'>Mute</Button>
				<Button variant='outline'>Stop rec</Button>
				<Button variant='outline'>Keypad</Button>
				<Button variant='outline'>Add guest</Button>
				<Button variant='destructive'>End call</Button>
			</div>

			<Tabs defaultValue='snapshot'>
				<TabsList>
					<TabsTrigger value='snapshot'>Snapshot</TabsTrigger>
					<TabsTrigger value='customer-details'>Customer details</TabsTrigger>
					<TabsTrigger value='orders'>Orders</TabsTrigger>
					<TabsTrigger value='notes'>Notes</TabsTrigger>
				</TabsList>
				<TabsContent value='snapshot'>
					<div className='grid grid-cols-2 gap-8'>
						<div>
							<h2 className='text-xl font-bold mb-4'>Customer profile</h2>
							<div className='space-y-2'>
								<p className='text-sm font-medium'>Loyalty level</p>
								<p className='text-sm'>Gold</p>
							</div>
							<div className='space-y-2'>
								<p className='text-sm font-medium'>Customer since</p>
								<p className='text-sm'>May 13, 2022</p>
							</div>
							<div className='space-y-2'>
								<p className='text-sm font-medium'>Birthday</p>
								<p className='text-sm'>Jan 24, 2000</p>
							</div>
							<div className='space-y-2'>
								<p className='text-sm font-medium'>Address</p>
								<p className='text-sm'>Kantstraße 113, 55122 Mainz, Germany</p>
							</div>
							<div className='space-y-2'>
								<p className='text-sm font-medium'>PoP Contract</p>
								<p className='text-sm'>Active</p>
							</div>
						</div>
						<div>
							<h2 className='text-xl font-bold mb-4'>Latest orders</h2>
							<div className='space-y-2'>
								<p className='text-sm font-medium'>Most recent order</p>
								<p className='text-sm'>In-store purchase</p>
								<p className='text-sm'>Last update: today, May 24, 2022</p>
								<p className='text-sm'>Expected delivery: 24 May, 2022</p>
							</div>
							<div className='flex items-center space-x-4'>
								<Image
									src='/placeholder.svg'
									alt='Product'
									height={80}
									width={80}
								/>
								<div className='space-y-2'>
									<p className='text-sm font-medium'>Tracking # DHL</p>
									<p className='text-sm'>45890584095849045845</p>
									<p className='text-sm font-medium'>Delivery type</p>
									<p className='text-sm'>Normal shipping</p>
								</div>
							</div>
							<div className='flex items-center space-x-4 mt-4'>
								<div className='flex items-center space-x-2'>
									<CircleCheckIcon className='w-4 h-4 text-green-500' />
									<p className='text-sm'>Processed</p>
									<p className='text-sm'>May 14</p>
								</div>
								<div className='flex items-center space-x-2'>
									<CircleCheckIcon className='w-4 h-4 text-yellow-500' />
									<p className='text-sm'>Shipped</p>
									<p className='text-sm'>May 16</p>
								</div>
								<div className='flex items-center space-x-2'>
									<CircleCheckIcon className='w-4 h-4 text-orange-500' />
									<p className='text-sm'>In transit</p>
									<p className='text-sm'>May 24</p>
								</div>
								<div className='flex items-center space-x-2'>
									<CircleCheckIcon className='w-4 h-4 text-gray-500' />
									<p className='text-sm'>Delivered</p>
									<p className='text-sm'>-</p>
								</div>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
