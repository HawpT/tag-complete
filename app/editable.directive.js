app.directive('tagbox', ['$sce', function ($sce) {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function (scope, element, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model

      //prevent up / down arrow from doing other things on keydown
      element.bind('keydown', function (event) {
        if (event.which === 40 && scope.searchResults.length > 0) { //down arrow
          event.stopPropagation();
          event.preventDefault();
          if (scope.selectedIndex < scope.searchResults.length - 1) {
            scope.selectedIndex++;
            scope.$digest();
          }
        } else if (event.which === 38 && scope.searchResults.length > 0) { //up arrow
          event.stopPropagation();
          event.preventDefault();
          if (scope.selectedIndex > 0) {
            scope.selectedIndex--;
            scope.$digest();
          }
        }
      });

      element.bind('keypress', function (event) {
        if (event.which === 40 && scope.searchResults.length > 0) { //down arrow
          event.stopPropagation();
          event.preventDefault();
        } else if (event.which === 38 && scope.searchResults.length > 0) { //up arrow
          event.stopPropagation();
          event.preventDefault();
        } else if (event.which === 13) { //enter
          if (scope.searchStarted && scope.searchResults.length > 0)
            scope.tagUser(scope.searchResults[scope.selectedIndex]);
          else if (scope.reply.length > 0)
            scope.submit();
        } else if (event.key === '@') {
          scope.searchStarted = true;
          scope.search = '@';
        } else if (scope.searchStarted) {
          if (event.which !== 8) //NOT backsapce
            scope.search += event.key;
        }
      });
      //keyup required for backspace handling
      element.bind('keyup', function (event) {
        if (event.which === 40 && scope.searchResults.length > 0) { //down arrow
          event.stopPropagation();
          event.preventDefault();
        } else if (event.which === 38 && scope.searchResults.length > 0) { //up arrow
          event.stopPropagation();
          event.preventDefault();
        } else if (scope.searchStarted && event.which === 8) { //backspace 
          if (scope.search === '@') {
            scope.search = '';
            scope.searchStarted = false;
            scope.selectedIndex = 0;
            scope.searchResults = [];
            scope.$digest();
          } else {
            scope.search = scope.search.slice(0, scope.search.length - 1);
            //keyup event fires after reply change has already been called
            scope.replyChanged();
            scope.$digest();
          }
        }
      });
    }
  };
}]);