require 'graphviz'

module View
  # Topology controller's GUI (graphviz).
  class Graphviz
    def initialize(output = 'topology.png')
      @output = output
    end

    # rubocop:disable AbcSize
    def update(_event, _changed, topology)
      GraphViz.new(:G, use: 'neato', overlap: false, splines: true) do |gviz|
        nodes = topology.switches.each_with_object({}) do |each, tmp|
          tmp[each] = gviz.add_nodes(each.to_hex, shape: 'box')
          nodes = topology.hosts.each_with_object({}) do |n_each|
#p n_each
            if !(n_each[1] == nil)
              tmp[n_each[2]*10+n_each[3]] = gviz.add_nodes(n_each[1].to_s, shape: 'circle')
            end
          end
        end
#p nodes[1]
        topology.links.each do |each|
          next unless nodes[each.dpid_a] && nodes[each.dpid_b]
          gviz.add_edges nodes[each.dpid_a], nodes[each.dpid_b]
        end
        topology.hosts.each_with_object({}) do |n_each|
          if !(n_each[1] == nil)
            gviz.add_edges nodes[n_each[2]], nodes[n_each[2]*10+n_each[3]]
          end
        end
        gviz.output png: @output
      end
    end
    # rubocop:enable AbcSize

    def to_s
      "Graphviz mode, output = #{@output}"
    end
  end
end
