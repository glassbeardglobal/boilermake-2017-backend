var total = 0;
var hist;
var costPerFail = 300;

$(document).ready(function() {
  var userid = Cookies.get('userid');
  var data = $.ajax({
    url: "api/users/" + userid + "/allhistory",
  }).done(parseData);
});

function renderPrice(selector, price) {
  if (price % 100 == 0)
    $(selector).text("$" + (Math.floor(price / 100) + ".00"));
  else
    $(selector).text("$" + (Math.floor(price / 100) + "." + (price % 100)));
}

function sameDay(a, b) {
  return a.setHours(0,0,0,0) == b.setHours(0,0,0,0);
}

function parseData(d) {
  var user = d.user;
  var history = d.history;
  $(".email").text(user.email);
  /*hist = user.browsingHistory;
  hist.forEach(function(h) {
    if (h.blacklisted)
      total += user.costPerFail
  });*/
  renderPrice("#price-ticker", total);
  renderPrice("#sub-price-ticker", user.costPerFail);

  history.sort(function(a, b) {
    return new Date(a) > new Date(b);
  });

  //var grouped = _.groupBy(history, (result) => moment(result, 'DD/MM/YYYY').startOf('isoWeek'));
  var start = new Date(history[0]);
  var present = new Date(history[history.length-1]);
  var weeks = Math.round((present-start) / 604800000);
  var grouped = [];
  history.forEach(function(h, i) {
    if (i != 0 && sameDay(new Date(grouped[grouped.length-1].date), new Date(h)))
      grouped[grouped.length-1].count += 1;
    else
      grouped.push({
        date: h,
        count: 1,
        cost: 0
      });
  });

  var hg = history.map(function(d) {
    return new Date(d);
  });
  var groupedResults = _.groupBy(hg, function(result) {
    return moment(result, 'DD/MM/YYYY').startOf('isoWeek')
  });

  console.log(groupedResults);

  // Function to Accumulate cost here

  renderCalendar(grouped);
  // renderChord(chords, inverseMap);
  // renderBars(freqArr);
}
