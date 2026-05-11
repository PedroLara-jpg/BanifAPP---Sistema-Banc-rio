import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')
const ClientsController = () => import('#controllers/clients_controller')
const AccountsController = () => import('#controllers/accounts_controller')
const PixController = () => import('#controllers/pix_controller')
const StatementController = () => import('#controllers/statement_controller')
const InvestmentsController = () => import('#controllers/investments_controller')

// Health check
router.get('/', () => ({ service: 'BANIF API', version: '1.0.0', status: 'online' }))

// Auth routes (public)
router.post('/auth/login', [AuthController, 'login'])

// Auth routes (protected)
router.post('/auth/logout', [AuthController, 'logout']).use(middleware.auth())
router.get('/auth/me', [AuthController, 'me']).use(middleware.auth())

// Manager-only routes
router
  .group(() => {
    router.post('/clients', [ClientsController, 'store'])
    router.get('/clients', [ClientsController, 'index'])
    router.post('/accounts', [AccountsController, 'store'])
  })
  .use([middleware.auth(), middleware.role({ roles: ['MANAGER'] })])

// Client-only routes
router
  .group(() => {
    router.get('/balance', [AccountsController, 'balance'])
    router.get('/statement', [StatementController, 'index'])
    router.post('/pix', [PixController, 'transfer'])
    router.get('/investments/types', [InvestmentsController, 'types'])
    router.get('/investments', [InvestmentsController, 'index'])
    router.post('/investments', [InvestmentsController, 'store'])
    router.post('/investments/:id/rescue', [InvestmentsController, 'rescue'])
  })
  .use([middleware.auth(), middleware.role({ roles: ['CLIENT'] })])
