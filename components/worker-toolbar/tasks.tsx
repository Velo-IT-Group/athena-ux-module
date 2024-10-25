'use client';
import React, { useEffect } from 'react';
import useReservations from '@/hooks/useReservations';
import { useWorker } from '@/providers/worker-provider';
import { Phone } from 'lucide-react';
import { TabsTrigger } from '../ui/tabs';
import { useNotifications } from '@/providers/notification-provider';
import useRinger from '@/hooks/useRinger';
import { Reservation, Worker } from 'twilio-taskrouter';
import { toast } from 'sonner';

type Props = {
	selectedTab: string;
	setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
};

const Tasks = ({ selectedTab, setSelectedTab }: Props) => {
	const { worker } = useWorker();
	const { reservations, addReservation, removeReservation } = useReservations();
	const { createNotification } = useNotifications();
	const { togglePlayback } = useRinger();

	const onReservationCreated = async (r: Reservation) => {
		setSelectedTab(r.sid);
		console.log(`Reservation ${r.sid} has been created for ${worker?.sid}`);
		const isVoicemail = r.task.attributes.taskType === 'voicemail';
		addReservation(r);
		if (r.task.attributes.direction === 'outbound') {
			await r.conference({
				beep: false,
			});
		} else if (isVoicemail) {
			createNotification(`New Voicemail From ${r.task.attributes.name}`);
		} else {
			createNotification(`New Phone Call From ${r.task.attributes.name}`);
			togglePlayback(true);
		}

		r.on('accepted', async (reservation) => {
			console.log('Call accepted');
			try {
				togglePlayback(false);
			} catch (error) {
				console.error(error);
				toast.error(JSON.stringify(error));
			}
		});

		r.on('rejected', async (reservation) => {
			try {
				togglePlayback(false);
				removeReservation(reservation);
			} catch (error) {
				console.error('No call pending', error);
				toast.error(JSON.stringify(error));
			}
		});

		r.on('canceled', async (reservation) => {
			try {
				togglePlayback(false);
				removeReservation(reservation);
			} catch (error) {
				console.error('No call pending', error);
				toast.error(JSON.stringify(error));
			}
		});

		r.on('wrapup', async () => {
			try {
				togglePlayback(false);
				console.log('Wrapping up');
			} catch (error) {
				toast.error(JSON.stringify(error));
			}
		});

		r.on('completed', async (reservation) => {
			try {
				togglePlayback(false);
				removeReservation(reservation);
			} catch (error) {
				toast.error(JSON.stringify(error));
			}
		});

		r.on('timeout', async (reservation) => {
			try {
				togglePlayback(false);
				removeReservation(reservation);
			} catch (error) {
				console.error('No call pending', error);
				toast.error(JSON.stringify(error));
			}
		});
	};

	const onWorkerReady = async (w: Worker) => {
		console.log('Worker Ready', w.sid);
		const reservations = Array.from(w.reservations.values());

		reservations.forEach((reservation) => {
			addReservation(reservation);
		});
	};

	useEffect(() => {
		if (!worker) return;
		worker?.on('ready', onWorkerReady);

		worker?.on('reservationCreated', onReservationCreated);

		worker?.on('reservationFailed', (reservation) => {
			togglePlayback(false);
			removeReservation(reservation);
		});

		worker.on('error', (e) => {
			console.error(e.message);
		});

		return () => {
			worker?.off('ready', onWorkerReady);
			worker?.off('reservationCreated', onReservationCreated);
		};
	}, [worker]);

	return (
		<div>
			{reservations.map((reservation) => {
				const { task } = reservation;
				const taskChannel = task.taskChannelUniqueName;

				return (
					<TabsTrigger
						value={reservation.sid}
						className='rounded-full hover:bg-muted data-[state=active]:bg-muted h-9 w-9'
					>
						{(taskChannel === 'voice' || taskChannel === 'default') && <Phone />}
					</TabsTrigger>
				);
			})}
			Tasks
		</div>
	);
};

export default Tasks;
