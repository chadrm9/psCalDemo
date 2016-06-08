$(document).ready(function(e) {

  // Create datepickers
  $('#startDate').datepicker();
  $('#output').datepicker().hide();

  $('form').submit(function(e) {
    // Prevent page refresh
    e.preventDefault();

    // Start Date object
    var startDate = $('#startDate').datepicker("getDate");
    var numberDays = $('#numberDays').val();

    // Calculate End Date object
    var endDate = calcEndDate(startDate, numberDays);

    // Count number of sequential months
    var seqMonths = countSeqMonths(startDate, endDate);

    // Modify datepicker options and show
    $('#output').datepicker("option", {
      numberOfMonths: [seqMonths, 1],
      minDate: startDate,
      maxDate: endDate
    }).show();
  });
});

// calcEndDate: Returns end Date object from moment added days
function calcEndDate(startDate, numberDays) {
  var startMoment = moment(startDate);
  console.log(startMoment.format());
  var endMoment = moment(startDate).add(numberDays, 'days');
  console.log(endMoment.format());
  return endMoment.toDate();
}

// countSeqMonths: Returns count of distinct months from moment range iteration
function countSeqMonths(startDate, endDate) {
  var seqMonths = 1;
  var startMoment = moment(startDate);
  var endMoment = moment(endDate);

  var lastMonth = startMoment.format('MMYYYY');
  var lastMoment = startMoment;
  var range = moment.range(startMoment, endMoment);
  range.by('days', function(moment) {
    if(moment.isAfter(lastMoment, 'month') && moment.format('MMYYYY') !== lastMonth) {
      seqMonths++;
      lastMonth = moment.format('MMYYYY');
    }
  });
  console.log(seqMonths);
  return seqMonths;
}