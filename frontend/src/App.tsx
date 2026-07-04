import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { AppLayout } from './components/layouts/AppLayout'
import OrdersPage from './pages/OrdersPage'
import SchedulerLogsPage from './pages/SchedulerLogsPage'



function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<OrdersPage/>} />
            <Route path="scheduler-logs" element={<SchedulerLogsPage/>} />

          </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
