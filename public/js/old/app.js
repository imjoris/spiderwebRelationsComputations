var treeApp = angular.module('treeApp', ['treeCtrl', 'treeService']); 

treeApp.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
  });
