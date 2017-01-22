var total = 0;
var hist;
var costPerFail = 300;
var userid;

$(document).ready(function() {
  userid = Cookies.get('userid');
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

function addDays(d, days) {
  var dat = new Date(d.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
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
  costPerFail = user.costPerFail;

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

  var hg = []

  grouped.forEach(function(d, i) {
    if (i == 0)
      return;
    hg.push(new Date(d.date));
  });
  var weekly = _.groupBy(hg, function(result) {
    return moment(result, 'DD/MM/YYYY').startOf('week')
  });
  var lineDat = [{ date: start, cost: 0 }];
  for (var k in weekly) {
    lineDat.push({
      date: addDays(new Date(k), 6),
      cost: Math.max(0, (5 - weekly[k].length) * costPerFail)
    });
  }
  lineDat.sort(function(a, b) {
    return a > b;
  });
  var tot = 0;
  for (var i = 0; i < lineDat.length; i++) {
    tot += lineDat[i].cost;
    lineDat[i].cost = tot;
  }
  renderPrice("#price-ticker", lineDat[lineDat.length-1].cost);

  var data2 = $.ajax({
    url: "api/users/" + userid + "/sephistory",
  }).done(function(sd) {
    var bars = sd.user.goals.map(function(d) {
      return {
        name: d.name,
        hlen: d.history.length
      };
    });
    bars.sort(function(a, b) {
      return a.hlen < b.hlen;
    })
    console.log(bars);
    renderBars(bars);
  });

  renderCalendar(grouped);
  renderLine(lineDat);
}
