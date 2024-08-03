import { Card } from '@/components/ui/card';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { Dialpad } from '../dialpad';
import { TooltipProvider } from '../ui/tooltip';
import ActiveCallHeader from './active-call-header';
import ActiveCallFooter from './footer';
import { useEffect, useState } from 'react';
import { ParticipantInstance } from 'twilio/lib/rest/api/v2010/account/conference/participant';
import { getConferenceParticipants } from '@/lib/twilio/conference/helpers';
import ParticipantListItem from './participant-list-item';

type Props = {
	attributes: any;
	conferenceSid: string;
};

export async function ActiveCall({ attributes, conferenceSid }: Props) {
	const [participants, setParticipants] = useState<ParticipantInstance[]>([]);

	useEffect(() => {
		getConferenceParticipants(conferenceSid)
			.then(setParticipants)
			.catch((e) => console.error(e));
	}, [conferenceSid]);

	return (
		<TooltipProvider>
			<Popover>
				<Card className='shadow-sm w-80 dark'>
					<ActiveCallHeader attributes={attributes} />

					{participants.map((participant) => (
						<ParticipantListItem
							key={participant.accountSid}
							participant={participant}
						/>
					))}

					<ActiveCallFooter />
				</Card>

				<PopoverContent
					side='left'
					className='dark'
					avoidCollisions
				>
					<Dialpad />
				</PopoverContent>
			</Popover>
		</TooltipProvider>
	);
}
