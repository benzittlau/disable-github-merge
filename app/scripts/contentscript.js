'use strict';

(function($){
  var changeMergeButtonState = function() {
    var $pageBodyContainer = $('#js-repo-pjax-container');
    var $mergeActionsGroup = $pageBodyContainer.find('.merge-message div.btn-group-merge');
    var repoName = window.location.pathname.match(/^\/(\w*\/\w*)\/*/)[1]
    var targetBranchName = $('.base-ref').text();
    var buttonMessage = 'Merging Blocked';

    chrome.storage.sync.get('blackListedBranches', function(items) {
      var blackListedBranch = items.blackListedBranches[0];

      if(blackListedBranch) {
        var blackListedRepo, blackListedBranchName;
        [blackListedRepo, blackListedBranchName] = blackListedBranch.replace(/ /g, '').split(':');

        if(blackListedRepo == repoName && blackListedBranchName == targetBranchName) {
          var buttonHtml = `<div class="BtnGroup btn-group-merge">
                          <button disabled="disabled" class="btn btn-primary BtnGroup-item js-details-target">
                            ${buttonMessage}
                          </button>
                        </div>`;

          $mergeActionsGroup.html(buttonHtml);
        };
      };
    });
  };

  changeMergeButtonState();
  setInterval(changeMergeButtonState, 10000);
})(jQuery);
