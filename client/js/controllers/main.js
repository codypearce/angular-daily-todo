
angular.mondule('dailyTodo', []).controller( 'mainController', function($scope, $http, Todos) {
    $scope.date = new Date();
    $scope.startDate =  null;
    $scope.endDate = null;
    $scope.title = '';
    $scope.selectedAll = false;
    $scope.menu = false;

    $scope.toggleMenu = function() {
      $scope.menu = !$scope.menu;
    }

    Todos.get()
     .then(function(data) {
         $scope.todos = data;
     });


    $scope.changeDate = function(e, mod) {
      // Reset selectedAll
      $scope.selectedAll = false;

      // Reset Start and EndDate
      $scope.startDate = null;
      $scope.endDate = null;
      $scope.title = '';

      // Remove active class on all nav btns, add to the one clicked
      let sideNavBtns = document.querySelectorAll('.sidenav_btn');
      sideNavBtns.forEach(function(btn) {
        btn.classList.remove('active');
      })
      e.target.classList.add('active');

      // Update the new date
      let newDate;
      switch (mod) {
        case 'today':
          newDate = new Date();
          $scope.date.setDate(newDate.getDate());
          break;
        case 'tomorrow':
          newDate = new Date();
          $scope.date.setDate(newDate.getDate() + 1);
          break;
        case 'week':
          newDate = new Date();
          let weekstart = newDate.getDate() - newDate.getDay();
          let weekend = weekstart + 6;
          let sunday = new Date(newDate.setDate(weekstart));
          let saturday = new Date(newDate.setDate(weekend));
          $scope.startDate = sunday;
          $scope.endDate = saturday;
          break;
        case 'nextWeek':
          newDate = new Date();
          let nextweekstart = newDate.getDate() - newDate.getDay() + 7;
          let nextweekend = nextweekstart + 6;
          let nextsunday = new Date(newDate.setDate(nextweekstart));
          let nextsaturday = new Date(newDate.setDate(nextweekend));
          $scope.startDate = nextsunday;
          $scope.endDate = nextsaturday;
          break;
        case 'month':
          newDate = new Date();
          var firstDay = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
          var lastDay = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
          $scope.startDate = firstDay;
          $scope.endDate = lastDay;
          break;
        case 'nextMonth':
          newDate = new Date();
          var nextfirstDay = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 1);
          var nextlastDay = new Date(newDate.getFullYear(), newDate.getMonth() + 2, 0);
          $scope.startDate = nextfirstDay;
          $scope.endDate = nextlastDay;
          break;
        case 'year':
          newDate = new Date();
          var firstDayYear = new Date(newDate.getFullYear(), 0, 1);
          var lastDayYear = new Date(newDate.getFullYear() + 1, 0, 0);
          $scope.startDate = firstDayYear;
          $scope.endDate = lastDayYear;
          break;
        case 'all':
          $scope.title = 'All Todos';
          $scope.toggleAll();
          break;
        default:
          return
      }
    }
    $scope.toggleAll = function() {
      $scope.selectedAll = true;
    }
    $scope.createTodo = function(todo) {
      if(todo.todo.length < 1) {
        return;
      }
      Todos.get()
       .then(function(data) {
           $scope.todos = data;
           $scope.todo.dueDate = '';
           $scope.todos = data.data;
       });
    };

    $scope.finishTodo = function(id) {
      $http.put('/api/todos/done/' + id)
        .then(function(data, err) {
          if(err)
            console.log(err)
          $scope.todos = data.data;
        })
    }
    $scope.undoTodo = function(id) {
      $http.put('/api/todos/undo/' + id)
        .then(function(data, err) {
          if(err)
            console.log(err)
          $scope.todos = data.data;
        })
    }

    $scope.deleteTodo = function(id) {
      Todos.delete(id)
        .then(function(data) {
            $scope.todos = data;
        });
    };

    $scope.currentDateFilter = function(todo) {
      // If no dueDate then it should be in backLog
      if(!todo.dueDate) {
        return;
      }
      if($scope.selectedAll) {
        return todo;
      }

      var todoDate = new Date(todo.dueDate);
      // If it's a range then check for date in that range;
      if($scope.startDate) {
        if($scope.startDate.setHours(0,0,0, 0)<= todoDate.setHours(0,0,0, 0)&& todoDate.setHours(0,0,0, 0) <= $scope.endDate.setHours(0,0,0, 0)) {
          return todo;
        } else {
          return;
        }
      } else if(todoDate.getDate() === $scope.date.getDate()){
        return todo;
      } else {
        return;
      }


    }
    $scope.backlogFilter = function(todo) {
      if(!todo.dueDate) {
        return todo;
      }
      if($scope.selectedAll) {
        return;
      }
      var todoDate = new Date(todo.dueDate);
      if($scope.startDate) {
        if($scope.startDate.setHours(0,0,0, 0) > todoDate.setHours(0,0,0, 0) ) {
          return todo;
        } else {
          return;
        }
      } else if(todoDate.getDate() === $scope.date.getDate()){
        return;
      } else if(todoDate.getTime() < $scope.date.getTime()) {
        return todo;
      }
    }
})