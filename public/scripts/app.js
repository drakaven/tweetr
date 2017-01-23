$(document).ready(function() {

  $('#form1').on('submit', function (event) {
    event.preventDefault();
    let newData = $(this).serialize();
    $.post("/tweets",
      newData,
      //success callback
      function (data, status) {
        $.get("/tweets", function (data, status) {

          let newText = "";
          console.log(data);
          data.forEach((item) => {
            newText += item.content.text;
          });
          $("#p2").text(newText);
        });
      });
  });

//document ready close tag
});
