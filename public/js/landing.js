$(document).ready(function() {
  $('#login-btn').click(function() {
    $('.overlay').removeClass('hidden');
    //$('#join-modal').removeClass('hidden');
    $('#login-modal').fadeIn(275);
  });

  $('#signup-btn').click(function() {
    $('.overlay').removeClass('hidden');
    $('#signup-modal').fadeIn(275);
  });

  $('.modal-header > .close-form').click(closeForm);

  $('#login-submit-form').click(submitPageForm);
  $('#signup-submit-form').click(submitPageFormSignup);
});

function submitPageForm() {
  var selector = '#login-form';
  $(selector).addClass('hidden');
  $('#login-form').addClass('hidden');
  var loader = $('.form-loader').removeClass('hidden');
  $('.ring-loader').removeClass('hidden');

  $('#login-modal').animate({
    top: '16%',
    height: '280px'
  }, 600);

  var arr = $(selector).serializeArray();
  var body = {};
  arr.forEach(function(d) {
    body[d.name] = d.value;
  });

  $.ajax({
    method: "POST",
    url: "/api/login",
    data: body
  }).done(function(d) {
    Cookies.set('userid', d.user._id);
    window.joined = true;
    window.setTimeout(function() {
      loader.children('.ring-loader').addClass('hidden');
      $('#login-modal-done').removeClass('hidden');
      window.location.href = '/dashboard';
    }, 500);
    
  }).fail(function() {
    window.setTimeout(function() {
      loader.children('.ring-loader').addClass('hidden');
      $('#login-modal-fail').removeClass('hidden');
    }, 500);
  });
}

function submitPageFormSignup() {
  var selector = '#signup-form';
  $(selector).addClass('hidden');
  $('#signup-form').addClass('hidden');
  var loader = $('.form-loader').removeClass('hidden');
  $('.ring-loader').removeClass('hidden');

  $('#signup-modal').animate({
    top: '16%',
    height: '280px'
  }, 600);

  var arr = $(selector).serializeArray();
  var body = {};
  arr.forEach(function(d) {
    body[d.name] = d.value;
  });
  console.log(body);
  $.ajax({
    method: "POST",
    url: "/api/users/",
    data: body
  }).done(function() {
    window.joined = true;
    window.setTimeout(function() {
      loader.children('.ring-loader').addClass('hidden');
      $('#signup-modal-done').removeClass('hidden');
    }, 500)
  }).fail(function() {
    window.setTimeout(function() {
      loader.children('.ring-loader').addClass('hidden');
      $('#signup-modal-fail').removeClass('hidden');
    }, 500);
  });
}

function closeForm() {
  $('.overlay').addClass('hidden');
  $('#login-modal').fadeOut(0);
  $('#signup-modal').fadeOut(0);  
  if (!window.joined) {
    $('#login-modal-fail').addClass('hidden');
    $('#login-form').removeClass('hidden');
    $('#login-modal').css({
      top: '12%',
      height: '365px'
    });

    $('#signup-modal-fail').addClass('hidden');
    $('#signup-form').removeClass('hidden');
    $('#signup-modal').css({
      top: '12%',
      height: '430px'
    });
  }
}
