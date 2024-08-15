'use client';
import React from 'react';
import { Button } from './ui/button';
import { updateWorkerReservation } from '@/lib/twilio/taskrouter/helpers';
import { getConferenceByName } from '@/lib/twilio/conference/helpers';
import { toast } from 'sonner';
import { ActiveCall } from './active-call';

type Props = {
	attributes: any;
	reservationSid: string;
	taskSid: string;
	to: string;
	from: string;
};

const ReservationAcceptButton = ({ attributes, reservationSid, taskSid, to, from }: Props) => {
	return (
		<Button
			className='bg-green-600 hover:bg-green-600/90 text-sm'
			onClick={async () => {
				try {
					const res = await updateWorkerReservation(reservationSid, {
						instruction: 'conference',
						to: 'client:' + to,
						from: from,
						beep: 'false',
						endConferenceOnCustomerExit: true,
						endConferenceOnExit: true,
					});

					const conference = await getConferenceByName(taskSid);

					toast.custom(
						() => (
							<ActiveCall
								taskSid={taskSid}
								attributes={attributes}
								conferenceSid={conference?.conference?.sid ?? ''}
							/>
						),
						{
							duration: Infinity,
							dismissible: false,
							id: taskSid,
						}
					);

					console.log(res);
				} catch (error) {
					console.error(error);
				}
			}}
		>
			Accept
		</Button>
	);
};

export default ReservationAcceptButton;
