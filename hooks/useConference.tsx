import {
	getConferenceByName,
	getConferenceParticipants,
	removeConferenceParticipant,
	updateConferenceParticipants,
} from '@/lib/twilio/conference/helpers';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ConferenceAttributes } from './useTask';
import { ParticipantInstance } from 'twilio/lib/rest/api/v2010/account/conference/participant';

const useConference = ({ sid, participants }: ConferenceAttributes) => {
	const [conferenceParticipants, setConferenceParticipants] = useState<ParticipantInstance[]>(
		Object.values(participants) as unknown as ParticipantInstance[]
	);

	const { data: conference, isLoading } = useQuery({
		queryKey: ['conference', sid],
		queryFn: () => getConferenceByName(sid),
	});

	const { data, isLoading: isConferenceParticipantsLoading } = useQuery({
		queryKey: ['conference', sid],
		queryFn: () => getConferenceParticipants(sid),
	});

	if (!isConferenceParticipantsLoading && data) {
		setConferenceParticipants(data!);
	}

	const { mutate: muteParticipant } = useMutation({
		mutationFn: ({ participantSid, muted }: { participantSid: string; muted: boolean }) =>
			updateConferenceParticipants(sid, participantSid, { muted }),
		onSuccess: (data) => {
			const participantIndex = conferenceParticipants.findIndex((p) => data.accountSid === p.accountSid);
			if (participantIndex >= 0) {
				setConferenceParticipants((prev) => [...prev, (prev[participantIndex] = data)]);
			}
		},
	});

	const { mutate: holdParticipant } = useMutation({
		mutationFn: ({ participantSid, hold }: { participantSid: string; hold: boolean }) =>
			updateConferenceParticipants(sid, participantSid, { hold }),
		onSuccess: (data) => {
			const participantIndex = conferenceParticipants.findIndex((p) => data.accountSid === p.accountSid);
			if (participantIndex >= 0) {
				setConferenceParticipants((prev) => [...prev, (prev[participantIndex] = data)]);
			}
		},
	});

	const { mutate: removeParticipant } = useMutation({
		mutationFn: (participantSid: string) => removeConferenceParticipant(sid, participantSid),
		onSuccess: (data, participantSid) => {
			setConferenceParticipants((prev) => [...prev.filter((p) => p.accountSid !== participantSid)]);
		},
	});

	return { conference, conferenceParticipants, muteParticipant, holdParticipant, removeParticipant, isLoading };
};

export default useConference;
