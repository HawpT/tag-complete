app.component('commentsComponent', {
  templateUrl: 'comments.html',
  controller: function CommentsController($scope) {
    $scope.reply = '';
    $scope.searchResults = [];
    $scope.search = '';
    $scope.selectedIndex = 0;

    $scope.replyChanged = function () {
      //do some substitutions on a temp string to try to ignore false positives
      var reply = $scope.reply.replace(/<span class="user">@/ig, '<span class="user">X');
      reply = $scope.reply.replace(/ @/g, ' X');
      reply = $scope.reply.replace(/^[\w\W]+@ /g, 'X ');
      reply = $scope.reply.replace(/(?:\w+)@(?=\w+)/ig, 'X');
      var index = reply.indexOf('@');
      var nextWhitespace = reply.slice(index).indexOf(' '); //only search until whitespace or EOS
      nextWhitespace = nextWhitespace === -1 ? reply.length : nextWhitespace;

      if (index >= 0) {
        var search = reply.slice(index, nextWhitespace);
        $scope.search = search;

        //remove our @from the search result if we have another character
        if (search.length > 1) {
          search = search.slice(1);
        } else {
          $scope.selectedIndex = 0; //when @ symbol is first typed, reset selected
        }
        $scope.searchResults = $scope.users.map(u => {
            u.index = u.name.toLowerCase().indexOf(search.toLowerCase());
            return u;
          }) //Add an index we can use to sort later to the user object
          .filter(u => u.index >= 0) //filter values with no match
          .sort((a, b) => a.index - b.index) //user our index values to sort by how early our search occurs
      }
    };

    $scope.generateUserLink = function (user) {

      $scope.reply = $scope.reply.replace(
        $scope.search,
        '<span class="user">@' + user.name + '</span>');
      return true;
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