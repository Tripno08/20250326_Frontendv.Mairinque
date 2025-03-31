#!/bin/bash

echo "🔍 Verificando componentes migrados..."

echo -e "\n⚙️ Verificando tipagem..."
npm run type-check

echo -e "\n🧪 Executando testes para os componentes..."
npm test -- \
src/components/team/RoleAssignment.tsx \
src/components/team/TeamCommunication.tsx \
src/components/team/TeamManagement.tsx \
src/components/goals/SmartGoalList.tsx \
src/components/goals/SmartGoalForm.tsx \
src/components/screening/InstrumentScreeningHistoryPieChart.tsx \
src/components/screening/ScreeningCycleManager.tsx \
src/components/screening/AdministratorScreeningHistory.tsx \
src/components/screening/InstrumentScreeningHistoryScatterChart.tsx \
src/components/screening/InstrumentScreeningHistoryChart.tsx \
src/components/screening/ScreeningRuleConditions.tsx \
src/components/screening/ScreeningAdministrationDetails.tsx \
src/components/screening/ScreeningResultsDashboard.tsx \
src/components/screening/ScreeningInstrumentManager.tsx

echo -e "\n✅ Verificação concluída"
