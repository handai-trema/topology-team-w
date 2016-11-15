## 課題2 (トポロジコントローラの拡張)

* スイッチの接続関係に加えて、ホストの接続関係を表示する
* ブラウザで表示する機能を追加する。おすすめは [vis.js](https://github.com/almende/vis) です

### グループメンバー

* 木藤 崇人

* 銀杏 一輝

* 永富 賢

* 錦織 秀

* 村上 遼

## 解答


### ファイル出力
接続状況をリアルタイムにwebページで表示するため，html中のjavascriptを用いてトポロジ図を表示させる．
htmlでトポロジ情報を読み込むため，json形式でトポロジ情報を出力するメソッドを作成した（visJs.rb）．
visJs.rb では，JOSN.damp() のメソッドを用いて json 形式でトポロジ情報を出力している．
topology.rb から VisJs クラスの Update メソッドを呼び出すことで json 形式でトポロジ情報が出力される．

```
require 'json'

module View
  # Topology controller's GUI (vis).
  class VisJs
    def initialize(output = 'topology.json')
      @output = output
    end

    # rubocop:disable AbcSize
    def update(_event, _changed, topology)
      nodes = topology.switches.each_with_object({}) do |each, tmp|
        tmp[each] = { "id"=> each, "label"=> each.to_hex }
      end
      i = 0
      links = topology.links.each_with_object({}) do |each, tmp|
        next unless nodes[each.dpid_a] && nodes[each.dpid_b]
        tmp[i] = { "from"=> each.dpid_a, "to"=> each.dpid_b }
        i += 1
      end
      i = 0
      hosts = topology.hosts.each_with_object({}) do |each, tmp|
        tmp[i] = { "id"=> nodes.length+i+1, "label"=> each[1].to_s }
        i += 1
      end
      i = 0
      h_links = topology.hosts.each_with_object({}) do |each, tmp|
        tmp[nodes.length+i] = { "from"=> each[2], "to"=> nodes.length+i+1 }
        i += 1
      end
      open(@output, "w") do |io|
        JSON.dump([ "nodes"=> nodes.values, "hosts"=> hosts.values, "links"=> links.values], io)
      end
    end
    # rubocop:enable AbcSize

    def to_s
      "vizJs mode, output = #{@output}"
    end
  end
end
```

このメソッドにより出力されたtopology.jsonを，javascript(Draw_network.js)により読み込み，ブラウザ上で表示させるhtml(test.html)を作成した．
test.html では，Draw_network.js で出力されたトポロジ画像を出力している．

### トポロジ画像の出力
Draw_network.js では，afterInit function で json 形式のファイルを読み込んでいる．
このとき checkObjDiff function を用いて前回読み込んだ json 形式のファイルとの差分が無い場合はファイル読み込みを行わない．

```
  var afterInit = function(jsonData) {
    console.log('afterInit', jsonData);
    if (!checkObjDiff(pre_data, jsonData)){
      return;
    }
    pre_data = jsonData;
    var n_data = new Array();
    var l_data = new Array();
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
           tmp = { id:jsonData[0].links[i].id, from:jsonData[0].links[i].from, to:jsonData[0].links[i].to, length: EDGE_LENGTH}
           l_data.push( tmp );
        }
    drawgraph(n_data, l_data);
  };

 var checkObjDiff = function(object1, object2) {
    // objectの中身をjson化する
    var object1String = JSON.stringify(object1); 
    var object2String = JSON.stringify(object2);
    // json文字列で比較する
    if (object1String === object2String) {
      return false; // 等しければfalse
    } else {
      return true; // 差分があればtrue
    }
  }

```

drawgraph function により，afterInit function で取り込んだ json 形式のファイルを元にトポロジ画像を作成している．
DataSet によりファイルから取り込んだデータを vis に入力して，Network でトポロジ画像を表示している．

```
  var drawgraph = function(node_data, link_data){
 
     console.log('afterInit', pre_data); 

    var options={};
    var nodes = new vis.DataSet(node_data);
    var edges = new vis.DataSet(link_data);
    var container = document.getElementById('mynetwork');
    var data = {'nodes': nodes, 'edges': edges};
    var network = new vis.Network(container, data, options);
  }
```

## 動作確認
図 1 のように接続した場合，図 2 のようなトポロジ画像が出力された．

|<img src="https://github.com/handai-trema/topology-team-w/blob/develop/picture/switch_after.JPG" width="420px">|  
|:-------------------------------------------------------------------------------------------------------------:|  
|                                   図 1 ケーブルの様子		                                                       |  

|<img src="https://github.com/handai-trema/topology-team-w/blob/develop/picture/ss1.png" width="420px">|  
|:----------------------------------------------------------------------------------------------------:|  
|                                   図 2 トポロジ画像		                                               |  


## 貢献度
木藤: 60%  
銀杏: 10%  
永富: 10%  
錦織: 10%  
村上: 10%
