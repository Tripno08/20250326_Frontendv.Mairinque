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

export const AssessmentNode: React.FC<CustomNodeProps> = ({ data, isConnectable, selected }) => {
  const assessmentData = data as {
    type: string;
    criteria: string[];
    duration: number;
    responsible: string[];
  };

  return (
    <Container selected={selected}>
      <Header>
        <Title>Avaliação</Title>
      </Header>

      <Content>
        <Field>
          <FieldLabel>Tipo:</FieldLabel>
          <FieldValue>{assessmentData.type}</FieldValue>
        </Field>

        <Field>
          <FieldLabel>Critérios:</FieldLabel>
          <FieldValue>{assessmentData.criteria.join(', ')}</FieldValue>
        </Field>

        <Field>
          <FieldLabel>Duração:</FieldLabel>
          <FieldValue>{assessmentData.duration} minutos</FieldValue>
        </Field>

        <Field>
          <FieldLabel>Responsáveis:</FieldLabel>
          <FieldValue>{assessmentData.responsible.join(', ')}</FieldValue>
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
