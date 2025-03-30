import '@testing-library/cypress/add-commands'
import './commands'

// Não escondemos os logs para evitar problemas de tipagem
// const originalLog = Cypress.log
// Cypress.log = function (opts, ...other) {
//   if (opts.displayName === 'xhr' || opts.name === 'request') {
//     return
//   }
//   return originalLog(opts, ...other)
// }
