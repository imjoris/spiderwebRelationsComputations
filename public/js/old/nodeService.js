
angular.module('nodeService', [])

  .factory('Node', function($http) {
    return {
      destroy : function(id) {
        return $http.delete('/api/nodes/' + id);
      }
      // getnodes : function(id) {
      //   return $http.get('/api/tree/' + id + '/nodes');
      // },
      // addnode : function(treeid, nodeData) {
      //   return $http({
      //     method: 'POST',
      //     url: '/api/tree/' + treeid + '/nodes',
      //     headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
      //     data: $.param(nodeData)
      //   });
      // }
    }

  });
