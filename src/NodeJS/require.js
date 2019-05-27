function init()
{
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
}

function drawChart() {
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "https://sitbh2019.cfapps.eu10.hana.ondemand.com/show", true);

    ajax.send();

    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {

            var jsonData = JSON.parse(ajax.responseText);
            console.log(jsonData);

            var array = jsonData.value;
            var dataArray = [['indice', 'Variação']];
            for (var i = 0; i < array.length; i++) {
                var row = [i.toString(), parseInt(array[i])];
                dataArray.push(row);
            }

            console.log(dataArray);

            var data = google.visualization.arrayToDataTable(dataArray);

            console.log(dataArray);

            var options = {
                title: 'Valores analógicos lidos',
                curveType: 'function',
                legend: { position: 'bottom' }
            };

            var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

            chart.draw(data, options);
        }
    }
}