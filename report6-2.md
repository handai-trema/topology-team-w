## �ۑ�2 (�g�|���W�R���g���[���̊g��)

* �X�C�b�`�̐ڑ��֌W�ɉ����āA�z�X�g�̐ڑ��֌W��\������
* �u���E�U�ŕ\������@�\��ǉ�����B�������߂� [vis.js](https://github.com/almende/vis) �ł�

## �R���Z�v�g

�ڑ��󋵂����A���^�C����web�y�[�W�ŕ\�����邽�߁Chtml����javascript��p���ĉ摜��\��������D
html�Ńl�b�g���[�N�g�|���W��ǂݍ��ނ��߁Cjson�`���Ńg�|���W�����o�͂��郁�\�b�h���쐬�����ivisJs.rb�j�D
JOSN.damp() �̃��\�b�h��p���� json �`���Ńg�|���W�����o�͂��Ă���D

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

���̃��\�b�h�ɂ��o�͂��ꂽtopology.json���Cjavascript(Draw_network.js)�ɂ��ǂݍ��݁C�u���E�U��ŕ\��������html(test.html)���쐬�����D
