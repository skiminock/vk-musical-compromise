(function() {

    "use strict";

    angular.module("pages.list").controller("ListController", listController);

    listController.$inject = ["$scope", "PlaylistService", "$timeout"];

    function listController($scope, playlistService, $timeout) {

      $scope.remove = remove;
      $scope.activate = activate;

      $scope.$on("$ionicView.enter", activate);

      function remove(item) {
        $scope.playlists = playlistService.remove(item);
      }

      function activate() {
        $scope.loaded = false;
        $timeout(function(){
          $scope.playlists = playlistService.get();
          $scope.loaded = true;
        }, 1000);
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      }

    }


})();
