/*
** PingSmart Siswa
** Bandung 1 Jan 2019
*/

var appsiswa =  angular.module('app', ['onsen','ipCookie','highcharts-ng','ngRoute','angular-md5','angular-loading-bar','ngSanitize']);


//server
var _URL        = "http://smartschool.trilogi-solution.com/api/";
var BASE_URL        = "http://smartschool.trilogi-solution.com";

//local
//var _URL        = "http://localhost:7777/apismart/api/";
//var BASE_URL        = "http://localhost:7777/apismart";


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
        window.localStorage.removeItem("nis_siswa");
        window.localStorage.removeItem("nisn_siswa");
        //------------------------
        window.localStorage.removeItem("Nama");
        window.localStorage.removeItem("Kelas");
        window.localStorage.removeItem("Lahir");
        window.localStorage.removeItem("TglLahir");
        window.localStorage.removeItem("Agama");
        window.localStorage.removeItem("Avatar");

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
                    window.localStorage.setItem("nisn_siswa", response.data[0].NISN);

                    token_siswa = response.data[0].token_siswa;

                    

                     //Login status
                    if(response.data[0].IsLogin == 0){

                        fn.load('change-password.html');

                        }else{

                          if (token_siswa != '') {

                          token_siswa  = window.localStorage.getItem("token_siswa");
                          nis_siswa    = window.localStorage.getItem("nis_siswa");

                          $http.get( _URL+"siswa-profile?nis=" + nis_siswa + "&token=" + token_siswa)
                              .success(function (response) {

                              //---------------------SAVE LOCAL-----------------------
                              window.localStorage.setItem("Nama", response.data[0].Nama);
                              //--
                              window.localStorage.setItem("Kelas", response.data[0].Kelas);
                              window.localStorage.setItem("Lahir", response.data[0].Lahir);
                              window.localStorage.setItem("TglLahir", response.data[0].TglLahir);
                              //--
                              window.localStorage.setItem("Agama", response.data[0].Agama);
                              window.localStorage.setItem("Avatar", response.data[0].Avatar);

                              fn.load('dashboard.html');

                          });

                        }

                      }

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

appsiswa.controller('PageChangePassword', ['$scope', '$http', function($scope, $http) {

    //formdata
    $scope.formData = {
      word: /^\s*\w*\s*$/
    };

    // Set the default value of inputType
    $scope.inputType = 'password';
    
    // Hide & show password function
    $scope.hideShowPassword = function(){
      if ($scope.inputType == 'password')
        $scope.inputType = 'text';
      else
        $scope.inputType = 'password';
    };


    $scope.changePasswords = function(){

        function change_action() {

            token_siswa  = window.localStorage.getItem("token_siswa");
            $scope.formData.token = token_siswa;

            $http({ method  : 'POST',
                url     :  _URL+"change-password",
                data    : $.param($scope.formData),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }   
            })
            .success(function(response) {

                if (response.response_code == 1) {

                    ons.notification.alert({
                      messageHTML: 'Change Password Success',
                      title: 'Notifikasi',
                      buttonLabel: 'OK',
                      animation: 'default',
                      callback: function() {
                        // Alert button is closed!
                      }
                    });

                    fn.load('login.html');

                }

            });

        }

        if ( $scope.formData.password == undefined ) {
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

        change_action();

    
    }


}]);

appsiswa.controller('Pagedashboard', ['$scope', '$http', function($scope, $http) {

    token_siswa  = window.localStorage.getItem("token_siswa");
    nis_siswa    = window.localStorage.getItem("nis_siswa");

    $scope.NIS = window.localStorage.getItem("nis_siswa");
    $scope.NISN = window.localStorage.getItem("nisn_siswa");
    //--------------------------------------------
    $scope.Nama = window.localStorage.getItem("Nama");
    $scope.Kelas = window.localStorage.getItem("Kelas");
    //--------------------------------------------
    $scope.Lahir = window.localStorage.getItem("Lahir");
    //--------------------------------------------
    $scope.TglLahir = window.localStorage.getItem("TglLahir");
    $scope.Agama = window.localStorage.getItem("Agama");
    $scope.Avatar = window.localStorage.getItem("Avatar");

    $scope.URL_Avatar = BASE_URL + "/" + $scope.Avatar;

    $http.get( _URL+"siswa-profile?nis=" + nis_siswa + "&token=" + token_siswa)
    .success(function (response) {

      $scope.Rangking = response.data[0].Rangking;
      $scope.JumlahSiswa = response.data[0].JumlahSiswa;
      $scope.Point = response.data[0].Point;
      $scope.Pelajaran = response.data[0].Pelajaran;
      $scope.JamPel = response.data[0].JamPel;

    });

    $http.get( _URL+"pengumuman-one?nis=" + nis_siswa + "&token=" + token_siswa)
        .success(function (response) {

        $scope.Id = response.data[0].Id;
        $scope.Judul = response.data[0].Judul;

    });

}]);

