
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
                'rgba(67, 232, 216, 0.8)',
                'rgba(204,255, 0, 0.8)',
                'rgba(255,255, 0, 0.8)',
                'rgba(255, 69, 0, 0.6)',
                'rgba(255, 165, 0, 0.8)',
                'rgba(0, 255, 0, 0.5)',
                'rgba(0,255,255, 0.5)',
                'rgba(101,115,126, 0.8)',
                'rgba(167,173,186, 0.8)',
                'rgba(52,61,70, 0.8)',
                
            ], 
        }]   
    },
    options: {
        
    }
});