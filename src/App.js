// App.js

import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";

import Table from "./Table";
import "./App.css";

import DataTable  from "react-data-table-component"

function App() {
  /* 
    - Columns is a simple array right now, but it will contain some logic later on. It is recommended by react-table to memoize the columns data
    - Here in this example, we have grouped our columns into two headers. react-table is flexible enough to create grouped table headers
  */
 const columns = [
  {
      name: 'Token',
      selector: row => {
        if(row.contract_address.toLowerCase() == "0xdac17f958d2ee523a2206206994597c13d831ec7".toLowerCase()) 
          return <img src="usdt_logo.png" width={20} />

        if(row.contract_address.toLowerCase() == "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48".toLowerCase()) 
          return <img src="usdc_logo.png" width={20} />

      },
      width: "70px"
  },
  {
      name: 'Amount',
      selector: row => (row.value / 18).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      width: "180px"
  },
  {
      name: 'From',
      selector: row => row.from_address,
  },
  {
      name: 'To',
      selector: row => row.to_address,
  },
  {
      name: 'Block Number',
      selector: row => row.event_block_number,
  },
  {
      name: 'Time',
      selector: row => row.event_block_time,
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

  // Using useEffect to call the API once mounted and set the data
  useEffect(() => {
    (async () => {
      const result = await axios("https://dood7td0ik.execute-api.eu-west-1.amazonaws.com/tokens/transfers");
      console.log({ result })
      setData(result.data.tokenTransfers);
    })();
  }, []);

  return (
    <div className="App">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
export default App;