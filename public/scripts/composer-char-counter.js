//counter to 140
$(document).ready(function() {
  $('.new-tweet textarea').on('input', function(){
    let remaining = 140 - this.value.length;
    let counter = $(this).siblings('.counter');
      counter.text(remaining);
    (remaining < 0) ? counter.addClass('red') : counter.removeClass('red');
  });
});
