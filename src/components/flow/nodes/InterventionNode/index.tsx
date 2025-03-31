import React from 'react';
import { Handle, Position } from 'reactflow';
import { CustomNodeProps } from '../../../../types/flow';
import {
  Container,
  Header,
  Title,
  Content,
  Field,
  FieldLabel,
  FieldValue,
  Handles,
} from './styles';

export const InterventionNode: React.FC<CustomNodeProps> = ({ data, isConnectable, selected }) => {
  const interventionData = data as {
    name: string;
    description: string;
    duration: number;
    frequency: string;
    resources: string[];
    evidence: string[];
  };

  return (
    <Container selected={selected}>
      <Header>
        <Title>Intervenção</Title>
      </Header>

      <Content>
        <Field>
          <FieldLabel>Nome:</FieldLabel>
          <FieldValue>{interventionData.name}</FieldValue>
        </Field>

        <Field>
          <FieldLabel>Descrição:</FieldLabel>
          <FieldValue>{interventionData.description}</FieldValue>
        </Field>

        <Field>
          <FieldLabel>Duração:</FieldLabel>
          <FieldValue>{interventionData.duration} minutos</FieldValue>
        </Field>

        <Field>
          <FieldLabel>Frequência:</FieldLabel>
          <FieldValue>{interventionData.frequency}</FieldValue>
        </Field>

        <Field>
          <FieldLabel>Recursos:</FieldLabel>
          <FieldValue>{interventionData.resources.join(', ')}</FieldValue>
        </Field>

        <Field>
          <FieldLabel>Evidências:</FieldLabel>
          <FieldValue>{interventionData.evidence.join(', ')}</FieldValue>
        </Field>
      </Content>

      <Handles>
        {isConnectable && (
          <>
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
          </>
        )}
      </Handles>
    </Container>
  );
};
