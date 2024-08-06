'use client';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { toast, useSonner } from 'sonner';
const context = React.createContext({});
const { Provider } = context;

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
	const { toasts } = useSonner();

	useEffect(() => {
		if (toasts.length) return;
		if (!('Notification' in window)) {
			// Check if the browser supports notifications
			alert('This browser does not support desktop notification');
		} else if (Notification.permission === 'granted') {
			// Check whether notification permissions have already been granted;
			// if so, create a notification
			const notification = new Notification('Hi there!');
			// …
		} else if (Notification.permission !== 'denied') {
			// We need to ask the user for permission
			Notification.requestPermission().then((permission) => {
				// If the user accepts, let's create a notification
				if (permission === 'granted') {
					const notification = new Notification('Hi there!');
					// …
				}
			});
		}
	}, []);

	useEffect(() => {
		window.addEventListener('blur', function () {});

		return () => {
			window.removeEventListener('blur', function () {});
		};
	}, [window]);

	useEffect(() => {
		if (toasts.length) return;
		window.addEventListener('blur', function () {});

		return () => {
			window.removeEventListener('blur', function () {});
		};
	}, [toasts]);

	return <Provider value={{}}>{children}</Provider>;
};

export const useNotifications = () => {
	const state = useContext(context);

	return state;
};
