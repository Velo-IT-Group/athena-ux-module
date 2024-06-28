import { atom } from 'recoil';
import { MuteState, type ISingleCallControl } from '@gnaudio/jabra-js';
import { DeviceState } from '@/providers/jabra-provider';

export const jabraAtom = atom<ISingleCallControl | null>({
	key: 'jabraAtom',
	default: null,
});

export const callControlAtom = atom<ISingleCallControl | null>({
	key: 'callControlAtom',
	default: null,
});

export const jabraStateAtom = atom<DeviceState>({
	key: 'jabraStateAtom',
	default: {
		callActive: false,
		muteState: MuteState.NO_ONGOING_CALLS,
	},
});

export const callControlDevicesAtom = atom<ISingleCallControl[]>({
	key: 'callControlDevicesAtom',
	default: [],
});
