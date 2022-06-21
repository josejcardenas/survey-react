import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {Vega} from 'react-vega';
import {Table} from 'apache-arrow';
import charts from '../apis/charts';


const Chart = () => {
  const [chartslist, setChartslist] = useState([]);
  const [chartdata, setChartdata] = useState([]);


  useEffect(() => {
    const getList = async () => {
      const list = await charts.get('/charts');
      setChartslist(list.data);
      console.log('getting list of chart(s)');
    }
    getList();
  }, []);

  useEffect(() => {
    const getData = async () => {
      // const chartd = await axios.get('http://localhost:5000/chartdata.json');
      // setChartdata(chartd.data);
      const chartd = await axios.get('http://localhost:5000/SurveyResult.arrow', { responseType: 'arraybuffer' });
      const surveys = Table.from([chartd.data]);
      console.log(`getting data for chart: ${surveys.length}`);
      setChartdata(surveys.toArray());
    }
    getData();
  },[]);

  

  // useEffect(() => {
  //   setTest({...test, chartdata, chartslist});
  // },[chartdata, chartslist]);

  const renderedList = chartslist.map((result) => {
    // return (
    //   <div key={result.id}>
    //     <Vega spec={{
    //         ...result.spec,
    //         data: [
    //           {
    //             name: "table",
    //             values:chartdata
    //           }
    //         ]
    //       }}
    //     />
    //   </div>
    // );
    return (
      <div key={result.id}>
        <Vega spec={{
            ...result.spec,
            data: [
              {
                name: "surveyresult",
                values: chartdata,
                transform: [
                  {
                    type: "aggregate",
                    fields: ["UniqueId"],
                    groupby: ["Location"],
                    ops: ["count"],
                    as: ["CountL"]
                  }
                ]
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