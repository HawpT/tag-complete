app.component('commentsComponent', {
  templateUrl: 'comments.html',
  controller: function CommentsController($scope) {
    $scope.reply = '';
    $scope.searchResults = [];
    $scope.search = '';
    $scope.selectedIndex = 0;
    $scope.selectedUser = null;
    $scope.tagIndex = 0;
    $scope.searchStarted = false;

    $scope.submit = function () {
      var reply = $scope.reply;
      $scope.users.map(u => '@' + u.name).forEach(un => {
        reply = reply.split(un).join('<span class="usertag">' + un + '</span>');;
      });
      $scope.comments.push({
        'userID': 1,
        'text': reply
      });
      $scope.reply = '';
      $scope.$digest();
    };

    $scope.replyChanged = function () {
      if ($scope.searchStarted) {
        $scope.searchResults = $scope.users.map(u => {
            if ($scope.search === '@')
              u.index = 0;
            else
              u.index = u.name.toLowerCase().indexOf($scope.search.slice(1).toLowerCase());
            return u;
          }) //Add an index we can use to sort later to the user object
          .filter(u => u.index >= 0) //filter values with no match
          .sort((a, b) => a.index - b.index) //user our index values to sort by how early our search occurs
      }
    };

    $scope.tagUser = function (user) {
      //substitue existings handles to keep from interferring with search
      var reply = $scope.reply;
      $scope.users.forEach(u => {
        reply = reply.split('@' + u.name).join('#' + u.userID + '#');
      });
      reply = reply.replace(
        $scope.search,
        '@' + user.name + ' ');
      $scope.users.forEach(u => {
        reply = reply.split('#' + u.userID + '#').join('@' + u.name);
      });
      $scope.reply = reply;
      $scope.searchResults = [];
      $scope.search = '';
      $scope.searchStarted = false;
    }

    $scope.getUserFromId = function (userID) {
      return this.users.find(u => u.userID === userID);
    }


    //Sample data

    $scope.comments = [{
        'userID': 1,
        'text': 'Mighty fine afternoon.'
      },
      {
        'userID': 2,
        'text': 'I don\'t care for the heat.'
      },
      {
        'userID': 3,
        'text': 'It was hotter last week.'
      },
      {
        'userID': 4,
        'text': 'Anyone have a soda?'
      },
    ];

    $scope.users = [{
        'userID': 1,
        'name': 'Kevin'
      },
      {
        'userID': 2,
        'name': 'Jeff'
      },
      {
        'userID': 3,
        'name': 'Bryan'
      },
      {
        'userID': 4,
        'name': 'Mike'
      },
      {
        'userID': 5,
        'name': 'Ami'
      },
      {
        'userID': 6,
        'name': 'Armi'
      }
    ];
  }
});