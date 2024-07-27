'use client';
import { MuteState, type ISingleCallControl } from '@gnaudio/jabra-js';
import { atom, selector } from 'recoil';

export type DeviceState = {
	callActive: boolean;
	muteState: MuteState;
};

export const deviceState = atom<DeviceState>({
	key: 'DeviceState',
	default: {
		callActive: false,
		muteState: MuteState.NO_ONGOING_CALLS,
	},
});

export const currentCallControlState = atom<ISingleCallControl | undefined>({
	key: 'CurrentCallControl',
	default: undefined,
});

export const callControlDevicesState = atom<ISingleCallControl[]>({
	key: 'CallControlDevices',
	default: [],
});
