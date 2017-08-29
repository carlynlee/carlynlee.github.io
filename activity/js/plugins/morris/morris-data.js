// Morris.js Charts sample data for SB Admin template


$(function() {

    //GET all starred segments
    //TODO: set limit on last N activities
    $.ajax({
        type: "GET",
        url: "https://www.strava.com/api/v3/segments/starred",
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + "a1a5ce7129a73ebfd5d7ccf84db5a723444cc728");
        },
        success: function (data_starred) {


            data_starred.forEach(function(segment) {
                $.ajax({
                    type: "GET",
                    url: "https://www.strava.com/api/v3/segment_efforts/"+segment.athlete_pr_effort.id,
                    beforeSend: function (xhr, settings) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + "a1a5ce7129a73ebfd5d7ccf84db5a723444cc728");
                    },
                    success: function (segment_details) {
                        var icon="";
                        if (segment_details.segment.activity_type.toLowerCase()=="ride")
                            icon="fa fa-fw fa-bicycle";

                        else if(segment_details.segment.activity_type.toLowerCase()=="run")
                            icon="fa fa-fw fa-circle";

                        else if(segment_details.segment.activity_type.toLowerCase()=="swim")
                            icon="fa fa-fw fa-tint";

                        var i = document.createElement("i");
                        i.className = icon;

                         var row = $("<tr />")
                         $("#starred").append(row);  
                     //for each starred segment show my effort: distance, grade, ranking
                        row.append($("<td>" +  segment_details.segment.name + " </td>").append(i));
                        row.append($("<td>" +  segment_details.segment.distance+ "</td>"));
                        row.append($("<td>" +  segment_details.segment.average_grade+ "</td>"));
                        row.append($("<td>" +  segment_details.athlete_segment_stats.pr_elapsed_time+ "</td>"));
                        row.append($("<td>" +  segment_details.athlete_segment_stats.effort_count+ "</td>"));
                    }
                });
            });
        }
    });

    //GET all activities and populate charts
    //TODO: set limit on last N activities
    $.ajax({
      type: "GET",
      url: "https://www.strava.com/api/v3/athlete/activities",
      beforeSend: function (xhr, settings) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + "a1a5ce7129a73ebfd5d7ccf84db5a723444cc728");
      },
      success: function (data_strava) {


        data_ride=[];
        ride_num=0;
        run_num=0;
        swim_num=0;

        var news = document.getElementsByClassName("list-group")[0];


        data_strava.some(function(element,el_i) {
            var icon="";
            if (element.type.toLowerCase()=="ride")
            {
                icon="fa fa-fw fa-bicycle"
                ride_num=ride_num+1;
                data_ride.push(  (({ start_date, elev_high, elev_low, total_elevation_gain }) => ({ start_date, elev_high, elev_low, total_elevation_gain }))(element)  );
            }
            if (element.type.toLowerCase()=="run")
            {
                icon="fa fa-fw fa-circle";
                run_num=run_num+1;
            }

            if (element.type.toLowerCase()=="swim")
            {
                icon="fa fa-fw fa-tint";
                swim_num=swim_num+1;
            }    
            if (news!=undefined)
            {
                var a = document.createElement('a');
                a.href="https://www.strava.com/activities/" +element.id;
                a.className="list-group-item";
                a.target="new"
                var span = document.createElement('span');
                span.className="badge"
                span.innerHTML=element.start_date.split("T")[0];
                var i = document.createElement("i");
                i.className = icon;
                a.innerHTML = element.name + " ";
                a.appendChild(span);
                a.appendChild(i);
                news.appendChild(a);

            }
            
            return el_i ==15;


        });



         // Area Chart
        Morris.Area({
            element: 'morris-area-chart',
            data: data_ride,
            xkey: 'start_date',
            ykeys: [ 'elev_low', 'elev_high','total_elevation_gain'],
            labels: ['Elev. Low (m)', 'Elev. High (m)', 'total elevation gain (m)'],
            pointSize: 2,
            hideHover: 'auto',
            resize: true
        });



        // Donut Chart
        Morris.Donut({
            element: 'morris-donut-chart',
            data: [{
                label: "Running",
                value: run_num
            }, {
                label: "Swimming",
                value: swim_num
            }, {
                label: "Cycling",
                value: ride_num
            }],
            resize: true
        });


        // Flot Line Charts - Multiple Axes - With Data
        average_speed=[];distance=[];
        data_strava.forEach(function(element) {
            average_speed.push(  (({ start_date, average_speed }) => ([ Date.parse(start_date), average_speed ]))(element)  );
            distance.push(  (({ start_date, distance }) => ([ Date.parse(start_date), distance ]))(element)  );
        });
        function toKm(v, axis) {
            return v.toFixed(axis.tickDecimals)/1000 + "km";
        }
        function doPlot(position) {
            $.plot($("#flot-multiple-axes-chart"), [{
                data: average_speed,
                label: "Average Speed (m/sec)"
            }, {
                data: distance,
                label: "Average Distance",
                yaxis: 2
            }], {
                xaxes: [{
                    mode: 'time'
                }],
                yaxes: [{
                    min: 0
                }, {
                    // align if we are to the right
                    alignTicksWithAxis: position == "right" ? 1 : null,
                    position: position,
                    tickFormatter: toKm
                }],
                legend: {
                    position: 'sw'
                },
                grid: {
                    hoverable: true //IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s on ride %x was %y",
                    xDateFormat: "%y-%0m-%0d",

                    onHover: function(flotItem, $tooltipEl) {
                        // console.log(flotItem, $tooltipEl);
                    }
                }

            });
        }

        doPlot("right");

        $("button").click(function() {
            doPlot($(this).text());
        });
      }
    });
