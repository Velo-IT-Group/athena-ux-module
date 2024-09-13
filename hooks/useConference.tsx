import {
	createConferenceParticipant,
	CreateParticipantParams,
	getConferenceByName,
	getConferenceParticipants,
	removeConferenceParticipant,
	updateConference,
	updateConferenceParticipants,
} from '@/lib/twilio/conference/helpers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { ConferenceAttributes, ConferenceParticpant } from './useTask';
import { ParticipantInstance } from 'twilio/lib/rest/api/v2010/account/conference/participant';
import { useWorker } from '@/providers/worker-provider';
import { Task } from 'twilio-taskrouter';
import { parsePhoneNumber } from '@/lib/utils';
import { createClient } from '@/utils/twilio';
import { Twilio } from 'twilio';

type Props = {
	conference: ConferenceAttributes;
	task: Task;
};

const useConference = ({ conference, task }: Props) => {
	const queryClient = useQueryClient();
	const { worker } = useWorker();
	const [conferenceParticipants, setConferenceParticipants] = useState<ConferenceParticpant>();

	useEffect(() => {
		if (!conference.participants) return;

		setConferenceParticipants((prev) => {
			return {
				...prev,
				worker: {
					sid: worker?.sid,
					name: worker?.attributes.full_name,
				},
				customer: {
					sid: task.attributes.conference.participants.customer,
					name: task.attributes.name ? task.attributes.name : parsePhoneNumber(task.attributes.from).formattedNumber,
				},
			};
		});
	}, [conference.participants]);

	const queryParticipants = useQuery({
		queryKey: ['participants', conference.sid],
		queryFn: () => getConferenceParticipants(conference.sid),
	});

	// const { mutate: muteParticipant } = useMutation({
	// 	mutationFn: ({ participantSid, muted }: { participantSid: string; muted: boolean }) =>
	// 		updateConferenceParticipants(sid, participantSid, { muted }),
	// 	onSuccess: (data) => {
	// 		const participantIndex = conferenceParticipants.findIndex((p) => data.accountSid === p.accountSid);
	// 		if (participantIndex >= 0) {
	// 			setConferenceParticipants((prev) => [...prev, (prev[participantIndex] = data)]);
	// 		}
	// 	},
	// });

	// const { mutate: holdParticipant } = useMutation({
	// 	mutationFn: ({ participantSid, hold }: { participantSid: string; hold: boolean }) =>
	// 		updateConferenceParticipants(sid, participantSid, { hold }),
	// 	onSuccess: (data) => {
	// 		const participantIndex = conferenceParticipants.findIndex((p) => data.accountSid === p.accountSid);
	// 		if (participantIndex >= 0) {
	// 			setConferenceParticipants((prev) => [...prev, (prev[participantIndex] = data)]);
	// 		}
	// 	},
	// });

	// const { mutate: removeParticipant } = useMutation({
	// 	mutationFn: (participantSid: string) => removeConferenceParticipant(sid, participantSid),
	// 	onSuccess: (data, participantSid) => {
	// 		setConferenceParticipants((prev) => [...prev.filter((p) => p.accountSid !== participantSid)]);
	// 	},
	// });

	const { mutate: endConference } = useMutation({
		mutationFn: () => updateConference(conference.sid, { status: 'completed' }),
	});

	const updateConferenceParticipantsState = (participants: ConferenceParticpant) => {
		queryClient.invalidateQueries({ queryKey: ['participants', conference.sid] });
		setConferenceParticipants((prev) => {
			return {
				...prev,
				worker: {
					sid: worker?.sid,
					name: worker?.attributes.full_name,
				},
				customer: {
					sid: task.attributes.conference.participants.customer,
					name: task.attributes.name ? task.attributes.name : parsePhoneNumber(task.attributes.from).formattedNumber,
				},
			};
		});

		task.setAttributes({
			...task.attributes,
			conference: {
				...task.attributes.conference,
				conferenceParticipants,
			},
		});
	};

	const addConferenceParticipantMutation = useMutation({
		mutationFn: async (params: CreateParticipantParams) => {
			// const { formattedNumber } = parsePhoneNumber(params.To, 'US', 'E.164');
			console.log(params);
			return await createConferenceParticipant(conference.sid, params);
		},
		onSuccess(data, variables, context) {
			queryClient.invalidateQueries({ queryKey: ['participants', conference.sid] });
			setConferenceParticipants((prev) => {
				return {
					...prev,
					external: {
						...data,
						name: parsePhoneNumber(variables.To).formattedNumber,
					},
				};
			});

			task.setAttributes({
				...task.attributes,
				conference: {
					...task.attributes.conference,
					conferenceParticipants,
				},
			});
		},
	});

	return {
		addConferenceParticipantMutation,
		conference,
		conferenceParticipants,
		// muteParticipant,
		// holdParticipant,
		// removeParticipant,
		// isLoading,
		endConference,
		setConferenceParticipants,
		queryParticipants,
		updateConferenceParticipantsState,
	};
};

export default useConference;
