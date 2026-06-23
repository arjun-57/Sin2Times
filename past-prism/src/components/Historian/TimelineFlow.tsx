import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import { Clock, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import '@xyflow/react/dist/style.css';

interface EventNodeData {
  title: string;
  date?: string;
  description?: string;
  people?: string;
  location?: string;
  category: 'major' | 'minor' | 'cause' | 'effect' | 'root' | 'child';
}

const EventNode = ({ data }: { data: EventNodeData }) => {
  const categoryStyles = {
    root: 'bg-gradient-to-br from-indigo-600 to-indigo-400 text-white border-indigo-600',
    major: 'bg-gradient-to-br from-historical-primary to-historical-secondary text-white border-historical-primary',
    minor: 'bg-gradient-to-br from-historical-accent to-accent text-foreground border-historical-accent',
    cause: 'bg-gradient-to-br from-orange-500 to-red-500 text-white border-orange-500',
    effect: 'bg-gradient-to-br from-green-500 to-emerald-500 text-white border-green-500',
    child: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-purple-500',
  };

  return (
    <Card
      className={`w-80 shadow-lg transition-all duration-300 hover:shadow-xl ${
        categoryStyles[data.category] || categoryStyles.child
      } border-2`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-gray-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-gray-400"
      />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold leading-tight">{data.title}</CardTitle>
          <Badge variant="outline" className="ml-2 text-xs bg-white/20">
            {data.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {data.description && <p className="text-sm opacity-90 line-clamp-3">{data.description}</p>}

        <div className="space-y-2">
          {data.date && (
            <div className="flex items-center gap-2 text-xs opacity-80">
              <Clock className="h-3 w-3" />
              <span>{data.date}</span>
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-2 text-xs opacity-80">
              <MapPin className="h-3 w-3" />
              <span>{data.location}</span>
            </div>
          )}
          {data.people && (
            <div className="flex items-center gap-2 text-xs opacity-80">
              <Users className="h-3 w-3" />
              <span>{data.people}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const nodeTypes = {
  event: EventNode,
};

interface TimelineFlowProps {
  searchQuery?: string; // This will be the Gemini-generated mindmap JSON string
}

const TimelineFlowInner = ({ searchQuery }: TimelineFlowProps) => {
  const { setCenter } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!searchQuery) {
      setNodes([]);
      setEdges([]);
      return;
    }
    try {
      const mindmap = JSON.parse(searchQuery);

      const parsedNodes: Node[] = (mindmap.nodes || []).map((node: any) => ({
        id: node.id,
        type: 'event',
        position: node.position || { x: Math.random() * 800, y: Math.random() * 600 },
        data: {
          title: node.title || node.label || 'Untitled',
          category: node.category || 'child',
          description: node.description,
          date: node.date,
          location: node.location,
          people: node.people,
        },
      }));

      const parsedEdges: Edge[] = (mindmap.edges || []).map((edge: any) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'smoothstep',
        animated: true,
        style: { stroke: 'hsl(var(--historical-primary))', strokeWidth: 2 },
      }));

      setNodes(parsedNodes);
      setEdges(parsedEdges);
    } catch (e) {
      setNodes([]);
      setEdges([]);
    }
  }, [searchQuery]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setCenter(node.position.x, node.position.y, { duration: 800, zoom: 1.2 });
    },
    [setCenter]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      fitView
      attributionPosition="bottom-left"
      style={{ backgroundColor: 'transparent' }}
    >
      <Controls
        className="bg-card border border-border rounded-lg shadow-lg"
        showZoom={true}
        showFitView={true}
        showInteractive={true}
      />
      <MiniMap
        className="bg-card border border-border rounded-lg shadow-lg"
        nodeColor={(node) => {
          const data = node.data as EventNodeData;
          switch (data.category) {
            case 'major':
              return 'hsl(var(--historical-primary))';
            case 'cause':
              return 'orange';
            case 'effect':
              return 'green';
            case 'root':
              return 'indigo';
            case 'child':
              return 'purple';
            default:
              return 'hsl(var(--historical-accent))';
          }
        }}
      />
      <Background variant={'lines' as any} gap={20} size={1} color="hsl(var(--border))" />
    </ReactFlow>
  );
};

export const TimelineFlow = ({ searchQuery }: TimelineFlowProps) => {
  return (
    <div className="w-full h-[600px] bg-gradient-to-br from-background to-historical-muted/30 rounded-xl border border-border shadow-lg overflow-hidden">
      <ReactFlowProvider>
        <TimelineFlowInner searchQuery={searchQuery} />
      </ReactFlowProvider>
    </div>
  );
};
