'use client';
import { useContext, useEffect, useState, createContext } from 'react';
import { CustomTaskAttributes } from '@/types/twilio';
import { TaskInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/task';
import { TaskAttributes } from 'twilio/lib/twiml/VoiceResponse';

interface Props {
	task: TaskInstance | undefined;
	setTask: React.Dispatch<React.SetStateAction<TaskInstance | undefined>>;
	attributes: (TaskAttributes & CustomTaskAttributes) | undefined;
	setAttributes: React.Dispatch<React.SetStateAction<(TaskAttributes & CustomTaskAttributes) | undefined>>;
}

const initialValues: Props = {
	task: undefined,
	setTask: () => undefined,
	attributes: undefined,
	setAttributes: () => undefined,
};

type WithChildProps = {
	task?: TaskInstance;
	children: React.ReactNode;
};

const context = createContext(initialValues);
const { Provider } = context;

export const TwilioTaskContext = ({ children }: WithChildProps) => {
	const [task, setTask] = useState<TaskInstance>();
	const [attributes, setAttributes] = useState<TaskAttributes & CustomTaskAttributes>();

	useEffect(() => {
		if (!task) return;
		setAttributes(JSON.parse(task.attributes));
	}, [task]);

	return <Provider value={{ task, setTask, attributes, setAttributes }}>{children}</Provider>;
};

export const useTaskContext = () => {
	const state = useContext(context);

	return state;
};
