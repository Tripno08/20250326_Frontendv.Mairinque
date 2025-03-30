import { NextRequest, NextResponse } from 'next/server';
import { updateGoalProgress } from '@/services/smartGoals';

interface RouteParams {
  params: { id: string };
}

/**
 * Manipulador para requisições POST para /api/goals/[id]/progress
 * Atualiza o progresso de uma meta específica
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const { value, notes } = await request.json();

    // Validar dados
    if (value === undefined || value === null) {
      return NextResponse.json(
        { error: 'Valor de progresso é obrigatório' },
        { status: 400 }
      );
    }

    const updatedGoal = await updateGoalProgress(id, value, notes);

    if (!updatedGoal) {
      return NextResponse.json(
        { error: 'Meta não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar progresso' },
      { status: 500 }
    );
  }
}
