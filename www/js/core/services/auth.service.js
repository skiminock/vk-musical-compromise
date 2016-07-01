(function() {

  "use strict";

  angular.module("core.services").factory("AuthService", authService);

  authService.$inject = ["$q", "$cordovaOauth", "localStorageService", "$http", "config"];

    function authService($q, $cordovaOauth, localStorageService, $http, config) {

      /*
        Т.к cordova не работает, для дебага на пк вручную помещаем токен в localStorage
        token взят для моего фейка vk.com/bob_green
      */
      if (config.debug) {
        var authInfo = {};
        authInfo["expires_in"] = 86400;
        authInfo["expires_at"] = moment().add(authInfo["expires_in"] - 10, 'seconds').toDate();
        authInfo["access_token"] = "726dacfff3ec43c0f3398ca3c4064233754529c360a868e7107a49c27dccf7ab710cc17891b10f0c75fb4";
        localStorageService.set("authInfo", authInfo);
      }

      var service = {
        run: run,
        clear: clear,
        getMe: getMe
      };

      function run() {
        var deferred = $q.defer();
        var authInfo = localStorageService.get("authInfo");
        if (!authInfo || (authInfo && authInfo["expires_at"] < new Date())){
          $cordovaOauth.vkontakte("5509706", ["audio", "offline"]).then(function(res) {
            res["expires_at"] = moment().add(res["expires_in"] - 10, 'seconds').toDate();
            localStorageService.set("authInfo", res);
            deferred.resolve(res);
          }, function(err) {
            localStorageService.remove("authInfo");
            deferred.reject(err);
          });
        }else{
          deferred.resolve(authInfo);
        }
        return deferred.promise;
      }

      function getMe() {
        var deferred = $q.defer();
        var userInfo = localStorageService.get("authInfo");
        if (userInfo){
          $http.get(config.baseVk +
            '/users.get?fields=photo_100&access_token='
            + userInfo["access_token"]).then(function (res) {
            deferred.resolve(res.data);
          }).catch(function(err){
            deferred.reject(err);
          });
        }else{
          deferred.reject({ error: true });
        }
        return deferred.promise;
      }

      function clear() {
        localStorageService.remove("authInfo");
      }

      return service;

    }

})();
