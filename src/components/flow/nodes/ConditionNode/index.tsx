import React from 'react';
import { Handle, Position } from 'reactflow';
import { Container, Header, Title, Content, Field, FieldLabel, FieldValue } from './styles';

interface ConditionNodeProps {
  data: {
    label: string;
    condition: string;
    description?: string;
  };
  isConnectable: boolean;
  selected?: boolean;
}

export const ConditionNode: React.FC<ConditionNodeProps> = ({ data, isConnectable, selected }) => {
  return (
    <Container selected={selected}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Header>
        <Title>{data.label}</Title>
      </Header>
      <Content>
        <Field>
          <FieldLabel>Condição:</FieldLabel>
          <FieldValue>{data.condition}</FieldValue>
        </Field>
        {data.description && (
          <Field>
            <FieldLabel>Descrição:</FieldLabel>
            <FieldValue>{data.description}</FieldValue>
          </Field>
        )}
      </Content>
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ left: '25%' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ left: '75%' }}
        isConnectable={isConnectable}
      />
    </Container>
  );
};
