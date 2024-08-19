'use client';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { Dialpad } from '../dialpad';
import { TooltipProvider } from '../ui/tooltip';
import ActiveCallHeader from './header';
import ActiveCallFooter from './footer';
import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { getConferenceParticipants } from '@/lib/twilio/conference/helpers';
import ActiveCallParticipants from './participants';
import { useTask } from './context';

type Props = {
	taskSid: string;
	attributes: any;
	conferenceSid: string;
};

export function ActiveCall({ taskSid, attributes, conferenceSid }: Props) {
	const { reservation, task } = useTask();
	useEffect(() => {
		getConferenceParticipants(conferenceSid)
			.then((e) => {
				console.log(e);
			})
			.catch((e) => console.error(e));
	}, [conferenceSid]);

	return (
		<SessionProvider>
			<TooltipProvider>
				<Card className='shadow-sm w-[356px] dark'>
					<ActiveCallHeader />

					<ActiveCallParticipants />

					<ActiveCallFooter />
				</Card>
			</TooltipProvider>
		</SessionProvider>
	);
}
