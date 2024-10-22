import CardHome from "./components/cardHome/cardHome";
import EnergyDoughnutChart from "./components/chart/doughnutChart";
import NavBar from "./components/navBar/navBar";
import "./App.css";
import WeatherForecast from "./components/weatherForecast/weatherForecast";

function App() {
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
    <>
      <NavBar />

      <div className="px-40 py-10 grid lg:grid-cols-6 lg:grid-rows-2 md:grid-cols-4 md:grid-rows-3 gap-4">
        <CardHome className="card-main col-span-4" content={mainCard} />
        <CardHome className="card-weather col-span-2" content={WeatherForecast()}/> 
        <CardHome className="col-span-2" />
        <CardHome className="col-span-4" />
      </div>
    </>
  );
}

export default App;
