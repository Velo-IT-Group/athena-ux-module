'use client';
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { Task, Reservation } from 'twilio-taskrouter';

interface DeviceProviderProps {
	reservation: Reservation | undefined;
	setReservation: Dispatch<SetStateAction<Reservation | undefined>>;
	task: Task | undefined;
	setTask: Dispatch<SetStateAction<Task | undefined>>;
}

const initialValues: DeviceProviderProps = {
	reservation: undefined,
	setReservation: () => undefined,
	task: undefined,
	setTask: () => undefined,
};

type WithChildProps = {
	children: React.ReactNode;
};

const context = createContext(initialValues);
const { Provider } = context;

export const TaskContext = ({ children }: WithChildProps) => {
	const [reservation, setReservation] = useState<Reservation | undefined>();
	const [task, setTask] = useState<Task | undefined>();

	return (
		<Provider
			value={{
				reservation,
				setReservation,
				task,
				setTask,
			}}
		>
			{children}
		</Provider>
	);
};

export const useTask = () => {
	const state = useContext(context);

	return state;
};
