// App.js

import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";

import Table from "./Table";
import "./App.css";

import DataTable  from "react-data-table-component"

 
import RelativeTime from 'react-relative-time'

 

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

        if(row.contract_address.toLowerCase() == "0x6B175474E89094C44Da98b954EedeAC495271d0F".toLowerCase()) 
          return <img src="dai_logo.png" width={20} />

      },
      width: "70px"
  },
  {
      name: 'Amount',
      selector: row => (row.value / 1000000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
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
      name: 'Transaction Hash',
      selector: row => <a href={`https://etherscan.io/tx/${row.event_tx_hash}`} target="_blank">{row.event_tx_hash}</a>,
  },
  {
      name: 'Block Number',
      selector: row => row.event_block_number,
      width: "150px"
  },
  {
      name: 'Time',
      selector: row => <RelativeTime value={row.event_block_time} titleformat="iso8601" /> ,
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
      <div style={{margin: 30}}>
        <h2>Token Transfers on Ethereum</h2>
        <DataTable columns={columns} data={data} pagination />
      </div>
      
    </div>
  );
}
export default App;