import { NextRequest, NextResponse } from 'next/server';
import { getAllGoals, getStudentGoals, createGoal } from '@/services/smartGoals';
import type { SmartGoalFormData } from '@/types/smart-goals';

/**
 * Manipulador para requisições GET para /api/goals
 * Retorna todas as metas ou as metas de um aluno específico (se studentId for fornecido)
 */
export async function GET(request: NextRequest) {
  try {
    // Obter parâmetros de consulta
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');

    // Buscar dados de acordo com os parâmetros
    const goals = studentId ? await getStudentGoals(studentId) : await getAllGoals();

    return NextResponse.json(goals);
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    return NextResponse.json({ error: 'Erro ao buscar metas' }, { status: 500 });
  }
}

/**
 * Manipulador para requisições POST para /api/goals
 * Cria uma nova meta SMART
 */
export async function POST(request: NextRequest) {
  try {
    // Obter dados do corpo da requisição
    const data: SmartGoalFormData = await request.json();

    // Validar dados
    if (!data.title || !data.specificDetails || !data.startDate || !data.targetDate) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // Criar meta
    const newGoal = await createGoal(data);

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    return NextResponse.json({ error: 'Erro ao criar meta' }, { status: 500 });
  }
}
