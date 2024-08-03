'use client';
import type { Call, Device } from '@twilio/voice-sdk';
import type { Activity, Reservation, Task, Worker } from 'twilio-taskrouter';
import type { ConferenceInstance } from 'twilio/lib/rest/api/v2010/account/conference';
import { atom } from 'recoil';

export type CustomCall = {
	call?: Call;
	conference?: ConferenceInstance;
	task?: Task;
};

export const workspaceState = atom({
	key: 'Workspace',
	default: '',
});

export const callStateAtom = atom<CustomCall>({
	key: 'CallState',
	default: {
		call: undefined,
		task: undefined,
		conference: undefined,
	},
});

export const deviceEligibleAtom = atom<boolean>({
	key: 'DeviceEligibleState',
	default: false,
});

export const activityState = atom<Activity | undefined>({
	key: 'ActivityState',
	default: undefined,
});

export const activityListState = atom<Map<string, Activity>>({
	key: 'ActivityList',
	default: new Map(),
});

export const deviceState = atom<Device | undefined>({
	key: 'Device',
	default: undefined,
});

export const workerState = atom<Worker | undefined>({
	key: 'Worker',
	default: undefined,
});

export const reservationsListState = atom<Reservation[]>({
	key: 'ReservationsList',
	default: [],
});
