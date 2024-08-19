'use client';
import { ReactNode } from 'react';
import RecoilProvider from '@/providers/recoil-provider';
import { TwilioProvider } from '@/providers/twilio-provider';
import { DeviceProvider } from '@/providers/device-provider';
import { WorkerProvider } from '@/providers/worker-provider';
import { NotificationProvider } from '@/providers/notification-provider';

type Props = {
	token: string;
	children: ReactNode;
};

const UserLayout = ({ token, children }: Props) => {
	return (
		<RecoilProvider>
			<NotificationProvider>
				<TwilioProvider authToken={token}>
					<DeviceProvider authToken={token}>
						<WorkerProvider authToken={token}>{children}</WorkerProvider>
					</DeviceProvider>
				</TwilioProvider>
			</NotificationProvider>
		</RecoilProvider>
	);
};

export default UserLayout;
