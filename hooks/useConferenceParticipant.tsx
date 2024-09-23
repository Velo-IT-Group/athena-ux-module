'use client';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	getConferenceParticipant,
	removeConferenceParticipant,
	updateConferenceParticipants,
} from '@/lib/twilio/conference/helpers';
import { toast } from 'sonner';

type Props = {
	conferenceSid: string;
	participantSid: string;
};

const useConferenceParticipant = ({ conferenceSid, participantSid }: Props) => {
	const queryClient = useQueryClient();

	const [isMuted, setIsMuted] = useState(false);
	const [isCoaching, setIsCoaching] = useState(false);
	const [isOnHold, setIsOnHold] = useState(false);
	const [status, setStatus] = useState('');

	const getParticipant = useQuery({
		queryKey: ['participants', conferenceSid, participantSid],
		queryFn: () => getConferenceParticipant(conferenceSid, participantSid),
	});

	const toggleParticipantMute = useMutation({
		mutationKey: ['toggleParticipantMute', conferenceSid, participantSid],
		mutationFn: ({ label, muted }: { label?: string; muted: boolean }) =>
			updateConferenceParticipants(conferenceSid, label ?? participantSid, { Muted: muted }),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['participant', conferenceSid, participantSid] });

			setIsMuted(data.muted);
		},
	});

	const removeParticipant = useMutation({
		mutationKey: ['toggleParticipantMute', conferenceSid, participantSid],
		mutationFn: () => removeConferenceParticipant(conferenceSid, participantSid),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['participants', conferenceSid, participantSid] });
		},
		onError(error, variables, context) {
			toast.error(error.message);
		},
	});

	const toggleParticipantHoldState = useMutation({
		mutationKey: ['toggleParticipantHoldState', conferenceSid, participantSid],
		mutationFn: ({ label, hold }: { label?: string; hold: boolean }) =>
			updateConferenceParticipants(conferenceSid, label ?? participantSid, { Hold: hold }),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['participants', conferenceSid, participantSid] });
			setIsMuted(data.hold);
		},
		onError(error, variables, context) {
			toast.error(error.message);
		},
	});

	return {
		isMuted,
		isCoaching,
		status,
		isOnHold,
		getParticipant,
		setIsMuted,
		setIsCoaching,
		setStatus,
		setIsOnHold,
		toggleParticipantHoldState,
		toggleParticipantMute,
		removeParticipant,
	};
};

export default useConferenceParticipant;
