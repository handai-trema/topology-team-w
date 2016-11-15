## �ۑ�2 (�g�|���W�R���g���[���̊g��)

* �X�C�b�`�̐ڑ��֌W�ɉ����āA�z�X�g�̐ڑ��֌W��\������
* �u���E�U�ŕ\������@�\��ǉ�����B�������߂� [vis.js](https://github.com/almende/vis) �ł�

### �O���[�v�����o�[

* �ؓ� ���l

* ��� ��P

* �i�x ��

* �ѐD �G

* ���� ��

## ��


### �t�@�C���o��
�ڑ��󋵂����A���^�C����web�y�[�W�ŕ\�����邽�߁Chtml����javascript��p���ăg�|���W�}��\��������D
html�Ńg�|���W����ǂݍ��ނ��߁Cjson�`���Ńg�|���W�����o�͂��郁�\�b�h���쐬�����ivisJs.rb�j�D
visJs.rb �ł́CJOSN.damp() �̃��\�b�h��p���� json �`���Ńg�|���W�����o�͂��Ă���D
topology.rb ���� VisJs �N���X�� Update ���\�b�h���Ăяo�����Ƃ� json �`���Ńg�|���W��񂪏o�͂����D

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

���̃��\�b�h�ɂ��o�͂��ꂽtopology.json���Cjavascript(Draw_network.js)�ɂ��ǂݍ��݁C�u���E�U��ŕ\��������html(test.html)���쐬�����D
test.html �ł́CDraw_network.js �ŏo�͂��ꂽ�g�|���W�摜���o�͂��Ă���D

### �g�|���W�摜�̏o��
Draw_network.js �ł́CafterInit function �� json �`���̃t�@�C����ǂݍ���ł���D
���̂Ƃ� checkObjDiff function ��p���đO��ǂݍ��� json �`���̃t�@�C���Ƃ̍����������ꍇ�̓t�@�C���ǂݍ��݂��s��Ȃ��D

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
    // object�̒��g��json������
    var object1String = JSON.stringify(object1); 
    var object2String = JSON.stringify(object2);
    // json������Ŕ�r����
    if (object1String === object2String) {
      return false; // ���������false
    } else {
      return true; // �����������true
    }
  }

```

drawgraph function �ɂ��CafterInit function �Ŏ�荞�� json �`���̃t�@�C�������Ƀg�|���W�摜���쐬���Ă���D
DataSet �ɂ��t�@�C�������荞�񂾃f�[�^�� vis �ɓ��͂��āCNetwork �Ńg�|���W�摜��\�����Ă���D

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

## ����m�F
�} 1 �̂悤�ɐڑ������ꍇ�C�} 2 �̂悤�ȃg�|���W�摜���o�͂��ꂽ�D
|<img src="https://github.com/handai-trema/topology-team-w/blob/develop/picture/switch.jpg" width="420px">|  
|:----------------------------------------------------------------------------------------------------:|  
|                                   �} 1 �P�[�u���̗l�q		                                       |  
|<img src="https://github.com/handai-trema/topology-team-w/blob/develop/picture/switch.jpg" width="420px">|  
|:----------------------------------------------------------------------------------------------------:|  
|                                   �} 2 �g�|���W�摜		                                       |  

�܂��C�} 3 �̎ʐ^�̂悤�ɐڑ������ꍇ�C�g�|���W�摜���} 4 �̂悤�ɕύX���ꂽ�D
|<img src="https://github.com/handai-trema/topology-team-w/blob/develop/picture/switch.jpg" width="420px">|  
|:----------------------------------------------------------------------------------------------------:|  
|                                   �} 3 �P�[�u���̗l�q(�ڑ��ύX��)		                       |  
|<img src="https://github.com/handai-trema/topology-team-w/blob/develop/picture/switch.jpg" width="420px">|  
|:----------------------------------------------------------------------------------------------------:|  
|                                   �} 4 �g�|���W�摜(�ڑ��ύX��)                                       |  


## �v���x
�ؓ�: 60%  
���: 10%  
�i�x: 10%  
�ѐD: 10%  
����: 10%
