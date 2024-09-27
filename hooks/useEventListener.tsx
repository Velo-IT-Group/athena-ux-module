'use client';
import { useEffect, useRef } from 'react';

const useEventListener = (eventName: keyof DocumentEventMap, handler: (event: Event) => void, element = window) => {
	const savedHandler = useRef(handler);

	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		const isSupported = element && element.addEventListener;
		if (!isSupported) return;

		const eventListener = (event: Event) => savedHandler.current(event);
		element.addEventListener(eventName, eventListener);

		return () => {
			element.removeEventListener(eventName, eventListener);
		};
	}, [eventName, element]);
};

export default useEventListener;
