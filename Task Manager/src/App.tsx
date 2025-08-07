import Header from './components/Header'
import TaskTable from './components/TaskTable'


function App() {

  return (
    <>
    <div className='bg-slate-900 h-screen overflow-auto'>
      <Header></Header>
      <TaskTable></TaskTable>
    </div>
    </>
  )
}

export default App
