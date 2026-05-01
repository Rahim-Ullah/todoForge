
import Navbar from '../components/layouts/Navbar'
import Todos from '../components/ui/Todos'

const Dashboard = () => {
  return (
    <>
      <div><Navbar /></div>
      <div className='flex min-h-svh flex-col gap-6 bg-muted p-6 md:p-10'>
        <Todos />
      </div>
      <div></div>
    </>
  )
}

export default Dashboard