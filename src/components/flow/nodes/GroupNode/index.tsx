import React from 'react';
import { Handle, Position } from 'reactflow';
import { Container, Header, Title, Content } from './styles';

interface GroupNodeProps {
  data: {
    label: string;
    description?: string;
  };
  isConnectable: boolean;
  selected?: boolean;
}

export const GroupNode: React.FC<GroupNodeProps> = ({ data, isConnectable, selected }) => {
  return (
    <Container selected={selected}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Header>
        <Title>{data.label}</Title>
      </Header>
      <Content>{data.description}</Content>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </Container>
  );
};