//end of ajax call to strava


    // Line Chart
    Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'morris-line-chart',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: [{
            d: '2012-10-01',
            visits: 802
        }, {
            d: '2012-10-02',
            visits: 783
        }, {
            d: '2012-10-03',
            visits: 820
        }, {
            d: '2012-10-04',
            visits: 839
        }, {
            d: '2012-10-05',
            visits: 792
        }, {
            d: '2012-10-06',
            visits: 859
        }, {
            d: '2012-10-07',
            visits: 790
        }, {
            d: '2012-10-08',
            visits: 1680
        }, {
            d: '2012-10-09',
            visits: 1592
        }, {
            d: '2012-10-10',
            visits: 1420
        }, {
            d: '2012-10-11',
            visits: 882
        }, {
            d: '2012-10-12',
            visits: 889
        }, {
            d: '2012-10-13',
            visits: 819
        }, {
            d: '2012-10-14',
            visits: 849
        }, {
            d: '2012-10-15',
            visits: 870
        }, {
            d: '2012-10-16',
            visits: 1063
        }, {
            d: '2012-10-17',
            visits: 1192
        }, {
            d: '2012-10-18',
            visits: 1224
        }, {
            d: '2012-10-19',
            visits: 1329
        }, {
            d: '2012-10-20',
            visits: 1329
        }, {
            d: '2012-10-21',
            visits: 1239
        }, {
            d: '2012-10-22',
            visits: 1190
        }, {
            d: '2012-10-23',
            visits: 1312
        }, {
            d: '2012-10-24',
            visits: 1293
        }, {
            d: '2012-10-25',
            visits: 1283
        }, {
            d: '2012-10-26',
            visits: 1248
        }, {
            d: '2012-10-27',
            visits: 1323
        }, {
            d: '2012-10-28',
            visits: 1390
        }, {
            d: '2012-10-29',
            visits: 1420
        }, {
            d: '2012-10-30',
            visits: 1529
        }, {
            d: '2012-10-31',
            visits: 1892
        }, ],
        // The name of the data record attribute that contains x-visitss.
        xkey: 'd',
        // A list of names of data record attributes that contain y-visitss.
        ykeys: ['visits'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Visits'],
        // Disables line smoothing
        smooth: false,
        resize: true
    });

    // Bar Chart
    Morris.Bar({
        element: 'morris-bar-chart',
        data: [{
            device: 'iPhone',
            geekbench: 136
        }, {
            device: 'iPhone 3G',
            geekbench: 137
        }, {
            device: 'iPhone 3GS',
            geekbench: 275
        }, {
            device: 'iPhone 4',
            geekbench: 380
        }, {
            device: 'iPhone 4S',
            geekbench: 655
        }, {
            device: 'iPhone 5',
            geekbench: 1571
        }],
        xkey: 'device',
        ykeys: ['geekbench'],
        labels: ['Geekbench'],
        barRatio: 0.4,
        xLabelAngle: 35,
        hideHover: 'auto',
        resize: true
    });


});


