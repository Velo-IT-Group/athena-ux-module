import React from 'react';
import FilterHeader from '@/components/filter-header';
import ContactList from '@/components/lists/contact-list';

type QueryParams = Promise<{ id: string }>;

type Props = {
	params: QueryParams;
};

const Page = async ({ params }: Props) => {
	const { id } = await params;
	return (
		<>
			<FilterHeader filters={[]} />

			<section className="p-3 overflow-x-scroll">
				<ContactList
					definition={{ page: 'teams-contacts' }}
					type="table"
					params={{
						conditions: {
							'companyLocation/id': id,
							inactiveFlag: false,
						},
						orderBy: {
							key: 'firstName',
						},
						fields: [
							'id',
							'firstName',
							'lastName',
							'defaultPhoneNbr',
							'company',
						],
					}}
				/>
			</section>
		</>
	);
};

export default Page;
