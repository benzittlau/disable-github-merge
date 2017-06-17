'use strict';

(function($){
  $(function(){
    chrome.storage.sync.get('blackListedBranches', function(items) {
      $('#blacklisted_branches').val(items.blackListedBranches);
    })

    $('#save_btn').closest('form').submit(function(e) {
      e.preventDefault();
      chrome.storage.sync.set({'blackListedBranches': [$('#blacklisted_branches').val()]}, function(){
        window.alert('The options have been saved!');
      });
    });
  });
})(jQuery);
