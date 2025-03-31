import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  min-height: 600px;
  background-color: ${({ theme }) => theme.palette.background.default};
  border: 1px solid ${({ theme }) => theme.palette.grey[200]};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  overflow: hidden;
  position: relative;

  .react-flow {
    width: 100%;
    height: 100%;
  }

  .react-flow__node {
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    box-shadow: ${({ theme }) => theme.shadows[1]};
    transition: all 0.2s ease-in-out;

    &:hover {
      box-shadow: ${({ theme }) => theme.shadows[2]};
    }

    &.selected {
      box-shadow: ${({ theme }) => theme.shadows[3]};
    }
  }

  .react-flow__edge {
    transition: all 0.2s ease-in-out;

    &:hover {
      stroke-width: 3px;
    }

    &.selected {
      stroke-width: 3px;
    }
  }

  .react-flow__controls {
    background-color: ${({ theme }) => theme.palette.background.paper};
    border: 1px solid ${({ theme }) => theme.palette.grey[200]};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    box-shadow: ${({ theme }) => theme.shadows[1]};
    padding: 4px;

    button {
      background-color: ${({ theme }) => theme.palette.background.paper};
      border: 1px solid ${({ theme }) => theme.palette.grey[200]};
      border-radius: ${({ theme }) => theme.shape.borderRadius}px;
      color: ${({ theme }) => theme.palette.text.primary};
      margin: 2px;
      padding: 4px;
      transition: all 0.2s ease-in-out;

      &:hover {
        background-color: ${({ theme }) => theme.palette.grey[100]};
      }

      &:active {
        background-color: ${({ theme }) => theme.palette.grey[200]};
      }
    }
  }

  .react-flow__minimap {
    background-color: ${({ theme }) => theme.palette.background.paper};
    border: 1px solid ${({ theme }) => theme.palette.grey[200]};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    box-shadow: ${({ theme }) => theme.shadows[1]};
  }

  .react-flow__attribution {
    background-color: ${({ theme }) => theme.palette.background.paper};
    border: 1px solid ${({ theme }) => theme.palette.grey[200]};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    box-shadow: ${({ theme }) => theme.shadows[1]};
    color: ${({ theme }) => theme.palette.text.primary};
    font-size: 12px;
    padding: 4px 8px;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(1)};
  background: ${({ theme }) => theme.palette.background.default};
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

export const NodePanel = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  background: ${({ theme }) => theme.palette.background.paper};
  border-right: 1px solid ${({ theme }) => theme.palette.divider};
  padding: ${({ theme }) => theme.spacing(2)};
  overflow-y: auto;
`;

export const NodeItem = styled.div`
  padding: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  background: ${({ theme }) => theme.palette.background.default};
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  cursor: move;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.palette.action.hover};
  }
`;

export const NodeTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
  color: ${({ theme }) => theme.palette.text.primary};
`;

export const NodeDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const FlowContainer = styled.div`
  position: absolute;
  left: 250px;
  top: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.palette.background.default};
`;

export const Controls = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.spacing(2)};
  bottom: ${({ theme }) => theme.spacing(2)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export const ControlButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.palette.background.paper};
  border: 1px solid ${({ theme }) => theme.palette.divider};
  color: ${({ theme }) => theme.palette.text.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.palette.action.hover};
  }

  &:active {
    background: ${({ theme }) => theme.palette.action.selected};
  }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ErrorMessage = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing(2)};
  right: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(2)};
  background: ${({ theme }) => theme.palette.error.main};
  color: ${({ theme }) => theme.palette.error.contrastText};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  z-index: 1000;
`;
