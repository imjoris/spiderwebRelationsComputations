// public/js/controllers/mainCtrl.js

angular.module('graphCtrl', [])

// inject the Comment service into our controller
.controller('graphController', function($scope, $http, Graph) {
    $scope.isPaused = false;
    $scope.pauseGraph = function() {
        $scope.isPaused = true;
        myGraph.stopForce();
    }
    $scope.playGraph = function() {
        $scope.isPaused = false;
        myGraph.startForce();
        // Graph.startForce();
    }

    // get all the comments first and bind it to the $scope.comments object
    // use the function we created in our service
    // GET ALL COMMENTS ==============
    // Tree.get()
    //   .success(function(data) {
    //     $scope.trees = data;
    //     $scope.loading = false;
    //   });

    // $scope.refreshTree = function(data, localRootNode){
    //   if (data.length == 0){
    //     $scope.isNodelessTree = true;
    //   }else{
    //     $scope.isNodelessTree=false;
    //     var nodeDataArray = [];
    //     var rootNode = null;
    //     var myLocalRootNodeId = null;

    //     for (var i = 0; i < data.length; i++) {
    //       var node = data[i];
    //       if (node.node_id === null){
    //         rootNode = {
    //           "key": node.id,
    //           "name": node.email,
    //           "text": "Email: " + node.email + 
    //             "\nRevenue: " + node.revenue,
    //           "revenue": node.revenue,
    //           // "color": go.Brush.randomColor()
    //           "color":"#b9b8f9"
    //         }
    //         nodeDataArray.push(rootNode);

    //       }else{
    //         myNode = {
    //           "key": node.id,
    //           "name": node.email,
    //           "text": "Email: " + node.email + 
    //             "\nRevenue: " + node.revenue,
    //           "revenue": node.revenue,
    //           "parent": node.node_id,
    //           "color":"#b9b8f9"
    //         }
    //         nodeDataArray.push(myNode);
    //       }
    //     }
    //     // $scope.mystatus = $nodeDataArray;

    //     // alert(JSON.stringify(nodeDataArray));
    //     // $scope.mystatus = '123';

    //     if ( localRootNode !== undefined ){
    //       myLocalRootNodeId = localRootNode.id;
    //     }else{
    //       myLocalRootNodeId = rootNode.key;
    //     }
    //     if (! $scope.hasInitializedDiag){
    //       init(myLocalRootNodeId, nodeDataArray);
    //       reInit(myLocalRootNodeId, nodeDataArray);
    //       $scope.hasInitializedDiag = true;
    //     }else{
    //       reInit(myLocalRootNodeId, nodeDataArray);
    //     }
    //   }
    // };

    // $scope.viewTree = function(id) {
    //   $("#childNodeForm").hide();
    //   // $scope.isNodelessTree = true;
    //   $scope.loadingNodes = true; 
    //   $scope.treeid = id; 
    //   Tree.getnodes(id)
    //     .success(function(data) {
    //       $scope.nodes = data;
    //       // /* id, tree_id, email, node_id, revenue, tree_id, node_id */
    //       // $newnode = array(
    //       //   'email' => $request->input('email'),
    //       //   'node_id' => $request->input('node_id'),
    //       //   'revenue' => $request->input('revenue'),
    //       // );
    //       $scope.refreshTree(data); 
    //       $scope.loadingNodes = false;
    //     })
    //     .error(function(data) {
    //       $scope.errors = data;
    //       console.log(data);
    //       $scope.isNodelessTree=false;
    //     });
    //   // window.location.href = '/tree/' + id; 
    // };

    // $scope.submitRootNode = function() {
    //   $scope.nodes = $scope.treeid;
    //   Tree.addnode($scope.treeid, $scope.nodeData)
    //     .success(function(data) {
    //       $scope.mystatus = data;
    //       $scope.viewTree($scope.treeid);
    //       $scope.isNodelessTree=false;
    //     })
    //     .error(function(data) {
    //       $scope.mystatus = data;
    //       $scope.nodeErrors = data;
    //       console.log(data);
    //       $scope.isNodelessTree=true;
    //     });
    // };

    // $scope.submitChildNode = function() {
    //   $scope.childNodeData.parentid = $("#nodeId").val();
    //   // alert($("#nodeId").val());
    //   // alert($scope.childNodeData.parentid);

    //   Tree.addnode($scope.treeid, $scope.childNodeData)
    //     .success(function(data) {
    //       $scope.nodes.push(data.newnode);
    //       $scope.refreshTree($scope.nodes, data.newnode);
    //     })
    //     .error(function(data) {
    //       $scope.childNodeErrors = data;
    //       console.log(data);
    //     });
    // };

    // $scope.updateNode = function() {
    //   var nodeid = $("#nodeId").val();

    //   Tree.updatenode(nodeid, $scope.nodeData)
    //     .success(function(data) {
    //       $scope.mystatus = data;
    //       Tree.getnodes($scope.treeid)
    //         .success(function(data) {
    //           $scope.nodes = data;
    //           $scope.refreshTree(data);
    //         })
    //     })
    //     .error(function(data) {
    //       $scope.mystatus = data;
    //     });
    // }

    // // function to handle deleting a comment
    // // DELETE A COMMENT ====================================================
    // $scope.deleteNode = function() {
    //   var nodeid = $("#nodeId").val();
    //   if (confirm('Delete node ?')) {
    //     // use the function we created in our service
    //     Tree.destroynode(nodeid)
    //       .success(function(data) {
    //         Tree.getnodes($scope.treeid)
    //           .success(function(data) {
    //             $scope.nodes = data;
    //             $scope.refreshTree(data);
    //           })
    //           .error(function(data) {
    //           });
    //       })
    //   };
    // }


    // // function to handle submitting the form
    // // SAVE A COMMENT ================
    // $scope.submitTree = function() {
    //   $scope.loadingNodes = true;
    //   $scope.loading = true;
    //   $scope.errors = [];

    //   // save the comment. pass in comment data from the form
    //   // use the function we created in our service
    //   // Tree.save($scope.treeData)
    //   Tree.save($scope.treeData)
    //     .success(function(data) {

    //       // $scope.mystatus = data;
    //       // if successful, we'll need to refresh the comment list
    //       Tree.get()
    //         .success(function(getData) {
    //           $scope.trees = getData;
    //           $scope.loading = false;
    //         });

    //     })
    //     .error(function(data) {
    //       // $scope.mystatus = data;
    //       $scope.errors = data;
    //       console.log(data);
    //       $scope.loading = false;
    //     });
    // };

    // // function to handle deleting a comment
    // // DELETE A COMMENT ====================================================
    // $scope.deleteTree = function(id, name) {
    //   $scope.loadingNodes = true;

    //   if (confirm('Delete tree ' + name + '?')) {
    //     $scope.loading = true; 

    //     // use the function we created in our service
    //     Tree.destroy(id)
    //       .success(function(data) {

    //         // if successful, we'll need to refresh the comment list
    //         Tree.get()
    //           .success(function(getData) {
    //             $scope.trees = getData;
    //             $scope.loading = false;
    //           });

    //       });
    //   }
    // }

    // $scope.submitCommissionPercentages = function() {
    //   var nodes = $scope.nodes;
    //   // var nodesComm = new Array();
    //   var nodesComm = new Object();
    //   var commissions = new Array();

    //   commissions[1] = $scope.commissionDataLayer1;
    //   commissions[2] = $scope.commissionDataLayer2; 
    //   commissions[3] = $scope.commissionDataLayer2; 
    //   commissions[4] = $scope.commissionDataLayer2; 

    //   for (var i = 0, len = nodes.length; i < len; i++) {
    //     nodesComm[nodes[i].id] = 0;
    //   }

    //   var lookup = {};
    //   for (var i = 0, len = nodes.length; i < len; i++) {
    //     lookup[nodes[i].id] = nodes[i];
    //   }

    //   for (var nodecount = 0; nodecount < nodes.length; nodecount++){
    //     var mynode = nodes[nodecount];
    //     var myrevenue = mynode.revenue;
    //     var layernode = mynode;

    //     for (var layercount = 1; layercount <= 4; layercount++){
    //       if ( layernode.node_id !== null && layernode.node_id !== undefined ){
    //         var commiss = commissions[layercount];

    //         var myParentNode = lookup[layernode.node_id];
    //         if( commiss != null && commiss !== undefined ){
    //           var commToReceive = myrevenue * commiss;
    //           nodesComm[myParentNode.id] += commToReceive;
    //         }
    //         layernode = myParentNode;

    //       }
    //     }
    //   }

    //   // for (var i = 0, len = nodes.length; i < len; i++) {
    //   //   nodesComm[nodes[i].id] = 0;
    //   // }

    //     var nodeDataArrayWithComm = [];
    //     var rootNode = null;
    //     for (var i = 0; i < nodes.length; i++) {
    //       var node = nodes[i];
    //       if (node.node_id === null){
    //         rootNode = {
    //           "key": node.id,
    //           "name": node.email,
    //           "text": "Email: " + node.email + "\nRevenue: " + node.revenue + "\nComm. Rec." + nodesComm[node.id],
    //           "commission": nodesComm[node.id],
    //           "revenue": node.revenue,
    //           // "color": go.Brush.randomColor()
    //           "color":"#b9b8f9"
    //         }
    //         nodeDataArrayWithComm.push(rootNode);

    //       }else{
    //         myNode = {
    //           "key": node.id,
    //           "name": node.email,
    //           "text": "Email: " + node.email + "\nRevenue: " + node.revenue + "\nComm. Rec." + nodesComm[node.id],
    //           "revenue": node.revenue,
    //           "commission": nodesComm[node.id],
    //           "parent": node.node_id,
    //           "color":"#b9b8f9"
    //         }
    //         nodeDataArrayWithComm.push(myNode);
    //       }
    //     }
    //     // alert(JSON.stringify(nodeDataArrayWithComm));

    //       reInit(rootNode.id, nodeDataArrayWithComm);

    // };
});
