'use strict';
(function($){
  function addToList(text) {
    var removeBranchElement = '<span class="remove_blacklisted_branch"> ( - )</span>';
    var branchNameElement= `<span class="blacklisted_branch_name">${text}</span>`
    $('#blacklisted_branches').append(`<li class='blacklisted_branch'>${branchNameElement}${removeBranchElement}</li>`)
  }

  $(function(){
    chrome.storage.sync.get('blackListedBranches', function(items) {
      if(!items.blackListedBranches) { return }

      items.blackListedBranches.forEach(function(blackListedBranch) {
        addToList(blackListedBranch);
      })
    })

    // Interface Actions
    $('#save_btn').click(function(e) {
      var blackListedBranchesText = $('#blacklisted_branches .blacklisted_branch_name').toArray().map(function(el) {
        return $(el).text();
      });

      chrome.storage.sync.set({'blackListedBranches': blackListedBranchesText}, function(){
        var status = $('#status');
        status.text('Options saved.');
        setTimeout(function() {
          status.text('');
        }, 750);
      });
    });

    $('#add_blacklisted_branch').click(function(e) {
      addToList($('#blacklisted_branch_to_add').val());
      $('#blacklisted_branch_to_add').val('');
    });

    $('#blacklisted_branches').on('click', '.remove_blacklisted_branch', function(e) {
      var branch = e.currentTarget.closest('.blacklisted_branch');
      branch.remove();
    })
  });
})(jQuery);