appsiswa.controller('PageJadwal', ['$scope', '$http', function($scope, $http) {

    token_siswa  = window.localStorage.getItem("token_siswa");
    nis_siswa    = window.localStorage.getItem("nis_siswa");

    $http.get( _URL+"siswa-jadwal?nis=" + nis_siswa + "&token=" + token_siswa)
        .success(function (response) {

        $scope.list_jadwal = response.data;

    });

}]);

appsiswa.controller('PageNilaiUlangan', ['$scope', '$http', function($scope, $http) {

    token_siswa  = window.localStorage.getItem("token_siswa");
    nis_siswa    = window.localStorage.getItem("nis_siswa");

    $http.get( _URL+"siswa-nilai-ulangan?nis=" + nis_siswa + "&token=" + token_siswa)
        .success(function (response) {

        $scope.list_nilai_ulangan = response.data;

    });

    this.showDialog = function(Id) {

      //variable detail nilai
        token_siswa  = window.localStorage.getItem("token_siswa");
        nis_siswa    = window.localStorage.getItem("nis_siswa");

        $http.get( _URL+"siswa-nilai-detail?id=" + Id + "&nis=" + nis_siswa + "&token=" + token_siswa)
        .success(function (response) {

            $scope.Tanggal = response.data[0].Tanggal;
            $scope.Jenis = response.data[0].Jenis;
            $scope.Pelajaran = response.data[0].Pelajaran;
            $scope.Nilai = response.data[0].Nilai;
            $scope.Minimal = response.data[0].Minimal;
            $scope.Status = response.data[0].Status;
            $scope.Keterangan = response.data[0].Keterangan;
            $scope.Penilai = response.data[0].Penilai;


        });

      if (this.dialog) {
        this.dialog.show();
      } else {

        ons.createElement('detail-nilai.html', { parentScope: $scope, append: true })
          .then(function(dialog) {
            this.dialog = dialog;
            dialog.show();
          }.bind(this));
      }
    }.bind(this);

}]);

appsiswa.controller('PageNilaiUts', ['$scope', '$http', function($scope, $http) {

    token_siswa  = window.localStorage.getItem("token_siswa");
    nis_siswa    = window.localStorage.getItem("nis_siswa");

    $http.get( _URL+"siswa-nilai-uts?nis=" + nis_siswa + "&token=" + token_siswa)
        .success(function (response) {

        $scope.list_nilai_uts = response.data;

    });

    this.showDialog = function(Id) {

      //variable detail nilai
        token_siswa  = window.localStorage.getItem("token_siswa");
        nis_siswa    = window.localStorage.getItem("nis_siswa");

        $http.get( _URL+"siswa-nilai-detail?id=" + Id + "&nis=" + nis_siswa + "&token=" + token_siswa)
        .success(function (response) {

            $scope.Tanggal = response.data[0].Tanggal;
            $scope.Jenis = response.data[0].Jenis;
            $scope.Pelajaran = response.data[0].Pelajaran;
            $scope.Nilai = response.data[0].Nilai;
            $scope.Minimal = response.data[0].Minimal;
            $scope.Status = response.data[0].Status;
            $scope.Keterangan = response.data[0].Keterangan;
            $scope.Penilai = response.data[0].Penilai;


        });

      if (this.dialog) {
        this.dialog.show();
      } else {

        ons.createElement('detail-nilai.html', { parentScope: $scope, append: true })
          .then(function(dialog) {
            this.dialog = dialog;
            dialog.show();
          }.bind(this));
      }
    }.bind(this);

}]);

