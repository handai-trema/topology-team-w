## 課題2 (トポロジコントローラの拡張)

* スイッチの接続関係に加えて、ホストの接続関係を表示する
* ブラウザで表示する機能を追加する。おすすめは [vis.js](https://github.com/almende/vis) です

## コンセプト

接続状況をリアルタイムにwebページで表示するため，html中のjavascriptを用いて画像を表示させる．
htmlでネットワークトポロジを読み込むため，json形式でトポロジ情報を出力するメソッドを作成した（visJs.rb）．
JOSN.damp() のメソッドを用いて json 形式でトポロジ情報を出力している．

'''require 'json'

module View
  # Topology controller's GUI (vis).
  class VisJs
    def initialize(output = 'topology.json')
      @output = output
      @nodes = Array.new { [] }
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
end'''

このメソッドにより出力されたtopology.jsonを，javascript(Draw_network.js)により読み込み，ブラウザ上で表示させるhtml(test.html)を作成した．
