'use client';
import { History, Phone, PhoneOutgoing, UserIcon, Users } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import OutboundDial from './outbound-dial';
import TeamMembers from './team-members';
import useReservations from '@/hooks/useReservations';
import { useWorker } from '@/providers/worker-provider';
import { useNotifications } from '@/providers/notification-provider';
import useRinger from '@/hooks/useRinger';
import { Reservation, Worker } from 'twilio-taskrouter';
import { toast } from 'sonner';
import TaskNotification from '../task-notification';
import useTimer from '@/hooks/useTimer';
import Timer from '../timer';

type Props = {};

const WorkerToolbar = (props: Props) => {
	const [selectedTab, setSelectedTab] = useState('');
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

	// const supabase = await createClient();

	// const {
	// 	data: { user },
	// } = await supabase.auth.getUser();

	// if (!user) return null;

	// const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

	// if (!profile) return null;

	// const { data: initialConversations } = await supabase
	// 	.schema('reporting')
	// 	.from('conversations')
	// 	.select('*')
	// 	.order('date', { ascending: false })
	// 	.eq('agent', profile?.worker_sid ?? '');

	return (
		<Tabs
			value={selectedTab}
			onValueChange={setSelectedTab}
			is-worker-loaded={true}
			className='flex flex-col items-center justify-end overflow-hidden border bg-background shadow-sm fixed bottom-6 right-6 rounded-2xl p-1'
		>
			<div className='w-full rounded-xl overflow-hidden'>
				<TabsContent
					value='user-info'
					className='bg-secondary'
				>
					{/* <UserInfo user={user} /> */}
				</TabsContent>

				<TabsContent value='call-history'>
					{/* <HistorySelector
						profile={profile}
						initalConversations={initialConversations ?? []}
					/> */}
				</TabsContent>

				<TabsContent value='team-members'>
					<TeamMembers members={[]} />
				</TabsContent>

				<TabsContent value='outbound-dialer'>
					<OutboundDial />
				</TabsContent>

				{reservations.map((reservation) => (
					<TabsContent
						key={reservation.sid}
						value={reservation.sid}
					>
						<TaskNotification
							reservation={reservation}
							task={reservation.task}
						/>
					</TabsContent>
				))}
			</div>

			<TabsList className='z-10 flex items-center justify-center gap-x-1 bg-background p-1'>
				<TabsTrigger
					value='user-info'
					className='rounded-full hover:bg-muted data-[state=active]:bg-muted h-9 w-9 relative'
				>
					<UserIcon />

					{/* <div
						className={cn(
							'w-2 h-2 rounded-full absolute border border-white -right-0.5 -bottom-0.5',
							// activity && activityColors[activity?.name]
							'bg-green-500'
						)}
					/> */}

					{/* <span className='sr-only'>{user?.user_metadata?.full_name}</span> */}
				</TabsTrigger>

				<TabsTrigger
					value='call-history'
					className='rounded-full hover:bg-muted data-[state=active]:bg-muted h-9 w-9'
				>
					<History />

					<span className='sr-only'>Call History</span>
				</TabsTrigger>

				<TabsTrigger
					value='team-members'
					className='rounded-full hover:bg-muted data-[state=active]:bg-muted h-9 w-9'
				>
					<Users />

					<span className='sr-only'>Team Members</span>
				</TabsTrigger>

				<Separator
					orientation='vertical'
					className='h-5'
				/>

				<TabsTrigger
					value='outbound-dialer'
					className='rounded-full hover:bg-muted data-[state=active]:bg-muted h-9 w-9'
				>
					<PhoneOutgoing />
				</TabsTrigger>

				{reservations.length > 0 && (
					<Separator
						orientation='vertical'
						className='h-5'
					/>
				)}

				{reservations.map((reservation) => (
					<ReservationTrigger
						key={reservation.sid}
						reservation={reservation}
					/>
				))}
			</TabsList>
		</Tabs>
	);
};

export const ReservationTrigger = ({ reservation }: { reservation: Reservation }) => {
	const { task } = reservation;
	const taskChannel = task.taskChannelUniqueName;

	const timer = useTimer(reservation.dateUpdated);

	return (
		<TabsTrigger
			value={reservation.sid}
			className='rounded-full hover:bg-muted data-[state=active]:bg-muted h-9 flex items-center gap-1.5'
		>
			{(taskChannel === 'voice' || taskChannel === 'default') && <Phone />}

			<div className='flex flex-col justify-start items-start'>
				<p className='text-xs leading-none'>{task.attributes.name}</p>

				<Timer
					timer={timer}
					className='text-[9px] text-muted-foreground leading-normal'
				/>
			</div>
		</TabsTrigger>
	);
};

export default WorkerToolbar;