appsiswa.controller('PageNilaiUas', ['$scope', '$http', function($scope, $http) {

    token_siswa  = window.localStorage.getItem("token_siswa");
    nis_siswa    = window.localStorage.getItem("nis_siswa");

    $http.get( _URL+"siswa-nilai-uas?nis=" + nis_siswa + "&token=" + token_siswa)
        .success(function (response) {

        $scope.list_nilai_uas = response.data;

    });

    this.showDialog = function(Id) {

      //variable detail nilai
        token_siswa  = window.localStorage.getItem("token_siswa");
        nis_siswa    = window.localStorage.getItem("nis_siswa");

        $http.get( _URL+"siswa-nilai-detail?id=" + Id + "&nis=" + nis_siswa + "&token=" + token_siswa)
        .success(function (response) {

            $scope.Tanggal = response.data[0].Tanggal;
            $scope.Jenis = response.data[0].Jenis;
            $scope.Pelajaran = response.data[0].Pelajaran;
            $scope.Nilai = response.data[0].Nilai;
            $scope.Minimal = response.data[0].Minimal;
            $scope.Status = response.data[0].Status;
            $scope.Keterangan = response.data[0].Keterangan;
            $scope.Penilai = response.data[0].Penilai;


        });

      if (this.dialog) {
        this.dialog.show();
      } else {

        ons.createElement('detail-nilai.html', { parentScope: $scope, append: true })
          .then(function(dialog) {
            this.dialog = dialog;
            dialog.show();
          }.bind(this));
      }
    }.bind(this);

}]);

appsiswa.controller('PageNilaiRaport', ['$scope', '$http', function($scope, $http) {

    token_siswa  = window.localStorage.getItem("token_siswa");
    nis_siswa    = window.localStorage.getItem("nis_siswa");

    $http.get( _URL+"siswa-nilai-raport?nis=" + nis_siswa + "&token=" + token_siswa)
        .success(function (response) {

        $scope.list_nilai_raport = response.data;

    });

    this.showDialog = function(Id) {

      //variable detail nilai
        token_siswa  = window.localStorage.getItem("token_siswa");
        nis_siswa    = window.localStorage.getItem("nis_siswa");

        $http.get( _URL+"siswa-nilai-detail?id=" + Id + "&nis=" + nis_siswa + "&token=" + token_siswa)
        .success(function (response) {

            $scope.Tanggal = response.data[0].Tanggal;
            $scope.Jenis = response.data[0].Jenis;
            $scope.Pelajaran = response.data[0].Pelajaran;
            $scope.Nilai = response.data[0].Nilai;
            $scope.Minimal = response.data[0].Minimal;
            $scope.Status = response.data[0].Status;
            $scope.Keterangan = response.data[0].Keterangan;
            $scope.Penilai = response.data[0].Penilai;


        });

      if (this.dialog) {
        this.dialog.show();
      } else {

        ons.createElement('detail-nilai.html', { parentScope: $scope, append: true })
          .then(function(dialog) {
            this.dialog = dialog;
            dialog.show();
          }.bind(this));
      }
    }.bind(this);

}]);

appsiswa.controller('PageAkademik', ['$scope', '$http', function($scope, $http) {

    token_siswa  = window.localStorage.getItem("token_siswa");
    nis_siswa    = window.localStorage.getItem("nis_siswa");

    $http.get( _URL+"siswa-akademik?token=" + token_siswa)
        .success(function (response) {

        $scope.list_akademik = response.data;

    });

}]);


appsiswa.controller('PageAkademikDetail', ['$scope', '$http', function($scope, $http) {

    token_siswa  = window.localStorage.getItem("token_siswa");
    nis_siswa    = window.localStorage.getItem("nis_siswa");

    $http.get( _URL+"siswa-akademik-detail?token=" + token_siswa +"&id=" + $scope.data.msg)
        .success(function (response) {

        $scope.Tanggal = response.data[0].Tanggal;
        $scope.Event = response.data[0].Event;
        $scope.Tempat = response.data[0].Tempat;
        $scope.Deskripsi = response.data[0].Deskripsi;
        $scope.Status = response.data[0].Status;
        $scope.Keterangan = response.data[0].Keterangan;

    });

}]);

