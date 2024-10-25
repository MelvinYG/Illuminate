import SolarProdChart from "../../components/solarProdChart/solarProdChart"
import TariffGraph from "../../components/tariffChart/tariffChart"

const AnalyticsPage = () => {
  return (
    <div className="flex flex-col gap-36 px-4 pt-16 pb-64">
        <TariffGraph/>
        <SolarProdChart/>    
    </div>
  )
}

export default AnalyticsPage