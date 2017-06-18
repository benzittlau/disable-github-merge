'use strict';

(function($){
  function blockIfMatching() {
    var pullRequestPageRegex = /\/[^\/]*\/[^\/]*\/pull\/\d*/;
    var currentPath = window.location.pathname;

    // This will run on every page due to being run after each GitHub PJAX
    // page transition, so abort if it is not a pull request page.
    if(!currentPath.match(pullRequestPageRegex)) { return };

    var $pageBodyContainer = $('#js-repo-pjax-container');
    var $mergeActionsGroup = $pageBodyContainer.find('.merge-message div.btn-group-merge');
    var repoName = currentPath.match(/^\/(\w*\/\w*)\/*/)[1]
    var targetBranchName = $('.base-ref').text();
    var buttonMessage = 'Merging Disabled';

    chrome.storage.sync.get('blackListedBranches', function(items) {
      if(!items.blackListedBranches) { return }

      items.blackListedBranches.forEach(function(blackListedBranch) {
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
      })
    });
  };

  blockIfMatching();
  document.addEventListener('pjax:end', function () {
      blockIfMatching();
  });

})(jQuery);

