$(function(){
  var jsonFilePath = 'tmp/topology.json';
  var EDGE_LENGTH = 150;
  
  var afterInit = function(jsonData) {
    console.log('afterInit', jsonData);
  var n_data = new Array();
  var l_data = new Array();
    console.log('n_data', n_data);
    console.log('l_data', l_data);
        var tmp = new Object();
        for(var i in jsonData[0].nodes){
           tmp = { id:+jsonData[0].nodes[i].id, label:jsonData[0].nodes[i].label, image: './switch.png', shape: 'image'};
           n_data.push( tmp );
        }
        for(var i in jsonData[0].hosts){
           tmp = { id:+jsonData[0].hosts[i].id, label:jsonData[0].hosts[i].label, image: './computer_laptop.png', shape: 'image'}
           n_data.push( tmp );
        }
        for(var i in jsonData[0].links){
           tmp = { from:jsonData[0].links[i].from, to:jsonData[0].links[i].to, length: EDGE_LENGTH}
           l_data.push( tmp );
        }
    console.log('n_data', n_data);
    console.log('l_data', l_data);
    drawgraph(n_data, l_data);
  };

  var getJsonData = function(filePath) {
    var defer = $.Deferred();
    $.ajax({
      type: 'GET',
      url: filePath,
      dataType: 'json',
      cache: false
    })
    .done(defer.resolve)
    .fail(defer.reject);
    return defer.promise();
  };

  var init = function() {
    getJsonData(jsonFilePath)
    .done(function(data) {
      console.log('取得成功', data);
      afterInit(json = data);
    })
    .fail(function(jqXHR, statusText, errorThrown) {
      console.log('初期化失敗', jqXHR, statusText, errorThrown);
      // 1秒置いて再取得
      setTimeout(function() {
        init();
      }, 1000);
    });
  };
  init();
});

function drawgraph(node_data, link_data){
var options={};
var nodes = new vis.DataSet(node_data);
var edges = new vis.DataSet(link_data);
var container = document.getElementById('mynetwork');
var data = {'nodes': nodes, 'edges': edges};
var network = new vis.Network(container, data, options);
}
