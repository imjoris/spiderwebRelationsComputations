// public/js/services/commentService.js

angular.module('treeService', [])

  .factory('Tree', function($http) {
    var curTreeId = {};
    return {
      settreeid : function(id) {
        this.curTreeId = id;
      },
      gettreeid : function() {
        return curTreeId;
      },
      // get all the comments
      get : function() {
        return $http.get('/api/trees');
      },

      // save a comment (pass in comment data)
      // return $http.post('/api/trees', treeData.name)
      save : function(treeData) {
        return $http({
          method: 'POST',
          url: '/api/trees',
          headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
          data: $.param(treeData)
        });
      },
      // destroy a comment
      destroy : function(id) {
        return $http.delete('/api/trees/' + id);
      },

      getnodes : function(id) {
        return $http.get('/api/tree/' + id + '/nodes');
      },
      addnode : function(treeid, nodeData) {
        return $http({
          method: 'POST',
          url: '/api/tree/' + treeid + '/nodes',
          headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
          data: $.param(nodeData)
        });
      },
      destroynode : function(id) {
        return $http.delete('/api/nodes/' + id);
      },
      updatenode : function(id, nodeData) {
        return $http({
          method: 'PATCH',
          url: '/api/nodes/' + id,
          headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
          data: $.param(nodeData)
        });
      },
    }

  });
