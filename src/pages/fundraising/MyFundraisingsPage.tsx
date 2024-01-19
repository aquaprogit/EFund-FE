import React from 'react';
import FundraisingList from "../../components/FundraisingList/FundraisingList";
import Fundraisings from "../../services/api/Fundraisings";

const MyFundraisingsPage = () => {
    const loader = (params: {pageSize: number, page: number}) => Fundraisings.getMyFundraising(params)
    return (
        <FundraisingList loader={loader} type={'USER'}/>
    );
};

export default MyFundraisingsPage;