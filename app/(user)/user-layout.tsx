'use client';
import { ReactNode } from 'react';
import { DeviceProvider } from '@/providers/device-provider';
import { WorkerProvider } from '@/providers/worker-provider';
import { NotificationProvider } from '@/providers/notification-provider';
import { TaskContext } from '@/components/active-call/context';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TwilioProvider } from '@/providers/twilio-provider';

type Props = {
	token: string;
	children: ReactNode;
};

const UserLayout = ({ token, children }: Props) => {
	return (
		<TooltipProvider>
			<NotificationProvider>
				<TaskContext>
					<TwilioProvider authToken={token}>
						<DeviceProvider authToken={token}>
							<WorkerProvider authToken={token}>{children}</WorkerProvider>
						</DeviceProvider>
					</TwilioProvider>
				</TaskContext>
			</NotificationProvider>
		</TooltipProvider>
	);
};

export default UserLayout;
