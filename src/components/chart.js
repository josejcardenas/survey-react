// import axios from 'axios';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {Vega} from 'react-vega';
import charts from '../apis/charts';

const Chart = () => {
  const [chartslist, setChartslist] = useState([]);
  const [chartdata, setChartdata] = useState([]);


  useEffect(() => {
    const getList = async () => {
      const list = await charts.get('/charts');
      setChartslist(list.data);
      console.log('getting list of charts');
    }
    getList();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const chartd = await axios.get('http://localhost:5000/chartdata.json');
      console.log(chartd.data);
      setChartdata(chartd.data);
    }
    getData();
  },[]);

  

  // useEffect(() => {
  //   setTest({...test, chartdata, chartslist});
  // },[chartdata, chartslist]);

  const renderedList = chartslist.map((result) => {
    return (
      <div key={result.id}>
        <Vega spec={{
            ...result.spec,
            data: [
              {
                name: "table",
                values:chartdata
              }
            ]
          }}
        />
      </div>
    );
  });
  
  return (
    <div>
      {renderedList}
    </div>
  );
}

export default Chart;