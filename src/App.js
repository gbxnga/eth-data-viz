// App.js

import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";

import Table from "./Table";
import "./App.css";

import DataTable from "react-data-table-component";

import RelativeTime from "react-relative-time";
import rd3 from "react-d3-library";

import { LineChart, d3, BarChart } from "react-d3-components";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
// const LineChart = rd3.LineChart;
// var LineChart = LineChart;
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import LineChartt from "./LineChartt";
import LineChartWithLabel from "./LineChartWithLabel";
const RD3Component = rd3.Component;
function App() {
  /* 
    - Columns is a simple array right now, but it will contain some logic later on. It is recommended by react-table to memoize the columns data
    - Here in this example, we have grouped our columns into two headers. react-table is flexible enough to create grouped table headers
  */
  const columns = [
    {
      name: "Token",
      selector: (row) => {
        if (
          row.contract_address.toLowerCase() ==
          "0xdac17f958d2ee523a2206206994597c13d831ec7".toLowerCase()
        )
          return <img src="usdt_logo.png" width={20} />;

        if (
          row.contract_address.toLowerCase() ==
          "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48".toLowerCase()
        )
          return <img src="usdc_logo.png" width={20} />;

        if (
          row.contract_address.toLowerCase() ==
          "0x6B175474E89094C44Da98b954EedeAC495271d0F".toLowerCase()
        )
          return <img src="dai_logo.png" width={20} />;

        if (
          row.contract_address.toLowerCase() ==
          "0x4Fabb145d64652a948d72533023f6E7A623C7C53".toLowerCase()
        )
          return <img src="busd_logo_2.png" width={20} />;
      },
      width: "70px",
    },
    {
      name: "Amount",
      selector: (row) => {
        if (
          row.contract_address.toLowerCase() ==
          "0x4Fabb145d64652a948d72533023f6E7A623C7C53".toLowerCase()
        )
          return (row.value / 1000000000000000000)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (
          row.contract_address.toLowerCase() ==
          "0x6B175474E89094C44Da98b954EedeAC495271d0F".toLowerCase()
        )
          return (row.value / 1000000000000000000)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return (row.value / 1000000)
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      width: "180px",
    },
    {
      name: "From",
      selector: (row) => row.from_address,
    },
    {
      name: "To",
      selector: (row) => row.to_address,
    },
    {
      name: "Transaction Hash",
      selector: (row) => (
        <a
          href={`https://etherscan.io/tx/${row.event_tx_hash}`}
          target="_blank"
        >
          {row.event_tx_hash}
        </a>
      ),
    },
    {
      name: "Block Number",
      selector: (row) => row.event_block_number,
      width: "150px",
    },
    {
      name: "Time",
      selector: (row) => (
        <RelativeTime value={row.event_block_time} titleformat="iso8601" />
      ),
      width: "150px",
    },
  ];
  const columnSwap = [
    {
      name: "Direction 0",
      selector: ({ token_0_direction: direction }) => {
        return (
          <Alert variant={direction == "IN" ? "success": "danger"} style={{ padding: 2, borderRadius: 2 }}>
            {direction}
          </Alert>
        );
      },
      width: "100px",
    },
    {
      name: "Amount 0",
      selector: (row) => {
        return `${row.token_0_amount}`;
      },
      width: "200px",
    },
    {
      name: "Token 0",
      selector: (row) => {
        return row.token_0_symbol;
      },
      width: "100px",
    },
    {
      name: "Direction 1",
      selector: ({ token_1_direction: direction }) => {
        return (
          <Alert variant={direction == "IN" ? "success": "danger"} style={{ padding: 2, borderRadius: 2 }}>
            {direction}
          </Alert>
        );
      },
      width: "100px",
    },
    {
      name: "Amount 1",
      selector: (row) => {
        return `${row.token_1_amount}`;
      },
      width: "200px",
    },
    {
      name: "Token 1",
      selector: (row) => {
        return row.token_1_symbol;
      },
      width: "100px",
    },
    {
      name: "From",
      selector: (row) => row.sender_address,
    },
    {
      name: "To",
      selector: (row) => row.to_address,
    },
    {
      name: "Transaction Hash",
      selector: (row) => (
        <a href={`https://etherscan.io/tx/${row.tx_hash}`} target="_blank">
          {row.tx_hash}
        </a>
      ),
    },
    {
      name: "Block Number",
      selector: (row) => row.evt_block_number,
      width: "150px",
    },
    {
      name: "Time",
      selector: (row) => (
        <RelativeTime value={row.evt_block_time} titleformat="iso8601" />
      ),
      width: "150px",
    },
  ];
  const columnss = useMemo(
    () => [
      {
        // first group - TV Show
        Header: "Token Transfers",
        // First group columns
        columns: [
          {
            Header: "Time",
            accessor: "event_block_time",
          },
          {
            Header: "Amount",
            accessor: "value",
          },
        ],
      },
      {
        // Second group - Details
        Header: "Details",
        // Second group columns
        columns: [
          {
            Header: "Block Number",
            accessor: "event_block_number",
          },
          {
            Header: "Contract",
            accessor: "contract_address",
          },
          {
            Header: "From",
            accessor: "from_address",
          },
          {
            Header: "To",
            accessor: "to_address",
          },
        ],
      },
    ],
    []
  );

  // data state to store the TV Maze API data. Its initial value is an empty array
  const [data, setData] = useState([]);
  const [transactionsPerDay, setTransactionsPerDayData] = useState([]);
  console.log({ transactionsPerDay });
  const [blockUtilization, setBlockUtilization] = useState([]);
  console.log({ blockUtilization });
  const [stableCoinTransfersPerDay, setStableCoinTransfersPerDay] = useState(
    []
  );
  const [tokenSwapEvents, setTokenSwapEvents] = useState([]);

  const [screenWidth] = useState(window.innerWidth);

  // Using useEffect to call the API once mounted and set the data
  useEffect(() => {
    (async () => {
      const result = await axios(
        "https://dood7td0ik.execute-api.eu-west-1.amazonaws.com/tokens/transfers"
      );
      console.log({ result });
      setData(result.data.tokenTransfers);
      // setXScale(d3.time.scale().domain([new Date(2015, 2, 5), new Date(2015, 2, 26)]).range([0, 400 - 70]))
    })();

    (async () => {
      const result = await axios(
        "https://dood7td0ik.execute-api.eu-west-1.amazonaws.com/blocks/stats"
      );
      console.log({ result });
      setTransactionsPerDayData(result.data.transactionsPerDay);
      setBlockUtilization(result.data.blockUtilization);
      setStableCoinTransfersPerDay(result.data.stableCoinTransfersPerDay);
      setTokenSwapEvents(result.data.tokenSwapEvents);
    })();

    console.log({ screenWidth });
  }, []);

  return (
    <Container fluid>
      <div
        style={{
          textAlign: "center",
          margingTop: 30,
          marginBottom: 30,
          paddingTop: 15,
        }}
      >
        <img src="eth-logo.png" width={50} />
        <h3 style={{ marginTop: 15 }}>
          Ethereum Data and Stablecoins Dashboard
        </h3>
        <p>
          Charts and visualization of Ethereum on chain data and smart contracts
          data.
        </p>
      </div>
      {/* <Alert
        variant="info"
        style={{ marginLeft: -15, marginRight: -15, textAlign: "center" }}
      >
        <Alert.Heading>Ethereum Data and Stablecoins Dashboard</Alert.Heading>
        <p>
          Charts and visualization of Ethereum on chain data and smart contracts
          data.
        </p>
      </Alert> */}
      <Row>
        <Col xs={12} md={4} style={{ overflow: "scroll", marginBottom: 15 }}>
          {/* <BarChart
          data={[
            {
              label: "somethingA",
              values: [
                { x: "SomethingA", y: 10 },
                { x: "SomethingB", y: 4 },
                { x: "SomethingC", y: 3 },
              ],
            },
            {
              label: "somethingB",
              values: [
                { x: "SomethingA", y: 6 },
                { x: "SomethingB", y: 8 },
                { x: "SomethingC", y: 5 },
              ],
            },
            {
              label: "somethingC",
              values: [
                { x: "SomethingA", y: 6 },
                { x: "SomethingB", y: 8 },
                { x: "SomethingC", y: 5 },
              ],
            },
          ]}
          width={400}
          height={400}
          margin={{ top: 10, bottom: 50, left: 50, right: 10 }}
        /> */}
          <div
            style={{
              border: "0.5px solid #666",
              borderRadius: 3,
              padding: 15,
              backgroundColor: "white",
            }}
          >
            <h3>Transactions per day</h3>
            <RD3Component
              data={LineChartWithLabel(
                transactionsPerDay.length > 0
                  ? transactionsPerDay
                      .filter((t) => t.date != null)
                      .map((t) => {
                        let date = new Date(t["date"]);
                        if (date.getFullYear() < 2010) {
                          date = new Date();
                        }
                        return {
                          y: t["number of transactions"] / 1000,
                          x: date,
                        };
                      })
                  : [{ x: 0, y: 3 }],
                {
                  x: (d) => d.x,
                  y: (d) => d.y,
                  yLabel: "Number of transactions (per thousand)",
                  width: screenWidth > 600 ? 700 : 500,
                  height: 500,
                  color: "green",
                }
              )}
            />
          </div>
          {/* <LineChart
            data={[
              {
                label: "Number of Ethereum transactions per day",
                values:
                  transactionsPerDay.length > 0
                    ? transactionsPerDay
                        .filter((t) => t.date != null)
                        .map((t) => {
                          let date = new Date(t["date"]);
                          if (date.getFullYear() < 2010) {
                            date = new Date();
                          }
                          return {
                            y: t["number of transactions"] / 1000,
                            x: date,
                          };
                        })
                    : [{ x: 0, y: 3 }],
              },
            ]}
            xAxis={{ innerTickSize: 6, label: "Date" }}
            yAxis={{ label: "Number of Transactions" }}
            shapeColor={"red"}
            width={600}
            height={400}
            margin={{ top: 10, bottom: 50, left: 50, right: 10 }}
          /> */}
        </Col>
        <Col xs={12} md={4} style={{ overflow: "scroll", marginBottom: 15 }}>
          <div
            style={{
              border: "0.5px solid #666",
              borderRadius: 3,
              padding: 15,
              backgroundColor: "white",
            }}
          >
            <h3>Network Utilization</h3>
            <RD3Component
              data={LineChartWithLabel(
                blockUtilization.length > 0
                  ? blockUtilization
                      .filter((t) => t.date != null)
                      .map((t) => {
                        let date = new Date(t["date"]);
                        if (date.getFullYear() < 2010) {
                          date = new Date();
                        }
                        return {
                          y: t.gas_utilization * 100,
                          x: date,
                        };
                      })
                  : [{ x: 0, y: 3 }],
                {
                  x: (d) => {
                    console.log("d.date", d.x);
                    return d.x;
                  },
                  y: (d) => d.y,
                  yLabel: "Block Utilization (%)",
                  width: screenWidth > 600 ? 700 : 500,
                  height: 500,
                  color: "steelblue",
                }
              )}
            />
          </div>
          {/* <LineChart
            data={[
              {
                label: "Number of Ethereum transactions per day",
                values:
                  blockUtilization.length > 0
                    ? blockUtilization
                        .filter((t) => t.date != null)
                        .map((t) => {
                          let date = new Date(t["date"]);
                          if (date.getFullYear() < 2010) {
                            date = new Date();
                          }
                          return {
                            y: t.gas_utilization * 100,
                            x: date,
                          };
                        })
                    : [{ x: 0, y: 3 }],
              },
            ]}
            xAxis={{ innerTickSize: 6, label: "Date" }}
            yAxis={{ label: "Number of Transactions" }}
            shapeColor={"red"}
            width={600}
            height={400}
            margin={{ top: 10, bottom: 50, left: 50, right: 10 }}
          /> */}
        </Col>
        <Col xs={12} md={4} style={{ overflow: "scroll", marginBottom: 15 }}>
          <div
            style={{
              border: "0.5px solid #666",
              borderRadius: 3,
              padding: 15,
              backgroundColor: "white",
            }}
          >
            <h3>Total Stablecoin Transfers Value</h3>
            <RD3Component
              data={LineChartWithLabel(
                stableCoinTransfersPerDay.length > 0
                  ? stableCoinTransfersPerDay
                      .filter((t) => t.date != null)
                      .map((t) => {
                        let date = new Date(t["date"]);
                        if (date.getFullYear() < 2010) {
                          date = new Date();
                        }
                        return {
                          y: t["amount transferred"] / 1000000000000,
                          x: date,
                        };
                      })
                  : [{ x: 0, y: 3 }],
                {
                  x: (d) => {
                    console.log("d.date", d.x);
                    return d.x;
                  },
                  y: (d) => d.y,
                  yLabel: "Amount Transferred ($) per million",
                  width: screenWidth > 600 ? 700 : 500,
                  height: 500,
                  color: "brown",
                }
              )}
            />
          </div>
          {/* <LineChart
            data={[
              {
                label: "Number of Ethereum transactions per day",
                values:
                  blockUtilization.length > 0
                    ? blockUtilization
                        .filter((t) => t.date != null)
                        .map((t) => {
                          let date = new Date(t["date"]);
                          if (date.getFullYear() < 2010) {
                            date = new Date();
                          }
                          return {
                            y: t.gas_utilization * 100,
                            x: date,
                          };
                        })
                    : [{ x: 0, y: 3 }],
              },
            ]}
            xAxis={{ innerTickSize: 6, label: "Date" }}
            yAxis={{ label: "Number of Transactions" }}
            shapeColor={"red"}
            width={600}
            height={400}
            margin={{ top: 10, bottom: 50, left: 50, right: 10 }}
          /> */}
        </Col>
      </Row>
      <Row>
        <Col xs={12} style={{ overflow: "scroll", marginBottom: 15 }}>
          <div
            style={{
              border: "0.5px solid #666",
              borderRadius: 3,
              padding: 15,
              backgroundColor: "white",
            }}
          >
            <h3>Token Transfers on Ethereum</h3>
            <DataTable columns={columns} data={data} pagination />
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12} style={{ overflow: "scroll", marginBottom: 15 }}>
          <div
            style={{
              border: "0.5px solid #666",
              borderRadius: 3,
              padding: 15,
              backgroundColor: "white",
            }}
          >
            <h3>Token Swaps on 🦄 Uniswap V2</h3>
            <DataTable columns={columnSwap} data={tokenSwapEvents} pagination />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
export default App;
