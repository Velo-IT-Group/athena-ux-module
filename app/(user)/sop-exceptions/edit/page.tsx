type Props = {};

const Page = async (props: Props) => {
	const params = await props.searchParams;
	console.log(params);

	return <div></div>;
};

export default Page;
