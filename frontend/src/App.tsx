import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RankingTable } from "./components/charts/rankings-region";
import MapView from "./components/charts/map";
import TimeChart from "./components/charts/time-chart";
import { CustomPieChart } from "./components/charts/custom-pi-chart";
import { Header } from "./components/Header";
import { Separator } from "@/components/ui/separator";
// import { SectorPestleTopicChart } from "./components/charts/region-stacked-pi";

export default function Dashboard() {
  return (
    <div className="flex h-screen flex-col overflow-x-hidden p-4">
      <Header />
      <Separator />
      {/* Main Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Charts Grid */}

        <div className="flex w-full flex-col justify-evenly gap-8 lg:grid lg:grid-cols-4">
          <div className="col-span-1 lg:col-span-4">
            <TimeChart
              key="sector"
              // searchParams={[{ key: "country", value: "India" }]}
            />
          </div>
          {/*
          <SectorPestleTopicChart />
           */}
          <Separator className="col-span-4" />
          <section id="insights" className="col-span-4 flex flex-col gap-8 lg:grid lg:grid-cols-4">
            <div className="col-span-4 flex flex-col gap-8 lg:grid lg:grid-cols-3">
              <Card>
                <CardContent>
                  <CardHeader className="flex flex-1 flex-col">
                    <CardTitle>Insights by Sector</CardTitle>
                    <CardDescription>Total Insights by Sector</CardDescription>
                  </CardHeader>{" "}
                  <CustomPieChart
                    endpoint="rankings/sector"
                    centerText="By Sectors"
                    keyName="sector"
                    limit={10}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <CardHeader className="flex flex-1 flex-col">
                    <CardTitle>Insights by Topic</CardTitle>
                    <CardDescription>Total Insights by Topic</CardDescription>
                  </CardHeader>{" "}
                  <CustomPieChart
                    endpoint="rankings/topic"
                    centerText="By Topic"
                    keyName="topic"
                    limit={10}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <CardHeader className="flex flex-1 flex-col">
                    <CardTitle>Insights by Pestle</CardTitle>
                    <CardDescription>Total Insights by Pestle</CardDescription>
                  </CardHeader>{" "}
                  <CustomPieChart
                    endpoint="rankings/pestle"
                    centerText="By Pestle"
                    keyName="pestle"
                    limit={10}
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="max-h-80 overflow-scroll">
              <CardHeader className="flex flex-1 flex-col">
                <CardTitle>Region Rankings</CardTitle>
              </CardHeader>{" "}
              <CardContent>
                <RankingTable field="region" />
              </CardContent>
            </Card>
            <Card className="max-h-80 overflow-scroll">
              <CardHeader className="flex flex-1 flex-col">
                <CardTitle>Country Rankings</CardTitle>
              </CardHeader>{" "}
              <CardContent>
                <RankingTable field="country" />
              </CardContent>
            </Card>
            <Card className="max-h-80 overflow-scroll">
              <CardHeader className="flex flex-1 flex-col">
                <CardTitle>Start Year</CardTitle>
              </CardHeader>{" "}
              <CardContent>
                <CustomPieChart
                  endpoint="rankings/start_year"
                  centerText="By Year"
                  keyName="start_year"
                  limit={10}
                />
              </CardContent>
            </Card>
            <Card className="max-h-80 overflow-scroll">
              <CardHeader className="flex flex-1 flex-col">
                <CardTitle>End Year</CardTitle>
              </CardHeader>{" "}
              <CardContent>
                <CustomPieChart
                  endpoint="rankings/end_year"
                  centerText="By Year"
                  keyName="end_year"
                  limit={10}
                />
              </CardContent>
            </Card>
          </section>
          <Separator className="col-span-4" />

          <section id="map" className="col-span-4 mb-8">
            <MapView />
          </section>
          {/*
            <Separator className="col-span-4" />
              <section id="country" className="col-span-4 mb-8"></section>
          */}
        </div>
      </div>
    </div>
  );
}
