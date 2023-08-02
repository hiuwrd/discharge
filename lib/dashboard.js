/* globals Chart:false, feather:false */
$(document).ready(function(){

  var beki = "./data/Beki_Discharge_2023_07_20.csv";
  var buridihing = "./data/Buridihing_Discharge_2023-07-20.csv";
  var jiadhal = "./data/Jiadhal_Discharge_2023-07-20.csv";

  //chart variable for common graph 2D AREA
  var chart;

  //load graph for a river basin
  function graphLoad(dataFile){

    $.ajax({
      type: "GET",
      url: dataFile,
      dataType: "text",
      success: function(ddata) {

        //ajax data type doesnot support csv, jquery-csv library parser loaded
        loadedData = $.csv.toObjects(ddata);
    
        // empty lists for our data
        let data =   [];
        let labels = [];

        // use a for-loop to load the data from the
        // file into our lists
        for (let i=0; i<loadedData.length; i++) {
          //console.log(loadedData[i].Time);
          
          let discharge = loadedData[i].Discharge;
          let dtime = loadedData[i].Time;
          //splitting timestamp as date and time, using only time values in x-axis
          let spltime = dtime.split(" ")
          let hourly = spltime[1]
          
          // push the data
          data.push(discharge);
          labels.push(hourly);
        }

        $('#myTable').DataTable( {
            destroy: true,
            searching: false,
            lengthChange: false,
            data: loadedData,
            columns: [
                { data: 'Time' },
                { data: 'Discharge' }
            ]

        } );

        //highlighting the max discharge in plot
        const max = Math.max(...data);
        
        //background color storage
        const bgc = []
        const ptrad = []
        const highestValColor = data.map((datapoint, index) => {

          const color = Number(datapoint) === max ? 'rgba(224, 100, 34, 0.8)' : '#3e95cd';
          const pointrad = Number(datapoint) === max ? '8' : '3';
          
          bgc.push(color);
          ptrad.push(pointrad);

        })

        const config = {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              data: data,
              label: "Discharge",
              backgroundColor: "#3e95cd",
              borderColor: "#3e95cd",
              fill: false,
              pointBackgroundColor: bgc,
              pointBorderColor: bgc,
              pointRadius: ptrad,
              pointHoverRadius: ptrad,
              pointStyle: 'circle'
            }]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  align: 'center',
                  text: "Time (in hour)",
                  color: '#4287f5',
                  font: {
                    family: 'Sans Serif',
                    size: 14,
                    weight: 'bold',
                    lineHeight: 1.2,
                  },
                  padding: {top: 10, left: 0, right: 0, bottom: 0}
                },
                time: {
                  unit: 'hour'
                }
              },
              y: {
                display: true,
                title: {
                  display: true,
                  align: 'center',
                  text: "Discharge rate (cubic meters per second)",
                  color: '#4287f5',
                  font: {
                    family: 'Sans Serif',
                    size: 14,
                    weight: 'bold',
                    lineHeight: 1.2,
                  },
                  padding: {top: 0, left: 0, right: 0, bottom: 10}
                }
              }
            },
            plugins: { 
              legend: {
                display: true
              },
              title: {
                  display: true,
                  text: 'Hourly Runoff Rational method',
                  color: '#4287f5',
                  font: {
                    family: 'Sans Serif',
                    size: 18,
                    lineHeight: 1.2,
                  }
              }
            }
          }
        };


        // with all that done, we can create our chart!
        chart = new Chart(document.getElementById('myChart'), config);

      }
    
    });
  }

  //call graphs for resp. river basins
  $('#beki').click(function() {
        $('button').removeClass('active');
        $('#beki').addClass('active');
        chart.destroy();
        graphLoad(beki);
  });

  $('#buri').click(function() {
        $('button').removeClass('active');
        $('#buri').addClass("active");
        chart.destroy();
        graphLoad(buridihing);
  });

  $('#jiad').click(function() {
        $('button').removeClass('active');
        $('#jiad').addClass("active");
        chart.destroy();
        graphLoad(jiadhal);
  });

  //default load for beki river
  graphLoad(beki);

});