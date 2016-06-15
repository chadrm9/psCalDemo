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

    var countryCode = $('#countryCode').val();
    var holidays = [];
    $.getJSON("http://holidayapi.com/v1/holidays",
      {
        country: countryCode,
        year: "2008"
      }, function(response) {
        $.each(response.holidays, function() {
          $.each(this, function() {
            holidays.push({date: new Date(this.date), name: this.name});
          });
        });

        // Modify datepicker options and show
        $('#output').datepicker("option", {
          numberOfMonths: [seqMonths, 1],
          minDate: startDate,
          maxDate: endDate,

          // Add holidays
          beforeShowDay: function (date) {
            var holidayMoment, todayMoment;
            for (var i = 0; i < holidays.length; ++i) {
              holidayMoment = moment(holidays[i].date);

              // Correct (shift) beforeShowDay
              todayMoment = moment(date).subtract(1, 'day');
              if (holidayMoment.isSame(todayMoment, 'day')) {
                
                // Attach holiday class and name tooltip
                return [true, 'holiday', holidays[i].name];
              }
            }
            return [true, ''];
          }
        }).show();

        // Hide all weeks out of range for single month
        $('#output div table tbody tr').hide();
        $('#output div table tbody tr').each(function() {
          if( $(this).children('td').not('.ui-state-disabled').length > 0 ) {
            $(this).show();
          }
        });

        // Hide all weeks out of range for multiple months
        $('#output div div table tbody tr').hide();
        $('#output div div table tbody tr').each(function() {
          if( $(this).children('td').not('.ui-state-disabled').length > 0 ) {
            $(this).show();
          }
        });
    })
    //Could not retrieve holidays
    .error(function() { alert("Error retrieving holidays!"); })
  });

});

// calcEndDate: Returns end Date object from moment added days
function calcEndDate(startDate, numberDays) {
  var startMoment = moment(startDate);
  var endMoment = moment(startDate).add(numberDays, 'days');
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
  return seqMonths;
}