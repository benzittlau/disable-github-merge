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

  function checkMutations(mutations) {
    var filteredForMergeChanges = mutations.filter(function(mutation) {
      return mutation.addedNodes[0].id == "partial-pull-merging"
    })

    if(filteredForMergeChanges.length > 0) { blockIfMatching(); }
  };

  // Bind to ajax updating the #partial-pull-merging area of the page directly
  // by observing it's partent div for mutations

  function registerMutationObserver() {
    var observer = new MutationObserver(checkMutations)
    var config = {childList: true};
    var parent = $('#partial-pull-merging').parent()[0]

    if(parent) {
      observer.observe(parent, config);
    };
  };

  function setupBindsFollowingPageLoad() {
    blockIfMatching();

    registerMutationObserver();
  };

  setupBindsFollowingPageLoad();

  // Bind to pjax page loads
  document.addEventListener('pjax:end', function () {
      blockIfMatching();
      setupBindsFollowingPageLoad();
  });
})(jQuery);

