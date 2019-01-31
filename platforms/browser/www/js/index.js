/*
** PingSmart Siswa
** Bandung 1 Jan 2019
*/

var appsiswa =  angular.module('app', ['onsen','ipCookie','highcharts-ng','ngRoute','angular-md5','angular-loading-bar']).config(appconfig);
appconfig.$inject = ['$httpProvider'];
function appconfig($httpProvider){
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name="_csrf-api"]').attr('content');
}


//server
//var _URL        = "http://pingsmart.gallerysneakers27.com/api/";

//local
var _URL        = "http://localhost:7777/apismart/api/";


var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //var Permission = window.plugins.Permission;
    },
    receivedEvent: function(id) {

        username_siswa  = window.localStorage.getItem("username_siswa");
        token_siswa     = window.localStorage.getItem("token_siswa");

            if (username_siswa == '' || username_siswa == null || token_siswa == '' || token_siswa == null) {
                fn.load('landing-page.html');
                return false;
            } else {
                fn.load('portal.html');
            }
    }
};

//config loading bar
appsiswa.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 400;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.includeBar = true;
  }]);

appsiswa.controller('getCurrentInfoWeek', ['$scope', '$http','ipCookie', function($scope, $http,ipCookie) {

    //Data Msg
    $scope.data = {
           msg: ''
    };

    //Date 
    $scope.date = new Date();

    $scope.logout = function(){
        window.localStorage.removeItem("username_bpspams");
        //Kader
        window.localStorage.removeItem("kode_bps");
        window.localStorage.removeItem("nama_petugas");
        window.localStorage.removeItem("id_kader");


        fn.load('login.html');
    };

    $scope.refresh = function(){
        fn.load('portal.html');
    };

}]);


appsiswa.controller('PageController', ['$scope', '$http','ipCookie', 'md5', function($scope, $http, ipCookie, md5) {


    $scope.login = function(){

        function login_action() {
        
        //var device_id = device.uuid;
        var device_id = '12345678';

        var uagent   = "siswa0000";
        var username = $scope.username;
        var password = $scope.password;


             $http.get( _URL+"auth?uagent=" + uagent + "&user=" + username + "&pass=" + password)
             .success(function (response) {
                 if (response.records[0].sukses == 1) {

                        window.localStorage.setItem("username_siswa", response.records[0].username);
                        window.localStorage.setItem("token_siswa", response.records[0].token);

                        fn.load('dashboard.html');       

                 } else if (response.records[0].sukses != 1) {
                    ons.notification.alert({
                      messageHTML: 'Username dan password yang anda kirimkan salah.',
                      title: 'Notifikasi',
                      buttonLabel: 'OK',
                      animation: 'default',
                      callback: function() {
                        // Alert button is closed!
                      }
                    });
                    return false;
                 }
             });

        }


        if ( $scope.username == undefined ) {
                ons.notification.alert({
                  messageHTML: 'Username Harus Diisi',
                  title: 'Notifikasi',
                  buttonLabel: 'OK',
                  animation: 'default', // or 'none'
                  // modifier: 'optional-modifier'
                  callback: function() {
                    // Alert button is closed!
                  }
                });
                
                return false;
            }

        if ( $scope.password == undefined ) {
                ons.notification.alert({
                  messageHTML: 'Password Harus Diisi',
                  title: 'Notifikasi',
                  buttonLabel: 'OK',
                  animation: 'default', // or 'none'
                  // modifier: 'optional-modifier'
                  callback: function() {
                    // Alert button is closed!
                  }
                });
                
                return false;
            }


        login_action();


    };


}]);

appsiswa.controller('PagePortal', ['$scope', '$http', function($scope, $http) {


}]);
//--------------------------------------------------------------------LINK------------------------------------------

window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page, anim) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};

app.initialize();