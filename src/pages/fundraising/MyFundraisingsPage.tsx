import React from 'react';
import FundraisingList from "../../components/FundraisingList";
import fundraisingsRepository from "../../repository/fundraisingsRepository";

const MyFundraisingsPage = () => {
    const loader = (params: { pageSize: number, page: number }) => fundraisingsRepository.getMyFundraising(params)
    return (
        <FundraisingList loader={loader} type={'USER'} />
    );
};

export default MyFundraisingsPage;