'use client';
import { atom } from 'recoil';

export const collapsedState = atom<boolean>({
	key: 'CollapsedState',
	default: false,
});
