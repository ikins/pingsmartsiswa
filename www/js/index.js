/*
** PingSmart Siswa
** Bandung 1 Jan 2019
*/

var appsiswa =  angular.module('app', ['onsen','ipCookie','highcharts-ng','ngRoute','angular-md5','angular-loading-bar']);


//server
var _URL        = "http://pingsmart.gallerysneakers27.com/api/";

//local
//var _URL        = "http://localhost:7777/apismart/api/";


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

        member_id_siswa  = window.localStorage.getItem("member_id_siswa");
        token_siswa      = window.localStorage.getItem("token_siswa");

            if (member_id_siswa == '' || member_id_siswa == null || token_siswa == '' || token_siswa == null) {
                fn.load('landing-page.html');
                return false;
            } else {
                fn.load('dashboard.html');
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
        window.localStorage.removeItem("member_id_siswa");
        window.localStorage.removeItem("token_siswa");

        fn.load('landing-page.html');
    };

    $scope.refresh = function(){
        fn.load('dashboard.html');
    };

}]);


appsiswa.controller('PageController', ['$scope', '$http','ipCookie', 'md5', function($scope, $http, ipCookie, md5) {


    $scope.login = function(){

        function login_action() {
        
        //var device_id = device.uuid;
        var device_id = '12345678';

        var username = $scope.username;
        var password = $scope.password;


             $http.get( _URL+"auth?user=" + username + "&pass=" + password)
             .success(function (response) {
                 if (response.response_code == 1) {

                    window.localStorage.setItem("member_id_siswa", response.data[0].MemberId);
                    window.localStorage.setItem("token_siswa", response.data[0].Token);
                    window.localStorage.setItem("nis_siswa", response.data[0].NIS);

                    fn.load('dashboard.html');

                 } else if (response.response_code != 1) {
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

appsiswa.controller('Pagedashboard', ['$scope', '$http', function($scope, $http) {


}]);

appsiswa.controller('PageJadwal', ['$scope', '$http', function($scope, $http) {

    token_siswa  = window.localStorage.getItem("token_siswa");
    nis_siswa    = window.localStorage.getItem("nis_siswa");

    $http.get( _URL+"siswa-jadwal?nis=" + nis_siswa + "&token=" + token_siswa)
        .success(function (response) {

        $scope.list_jadwal = response.data;

    });

}]);

appsiswa.controller('PageAgenda', ['$scope', '$http', function($scope, $http) {


}]);

appsiswa.controller('PageAkademik', ['$scope', '$http', function($scope, $http) {


}]);

appsiswa.controller('PagePengumuman', ['$scope', '$http', function($scope, $http) {


}]);

appsiswa.controller('PageGaleri', ['$scope', '$http', function($scope, $http) {


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