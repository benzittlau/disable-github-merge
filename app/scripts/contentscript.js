'use strict';

(function($){
  var changeMergeButtonState = function() {
    var $pageBodyContainer = $('#js-repo-pjax-container');
    var $mergeActionsGroup = $pageBodyContainer.find('.merge-message div.btn-group-merge');
    var repoName = window.location.pathname.match(/^\/(\w*\/\w*)\/*/)[1]
    var buttonMessage = 'Disabled';

    chrome.runtime.sendMessage({from: 'content', subject: 'localStorage'}, function(response){
      if (!response) { return; }
      var localStorage, accountsString, accountsArray, buttonTest, buttonHtml;

      localStorage = response.localStorage;
      if(localStorage.blacklistedAccounts) {
        accountsString = localStorage.blacklistedAccounts;
        accountsString = accountsString.replace(/ /g, '');
        accountsArray = accountsString.split(',');

        if(accountsArray.indexOf(repoName) !== -1) {
          buttonTest = `thisIsATest`;
          buttonHtml = `<div class="BtnGroup btn-group-merge">
                          <button disabled="disabled" class="btn btn-primary BtnGroup-item js-details-target">
                            ${buttonMessage}
                          </button>
                        </div>`;

          $mergeActionsGroup.html(buttonHtml);
        }
      }
      });
  };

  changeMergeButtonState();
  setInterval(changeMergeButtonState, 10000);
})(jQuery);
