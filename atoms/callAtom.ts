import { atom } from 'recoil';
import type { Reservation, Task } from 'twilio-taskrouter';

export const activeCall = atom<Task | null>({
	key: 'activeCall',
	default: null,
});
