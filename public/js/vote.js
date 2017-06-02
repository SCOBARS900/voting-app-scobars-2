
$('.voteButtons').click(function() {
    var pollNameId = $(this).attr('name');
    $('#polloutput').val(pollNameId);
});

var graphicData = $("#votesNumberArray").html();
var graphicDataSplited = graphicData.split(",");

var graphicLabel = $("#votesTitleArray").html();
var graphicLabelSplited = graphicLabel.split(",");


var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: graphicLabelSplited,
        datasets: [{
            label: 'Graphic',
            data: graphicDataSplited,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ], 
        }]   
    },
    options: {
        
    }
});