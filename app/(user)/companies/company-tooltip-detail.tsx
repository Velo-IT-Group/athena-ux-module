'use client';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { TooltipContent } from '@/components/ui/tooltip';
import { useWorker } from '@/providers/worker-provider';
import { Copy, Ellipsis, Mail, PhoneOutgoing } from 'lucide-react';
import parsePhoneNumber from 'libphonenumber-js';

type Props = {
	name: string;
	phoneNumber?: string;
};

const CompanyTooltipDetail = ({ name, phoneNumber }: Props) => {
	const { worker } = useWorker();

	const handleCopy = async () => {
		await navigator.clipboard.writeText(name);
	};

	return (
		<TooltipContent
			align='start'
			side='bottom'
			className='flex items-center gap-3 bg-muted/25 backdrop-blur-lg'
		>
			<Button
				variant='ghost'
				size='sm'
			>
				<Copy className='mr-1.5' />
				<span>Copy</span>
			</Button>

			<Separator
				orientation='vertical'
				className='h-3.5'
			/>

			{phoneNumber && (
				<Button
					variant='ghost'
					size='sm'
					onClick={async () => {
						const number = parsePhoneNumber(phoneNumber, 'US');
						await worker?.createTask(
							number?.number.toString() || '',
							'+18449402678',
							'WW497b90bc1703176f6845c09c8bf4fa8a',
							'WQee659e96340b3899ad1fad7578fe6515',
							{
								attributes: {
									direction: 'outboundDial',
								},
							}
						);
					}}
				>
					<PhoneOutgoing className='mr-1.5' />
					<span>Call</span>
				</Button>
			)}

			<Separator
				orientation='vertical'
				className='h-3.5'
			/>

			<Button
				variant='ghost'
				size='sm'
			>
				<Mail className='mr-1.5' />
				<span>Send Email</span>
			</Button>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='outline'
						size='sm'
						className='bg-black text-white'
					>
						<Ellipsis />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent>
					<DropdownMenuItem>Testing</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</TooltipContent>
	);
};

export default CompanyTooltipDetail;
