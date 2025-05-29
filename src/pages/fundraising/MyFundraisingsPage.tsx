import React from 'react';
import FundraisingList from "../../components/FundraisingList";
import fundraisingsRepository from "../../repository/fundraisingsRepository";

const MyFundraisingsPage = () => {
    const loader = (pageSize: number, page: number) => fundraisingsRepository.getMyFundraising(page, pageSize)
    return (
        <FundraisingList type={'USER'} />
    );
};

export default MyFundraisingsPage;