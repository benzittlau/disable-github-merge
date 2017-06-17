'use strict';
(function($){
  $(function(){
    chrome.storage.sync.get('blackListedBranches', function(items) {
      $('#blacklisted_branches').val(items.blackListedBranches.join(','));
    })

    $('#save_btn').click(function(e) {
      chrome.storage.sync.set({'blackListedBranches': $('#blacklisted_branches').val().split(',')}, function(){
        var status = $('#status');
        status.text('Options saved.');
        setTimeout(function() {
          status.text('');
        }, 750);
      });
    });
  });
})(jQuery);
