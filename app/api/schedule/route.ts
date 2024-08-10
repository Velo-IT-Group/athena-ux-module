import { getSchedule } from '@/lib/manage/read';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
	try {
		const schedule = await getSchedule(2);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Internal Server Error' + JSON.stringify(error) }, { status: 500 });
	}

	return NextResponse.json({
		rules: [
			{
				id: 'eee7d8eb-f966-4a23-8743-ec3452cd11ad',
				name: 'July 4th',
				isOpen: false,
				closedReason: 'holiday',
				dateRRule: 'RRULE:FREQ=YEARLY;BYMONTH=7;BYMONTHDAY=4',
			},
			{
				id: '21cc41d6-9f4a-4e49-b61b-bcd5cf94d870',
				name: 'Labor Day',
				isOpen: false,
				closedReason: 'holiday',
				startDate: '2023-09-04',
				endDate: '2023-09-04',
			},
			{
				id: '61703be8-412c-4bd5-8a6b-afe7e9ecb304',
				name: 'Thanksgiving Day',
				isOpen: false,
				closedReason: 'holiday',
				startDate: '2023-11-23',
				endDate: '2023-11-23',
			},
			{
				id: 'b2b4ae7b-d491-46dd-b387-1321c88ac50a',
				name: 'Memorial Day',
				isOpen: false,
				closedReason: 'holiday',
				startDate: '2023-05-29',
				endDate: '2023-05-29',
			},
			{
				id: 'c4d10897-63b8-485e-bd8a-0db23276dec8',
				name: 'Christmas Day',
				isOpen: false,
				closedReason: 'holiday',
				dateRRule: 'RRULE:FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=25',
			},
			{
				id: '0f437b04-5d8e-46ce-824f-3591375f9beb',
				name: 'Martin Luther King Jr. Day',
				isOpen: false,
				closedReason: 'holiday',
				startDate: '2023-01-16',
				endDate: '2023-01-16',
			},
			{
				id: 'cda1c3fb-39ab-4a25-9342-6bef21ede470',
				name: "Presidents' Day",
				isOpen: false,
				closedReason: 'holiday',
				startDate: '2023-02-20',
				endDate: '2023-02-20',
			},
			{
				id: '4f6f2952-fa96-4047-b52f-81ed7e8dacd2',
				name: 'Juneteenth',
				isOpen: false,
				closedReason: 'holiday',
				dateRRule: 'RRULE:FREQ=YEARLY;BYMONTH=6;BYMONTHDAY=19',
			},
			{
				id: '51800893-7050-413d-a692-201e3d0161b6',
				name: 'Veterans Day',
				isOpen: false,
				closedReason: 'holiday',
				dateRRule: 'RRULE:FREQ=YEARLY;BYMONTH=11;BYMONTHDAY=11',
			},
			{
				id: '46c34f64-1efb-4453-9178-1ae6573d13ae',
				name: "New Year's Day",
				isOpen: false,
				closedReason: 'holiday',
				dateRRule: 'RRULE:FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=1',
			},
			{
				id: '5c0c7b9c-787f-4245-bb5b-b31160cb3ec5',
				name: 'Open hours',
				isOpen: true,
				startTime: '08:00',
				endTime: '17:00',
				dateRRule: 'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
			},
		],
		schedules: [
			{
				name: 'Example',
				manualClose: false,
				timeZone: 'America/Chicago',
				rules: [
					'5c0c7b9c-787f-4245-bb5b-b31160cb3ec5',
					'c4d10897-63b8-485e-bd8a-0db23276dec8',
					'eee7d8eb-f966-4a23-8743-ec3452cd11ad',
					'4f6f2952-fa96-4047-b52f-81ed7e8dacd2',
					'21cc41d6-9f4a-4e49-b61b-bcd5cf94d870',
					'0f437b04-5d8e-46ce-824f-3591375f9beb',
					'b2b4ae7b-d491-46dd-b387-1321c88ac50a',
					'46c34f64-1efb-4453-9178-1ae6573d13ae',
					'cda1c3fb-39ab-4a25-9342-6bef21ede470',
					'61703be8-412c-4bd5-8a6b-afe7e9ecb304',
					'51800893-7050-413d-a692-201e3d0161b6',
				],
			},
		],
	});
};
