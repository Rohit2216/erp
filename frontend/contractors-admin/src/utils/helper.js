// Check if the current date is within the financial year
export const isCurrentFinancialYear = (item) => {
	const currentDate = new Date();
	return (
		currentDate >= new Date(item?.start_date) &&
		currentDate <= new Date(item?.end_date)
	);
};
