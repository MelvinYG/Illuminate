import CardHome from "./components/cardHome/cardHome"
import NavBar from "./components/navBar/navBar"

function App() {
  const currentHour = new Date().getHours();

  const greeting = currentHour < 12 ? "Morning" : "Evening";

  const mainCard = (
    <div className="">
    <div className="mainCard-left">
      <div className="text-2xl font-bold">{`Good ${greeting}!`}</div>
      <div className="">All systems are working well today.</div>
    </div>
    </div>

  );

  return (
    <>
      <NavBar/>

      <div className="px-20 py-10 grid grid-cols-6 grid-rows-2 gap-4">
        <CardHome className="card-main col-span-4" content={mainCard}/>
        <CardHome className="card-weather col-span-2"/>
        <CardHome className=""/>
        <CardHome className=""/>
      </div>
    </>
  )
}

export default App
