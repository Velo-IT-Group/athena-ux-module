import { atom } from 'recoil';
import type { Reservation } from 'twilio-taskrouter';

export const reservationAtom = atom<Reservation[]>({
	key: 'reservationAtom',
	default: [],
});
