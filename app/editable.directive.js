app.directive('contenteditable', ['$sce', function ($sce) {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function (scope, element, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model

      // Specify how UI should be updated
      ngModel.$render = function () {
        element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
      };

      element.bind('keydown keypress', function (event) {
        if (event.which === 40) { //down arrow
          event.preventDefault();
          if (scope.selectedIndex < scope.searchResults.length - 1) {
            scope.selectedIndex++;
            return false;
          }
        } else if (event.which === 38) { //up arrow
          event.preventDefault();
          if (scope.selectedIndex > 0) {
            scope.selectedIndex--;
            return false;
          }
        } else if (event.which === 13) { //enter
          event.preventDefault();
          return scope.generateUserLink(scope.users[scope.selectedIndex]);
        }
      })

      // Listen for change events to enable binding
      element.on('blur keyup change', function () {
        scope.$evalAsync(read);
      });
      read(); // initialize

      // Write data to the model
      function read() {
        var html = element.html();
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        if (attrs.stripBr && html == '<br>') {
          html = '';
        }
        ngModel.$setViewValue(html);
        scope.reply = html;
        scope.replyChanged();
      }
    }
  };
}]);