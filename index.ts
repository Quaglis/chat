import { run } from 'src/app'
import chatAppInit from 'src/apps/chat'
import orderAppInit from 'src/apps/order'
import adminSessionAppInit from 'src/apps/admin-session'


chatAppInit()
orderAppInit()
adminSessionAppInit()

run()