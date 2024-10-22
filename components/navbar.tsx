'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { Plus, X } from 'lucide-react';
import useReservations from '@/hooks/useReservations';
import ReservationItem from './reservation-item';
import { useWorker } from '@/providers/worker-provider';
import { Reservation, Worker } from 'twilio-taskrouter';
import { useNotifications } from '@/providers/notification-provider';
import useRinger from '@/hooks/useRinger';
import { toast } from 'sonner';
import { SidebarTrigger } from './ui/sidebar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import OutboundDialerContent from './outbound-dialer-content';
import OutboundDialer from './outbound-dialer';

const Navbar = () => {
	'use no memo';
	const params = useSearchParams();
	const { push } = useRouter();
	const { worker } = useWorker();
	const { reservations, addReservation, removeReservation } = useReservations();
	const { createNotification } = useNotifications();
	const { togglePlayback } = useRinger();

	const onReservationCreated = async (r: Reservation) => {
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

		worker.on('error', (e) => {
			console.error(e.message);
		});

		return () => {
			worker?.off('ready', onWorkerReady);
			worker?.off('reservationCreated', onReservationCreated);
		};
	}, [worker]);

	return (
		<nav className='flex items-center gap-1.5 px-3 py-0.5 h-12 border-b'>
			<SidebarTrigger />

			<h2 className='text-sm font-medium tracking-tight'>Dashboard</h2>

			{Array.from(params.entries()).length > 0 && (
				<Button
					variant='ghost'
					size='sm'
					onClick={() => push('/')}
				>
					<span>Clear</span>
					<X className='ml-1.5' />
				</Button>
			)}

			{reservations.map((reservation) => (
				<ReservationItem
					key={reservation.sid}
					reservation={reservation}
				/>
			))}
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant='ghost'
						size='sm'
						className='p-1.5 h-[26px] text-xs'
					>
						<Plus className='mr-1.5 h-3 w-3' />

						<span>Add</span>
					</Button>
				</PopoverTrigger>

				<PopoverContent side='bottom'>
					<OutboundDialer />
				</PopoverContent>
			</Popover>
		</nav>
	);
};

export default Navbar;