appsiswa.controller('PagePengumuman', ['$scope', '$http', function($scope, $http) {

    token_siswa  = window.localStorage.getItem("token_siswa");
    nis_siswa    = window.localStorage.getItem("nis_siswa");

    $http.get( _URL+"pengumuman?nis=" + nis_siswa + "&token=" + token_siswa)
        .success(function (response) {

        $scope.list_pengumuman = response.data;

    });

}]);

appsiswa.controller('PagePengumumanDetail', ['$scope', '$http', function($scope, $http) {

    token_siswa  = window.localStorage.getItem("token_siswa");
    nis_siswa    = window.localStorage.getItem("nis_siswa");

    $http.get( _URL+"pengumuman-view?nis=" + nis_siswa + "&id=" + $scope.data.msg +"&token=" + token_siswa)
        .success(function (response) {

        $scope.Tanggal = response.data[0].Tanggal;
        $scope.Judul = response.data[0].Judul;
        $scope.Pengumuman = response.data[0].Pengumuman;
        $scope.BeginPublish = response.data[0].BeginPublish;
        $scope.EndPublish = response.data[0].EndPublish;

    });

}]);

appsiswa.controller('PageAlbum', ['$scope', '$http', function($scope, $http) {

    token_siswa  = window.localStorage.getItem("token_siswa");
    nis_siswa    = window.localStorage.getItem("nis_siswa");

    $scope.BASE_URL = BASE_URL;

    $http.get( _URL+"siswa-album?nis=" + nis_siswa + "&token=" + token_siswa)
        .success(function (response) {

        $scope.list_album = response.data;

    });

}]);

appsiswa.controller('PageAlbumDetail', ['$scope', '$http', function($scope, $http) {

    token_siswa  = window.localStorage.getItem("token_siswa");
    nis_siswa    = window.localStorage.getItem("nis_siswa");

    $scope.BASE_URL = BASE_URL;

    $http.get( _URL+"siswa-album-detail?token=" + token_siswa +"&id="+ $scope.data.msg)
        .success(function (response) {


        $scope.list_album_detail = response.data;

    });

    this.showDialog = function(Id) {

      if(Id != '') {

            //variable detail nilai
            token_siswa  = window.localStorage.getItem("token_siswa");

            $http.get( _URL+"siswa-album-detail-view?token=" + token_siswa +"&id="+ Id)
            .success(function (response) {

                $scope.Image = response.data[0].Image;


            });

        }

      if (this.dialog) {
        this.dialog.show();
      } else {

        ons.createElement('detail-album-view.html', { parentScope: $scope, append: true })
          .then(function(dialog) {
            this.dialog = dialog;
            dialog.show();
          }.bind(this));
      }
    }.bind(this);

}]);

appsiswa.controller('PageAgenda', ['$scope', '$http', function($scope, $http) {

    token_siswa  = window.localStorage.getItem("token_siswa");
    nis_siswa    = window.localStorage.getItem("nis_siswa");

    $http.get( _URL+"siswa-agenda?nis=" + nis_siswa + "&token=" + token_siswa)
        .success(function (response) {

        $scope.list_agenda = response.data;

    });

}]);

appsiswa.controller('PageAgendaDetail', ['$scope', '$http', function($scope, $http) {

    token_siswa  = window.localStorage.getItem("token_siswa");
    nis_siswa    = window.localStorage.getItem("nis_siswa");

    $http.get( _URL+"siswa-agenda-detail?token=" + token_siswa +"&id="+ $scope.data.msg)
        .success(function (response) {

        $scope.TglAwal = response.data[0].TglAwal;
        $scope.TglAkhir = response.data[0].TglAkhir;
        $scope.JamAwal = response.data[0].JamAwal;
        $scope.JamAkhir = response.data[0].JamAkhir;
        $scope.Judul = response.data[0].Judul;
        $scope.Deskripsi = response.data[0].Deskripsi;

    });

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