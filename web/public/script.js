$(function() {
  $urlList = $('#urlList').append('<ul></ul>');
  $.ajax({
    url: '/urls',
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      var urls = data.urls;
      _.each(urls, function(url) {
        var $url = $('<li></li>');
        $url.append($('<a>', {
          href: '/'+url,
          text: url}));
        $('#urlList').find('ul').append($url);
      });
    }
  });
});
