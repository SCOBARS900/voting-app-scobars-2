
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
                'rgba(179,236,236, 0.8)',
                'rgba(137,236,218, 0.8)',
                'rgba(59,214,198, 0.8)',
                'rgba(64,224,208, 0.8)',
                'rgba(79,91,102, 0.8)',
                'rgba(192,197,206, 0.8)',
                'rgba(101,115,126, 0.8)',
                'rgba(167,173,186, 0.8)',
                'rgba(52,61,70, 0.8)',
                
            ], 
        }]   
    },
    options: {
        
    }
});