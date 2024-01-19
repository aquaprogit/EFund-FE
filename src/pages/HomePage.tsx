import '../styles/home-page.css';
import FundraisingList from "../components/FundraisingList/FundraisingList";
import Fundraisings from "../services/api/Fundraisings";

const HomePage = () => {
    const loader = (body: any) => Fundraisings.getFundraisings(body)
    return (
        <FundraisingList loader={loader} />
    );
};

export default HomePage;