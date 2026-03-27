import { useState , useEffect} from "react";

function App() {

  const [tasks,setTasks]= useState([]);

  const fetchTasks = async()=>{
    try{
      const response = await fetch("http://localhost:3000/api/tasks");
      const data = await response.json();
      setTasks(data.tasks);
    }catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    console.log("Fetching Tasks...");
    (async () => {
      await fetchTasks();
    })();
    }, [])


  return (
    <>
{
  tasks.map((task)=>{
    return(
      <p key={task._id}>{task.title}</p>
    )
  })
}
    </>
  )
}

export default App
