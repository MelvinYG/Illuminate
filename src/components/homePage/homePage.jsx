import CardHome from "../cardHome/cardHome";
import EnergyDoughnutChart from "../chart/doughnutChart";
import Recommendation from "../recommendations/recommendations";
import TariffHome from "../tariffChart/tariffHome";
import WeatherForecast from "../weatherForecast/weatherForecast";
import './homePage.css';

const HomePage = () => {
  // morning or evening
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Morning" : "Evening";

  const mainCard = (
    <div className="flex gap-8 items-center mainCard">
      <div className="mainCard-left">
        <div className="text-2xl font-bold">{`Good ${greeting}!`}</div>
        <div className="flex flex-col items-start">
          All systems are working well today.
        </div>
      </div>
      <div className="mainCard-right">
        <EnergyDoughnutChart />
      </div>
    </div>
  );
  return (
    <div className="px-4 py-10 md:px-16">
        <div className="mobileGreetings">
          <div className="text-2xl font-bold">{`Good ${greeting}!`}</div>
          <div className="flex flex-col items-start">
            All systems are working well today.
          </div>
        </div>
      <div className="px-4 py-10 grid grid-cols-6 gap-4 md:px-16">

        {/* Main Card spans all columns on mobile and adjusts on larger screens */}
        <CardHome className="card-main col-span-6 lg:col-span-4" content={mainCard} />

        {/* Weather Card spans 2 columns on small and larger screens */}
        <CardHome
          className="card-weather col-span-6  md:col-span-3 lg:col-span-2"
          content={WeatherForecast()}
        />

        {/* Tariff Card spans 2 columns on small and larger screens */}
        <CardHome 
          className="col-span-6 md:col-span-3 lg:col-span-2 hover:cursor-pointer" 
          content={TariffHome()} 
        />

        {/* Empty Card to maintain the layout */}
        <CardHome className="col-span-6 md:col-span-6 lg:col-span-4" content={Recommendation()} />
      </div>
    </div>
  );
};

export default HomePage;
