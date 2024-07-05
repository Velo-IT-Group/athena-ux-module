import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IncomingPhoneNumberInstance } from 'twilio/lib/rest/api/v2010/account/incomingPhoneNumber';
import { getPhoneNumbers } from '@/lib/twilio/phoneNumbers';

type Props = {
	name?: string;
};

const PhoneNumberSelect = ({ name = 'from' }: Props) => {
	const [numbers, setNumbers] = useState<IncomingPhoneNumberInstance[]>([]);

	useEffect(() => {
		getPhoneNumbers().then((nums) => setNumbers(nums));
	}, []);

	return (
		<Select
			name={name}
			defaultValue={numbers.length ? numbers[0].phoneNumber : undefined}
		>
			<SelectTrigger>
				<SelectValue placeholder='Select caller id...' />
			</SelectTrigger>

			<SelectContent>
				{numbers?.map((number) => (
					<SelectItem
						key={number.phoneNumber}
						value={number.phoneNumber}
					>
						{number.friendlyName}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default PhoneNumberSelect;
