import { NextRequest, NextResponse } from 'next/server';
import { getGoalById, updateGoal, deleteGoal } from '@/services/smartGoals';
import type { SmartGoalFormData } from '@/types/smart-goals';

interface RouteParams {
  params: { id: string };
}

/**
 * Manipulador para requisições GET para /api/goals/[id]
 * Retorna uma meta específica pelo ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const goal = await getGoalById(id);

    if (!goal) {
      return NextResponse.json(
        { error: 'Meta não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Erro ao buscar meta:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar meta' },
      { status: 500 }
    );
  }
}

/**
 * Manipulador para requisições PUT para /api/goals/[id]
 * Atualiza uma meta específica pelo ID
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const data: SmartGoalFormData = await request.json();

    // Validar dados
    if (!data.title || !data.specificDetails || !data.startDate || !data.targetDate) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    const updatedGoal = await updateGoal(id, data);

    if (!updatedGoal) {
      return NextResponse.json(
        { error: 'Meta não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error('Erro ao atualizar meta:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar meta' },
      { status: 500 }
    );
  }
}

/**
 * Manipulador para requisições DELETE para /api/goals/[id]
 * Exclui uma meta específica pelo ID
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const success = await deleteGoal(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Meta não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir meta:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir meta' },
      { status: 500 }
    );
  }
}
