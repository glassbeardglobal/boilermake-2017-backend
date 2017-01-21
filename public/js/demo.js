var total = 0;
var hist;
var costPerPage = 60;

$(document).ready(function() {
  var userid = Cookies.get('userid');
  var data = $.ajax({
    url: "api/users/" + userid,
  }).done(parseData);
});

function renderPrice(selector, price) {
  if (price % 100 == 0)
    $(selector).text("$" + (Math.floor(price / 100) + ".00"));
  else
    $(selector).text("$" + (Math.floor(price / 100) + "." + (price % 100)));
}

function parseData(d) {
  console.log(d);

  var user = d.user;
  $(".email").text(user.email);
  hist = user.browsingHistory;
  hist.forEach(function(h) {
    if (h.blacklisted)
      total += user.costPerPage
  });
  renderPrice("#price-ticker", total);
  renderPrice("#sub-price-ticker", user.costPerPage);

  hist.sort(function(a, b) {
    return new Date(a.startTime) > new Date(b.startTime);
  });

  var aggregate = [];
  var runner = 0;
  hist.forEach(function(d) {
    if (d.blacklisted)
      runner += costPerPage;
    aggregate.push({ date: new Date(d.startTime), val: runner/100 });
  });

  var freq = {}
  hist.forEach(function(d) {
    if (freq[d.websiteName] == undefined) {
      freq[d.websiteName] = 1;
    }
    else
      freq[d.websiteName] += 1;
  });

  var freqArr = []
  for (var key in freq) {
    if (freq.hasOwnProperty(key)) {
      freqArr.push({
        website: key,
        val: freq[key]
      });
    }
  }
  freqArr.sort(function(a, b) {
    return a.val < b.val;
  });

  var chords = [];
  var chordMap = {};
  var inverseMap = {};
  var count = 0;
  hist.forEach(function(d) {
    if (chordMap[d.websiteName] == undefined) {
      chordMap[d.websiteName] = count;
      inverseMap[count] = d.websiteName;
      count += 1
    }
  });

  for (var i = 0; i < count; i++) {
    chords.push([]);
    for (var j = 0; j < count; j++) {
      chords[i].push(0);
    }
  }

  var last;
  hist.forEach(function(d) {
    if (last != undefined) {
      var i = chordMap[d.websiteName];
      var j = chordMap[last];
      chords[i][j] += 1;
    }
    last = d.websiteName;
  });

  renderMain(aggregate);
  renderChord(chords, inverseMap);
  renderBars(freqArr);
}
