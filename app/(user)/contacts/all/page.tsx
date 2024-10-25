import FilterHeader from '@/components/filter-header';
import ContactList from '@/components/lists/contact-list';
import React from 'react';

type Props = {};

const Page = async (props: Props) => {
	return (
		<>
			<FilterHeader filters={[]} />
			<section className='p-3'>
				<ContactList
					params={{}}
					definition={{ page: 'contact' }}
					type='table'
				/>
			</section>
		</>
	);
};

export default Page;
