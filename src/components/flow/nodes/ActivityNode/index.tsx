import React from 'react';
import { Handle, Position } from 'reactflow';
import { Container, Header, Title, Content, Field, FieldLabel, FieldValue } from './styles';

interface ActivityNodeProps {
  data: {
    label: string;
    description?: string;
    duration?: string;
    resources?: string[];
    responsible?: string;
  };
  isConnectable: boolean;
  selected?: boolean;
}

export const ActivityNode: React.FC<ActivityNodeProps> = ({ data, isConnectable, selected }) => {
  return (
    <Container selected={selected}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Header>
        <Title>{data.label}</Title>
      </Header>
      <Content>
        {data.description && (
          <Field>
            <FieldLabel>Descrição:</FieldLabel>
            <FieldValue>{data.description}</FieldValue>
          </Field>
        )}
        {data.duration && (
          <Field>
            <FieldLabel>Duração:</FieldLabel>
            <FieldValue>{data.duration}</FieldValue>
          </Field>
        )}
        {data.resources && data.resources.length > 0 && (
          <Field>
            <FieldLabel>Recursos:</FieldLabel>
            <FieldValue>{data.resources.join(', ')}</FieldValue>
          </Field>
        )}
        {data.responsible && (
          <Field>
            <FieldLabel>Responsável:</FieldLabel>
            <FieldValue>{data.responsible}</FieldValue>
          </Field>
        )}
      </Content>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </Container>
  );
};
