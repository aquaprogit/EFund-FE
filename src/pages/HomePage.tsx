import '../styles/home-page.css';
import FundraisingList from "../components/FundraisingList";
import fundraisingsRepository from "../repository/fundraisingsRepository";

const HomePage = () => {
    const loader = (body: any) => fundraisingsRepository.getFundraisings(body)
    return (
        <FundraisingList loader={loader} />
    );
};

export default HomePage;