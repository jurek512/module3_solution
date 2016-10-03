(function () {
'use strict';

angular.module('MenuCategoriesApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.directive('foundItems', FoundItems)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

function FoundItems() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      list: '<found',
      title: '@title',
      onRemove: '&'
    }
  };

  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;

  menu.removeItem = function(index) {
    console.log(index);
    menu.menuitems.splice(index, 1);
  };

  menu.search = function() {
    menu.menuitems = [];
    if (!menu.term) {
      return;
    }
    var promise = MenuSearchService.getMatchedMenuItems(menu.term);
    promise.then(function(result) {
      menu.menuitems = result;
    });
  };
}


MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: "GET",
      url: (ApiBasePath + "//menu_items.json")
    }).then(function (response) {
      var found = [];
      response.data.menu_items.forEach(function(elem) {
        if (elem.description.includes(searchTerm)) {
          found.push(elem);
        }
      });
      return found;
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

})();
