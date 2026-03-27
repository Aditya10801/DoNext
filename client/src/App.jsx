import { useState , useEffect} from "react";
import Header from "./components/Header";
import Title from "./components/Title";
import TimeSelection from "./components/TimeSelection";
import Recommendation from "./components/Recommendation";

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
    <div className = "bg-[#F9F9F9] min-h-screen overflow-hidden ">
      <Header/>
      <Title/>
      <TimeSelection/>
      <Recommendation/>
      
{/* {
  tasks.map((task)=>{
    return(
      <p key={task._id}>{task.title}</p>
    )
  })
} */}

    </div>
  )
}

export default App
