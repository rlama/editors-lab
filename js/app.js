// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myapp = angular.module('starter', ['ionic', 'ngSanitize', 'ngCordova']);

myapp.run(function ($ionicPlatform) {
	$ionicPlatform.ready(function () {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
});

myapp.config(function ($stateProvider, $urlRouterProvider, $compileProvider) {
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
	$stateProvider
		.state('home', {
		url: '/',
		templateUrl: 'templates/home.html'
	})
	.state('photo', {
			url: '/photo',
			templateUrl: 'templates/photo.html'
		})
		.state('video', {
			url: '/video',
			templateUrl: 'templates/video.html'
		})
		.state('text', {
			url: '/text',
			templateUrl: 'templates/text.html'
		})
	$urlRouterProvider.otherwise('/');
});

myapp.controller('MainController', ['$scope', '$http', '$state', 'Camera', '$location', '$sce', '$cordovaFileTransfer', 'dataService',
    function ($scope, $http, $state, Camera, $location, $sce, $cordovaFileTransfer, dataService) {
		/*$http.get('js/data.json').success(function (data) {
			$scope.artists = data.artists;
			$scope.whichartist = $state.params.aId;
			$scope.data = {
				showDelete: false,
				showReorder: false
			};

			$scope.onItemDelete = function (item) {
				$scope.artists.splice($scope.artists.indexOf(item), 1);
			}

			$scope.doRefresh = function () {
				$http.get('js/data.json').success(function (data) {
					$scope.artists = data;
					$scope.$broadcast('scroll.refreshComplete');
				});
			}

			$scope.toggleStar = function (item) {
				item.star = !item.star;
			}

			$scope.moveItem = function (item, fromIndex, toIndex) {
				$scope.artists.splice(fromIndex, 1);
				$scope.artists.splice(toIndex, 0, item);
			};

		});*/
		$scope.imgURI = "";
		$scope.videoURI;
		
		
		function getData(){
			dataService.getJsonData().then(function(data){
			   $scope.data = data;
				
				console.log(data)

			});
		}
		getData();
		
		
		$scope.takePicture = function () {
			console.log("TAKING PICTURE");
			//$scope.imgURI = "img/Jonathan_Ferrar_tn.jpg";
			Camera.takePicture().then(function (imageURI) {
				//$scope.imageUrl = "data:image/jpeg;base64," + imageURI;
				$scope.imageUrl = imageURI;
				$scope.imageUpload(imageURI);
				$location.path('/photo');
				console.log("PICTURE TAKEN");
			}, function (err) {
			})
		};
		 //  = $sce.trustAsResourceUrl("http://player.vimeo.com/external/85569724.sd.mp4?s=43df5df0d733011263687d20a47557e4");
		$scope.takeVideo = function () {
			Camera.takeVideo().then(function (videoURI) {
				$scope.videoURI = videoURI[0].fullPath;
				$scope.videoUpload($scope.videoURI);
				$location.path('/video');
			}, function (err) {
				//console.log(err)
			})
		};

		$scope.imageUpload = function (img) {
			var url = "http://lamainteractives.com/editorslab/uploadImage.php";
			var targetPath = img ;//cordova.file.externalRootDirectory + "logo_radni.png";
			var filename = targetPath.split("/").pop();
			var options = {
				fileKey: "file",
				fileName: filename,
				chunkedMode: false,
				mimeType: "image/jpg"
			};
			$cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
				console.log("SUCCESS: " + JSON.stringify(result.response));
			}, function (err) {
				console.log("ERROR: " + JSON.stringify(err));
			}, function (progress) {
				// PROGRESS HANDLING GOES HERE
			});
		}
		
		$scope.videoUpload = function (vid) {
			var url = "http://lamainteractives.com/editorslab/uploadVideo.php";
			var targetPath = vid ;//cordova.file.externalRootDirectory + "logo_radni.png";
			var filename = targetPath.split("/").pop();
			var options = {
				fileKey: "file",
				fileName: filename,
				chunkedMode: false,
				mimeType: "video/mpeg"
			};
			$cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
				console.log("SUCCESS: " + JSON.stringify(result.response));
			}, function (err) {
				console.log("ERROR: " + JSON.stringify(err));
			}, function (progress) {
				// PROGRESS HANDLING GOES HERE
			});
		}
		$scope.console = "";
		
/*
		function captureSuccess(mediaFiles) {
			var i, len;
			for (i = 0, len = mediaFiles.length; i < len; i += 1) {
				uploadFile(mediaFiles[i]);
			}
		}

		function uploadFile(mediaFile) {
			var ft = new FileTransfer(),
				path = mediaFile.fullPath,
				name = mediaFile.name;
			var options = new FileUploadOptions();
			options.mimeType = "video/mpeg";
			options.fileName = name;
			options.chunkedMode = true;

			ft.upload(path,
				"http://192.154.23.51/upload.php",
				function (result) {
					console.log('Upload success: ' + result.responseCode);
					console.log(result.bytesSent + ' bytes sent');
				},
				function (error) {
					console.log('Error uploading file ' + path + ': ' + error.code);
				},
				options);
		}*/

}]);

myapp.factory('Camera', ['$q', function ($q) {
	return {
		takePicture: function (options) {
			var q = $q.defer();
			navigator.camera.getPicture(function (result) {
				// Do any magic you need
				q.resolve(result);
			}, function (err) {
				q.reject(err);
			}, {
				quality: 50,
				destinationType: Camera.DestinationType.FILE_URI
			});
			return q.promise;
		},


		takeVideo: function (options) {
			var q = $q.defer();
			navigator.device.capture.captureVideo(function (result) {
				q.resolve(result);
			}, function (err) {
				q.reject(err);
			}, {
				quality:50 ,
				limit: 1
			});

			return q.promise;
		}
	}
}]);


myapp.factory('dataService', function($http, $q){
	return{
		
		postData: function(Formdata){
		
			var _method = 'POST';
			var _url = 'server/makejson.php';
			var fData = Formdata;
	
			var deferred = $q.defer();
			
			$http({
			
				method:_method,
				url: _url,
				data: fData,
				contentType: 'application/json'
				//headers: {'Content-Type':'application/x-www-form-urlencoded'},
				
			}).
			success (function(response){
			//console.log(response);
				//console.log("success "+response.data);
				deferred.resolve(response);
			}).
			error(function(response){
			console.log(response);
				//console.log(response);
			
			});
			
			return deferred.promise;
		},
		
		getJsonData: function () {
			var deferred = $q.defer();
			$http({
					method: 'GET',
					url: 'http://bluehost.fairfaxmedia.com.au/cliquephoto/votes/labdata/vigil_data.json?nocache=' + (new Date()).getTime(),
				})
				.success(function (data) {

					/*data.sort(function(a,b){
					  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
					 });*/

					deferred.resolve(data);
				})
				.error(function (data) {
					alert("error occured");
				})
			return deferred.promise;
		}
	}
});
