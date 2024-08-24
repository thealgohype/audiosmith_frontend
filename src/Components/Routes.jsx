import {Route,Routes} from "react-router-dom";
import { Main } from "./Main";
import { Sidebar } from "./Sidebar";
import { RagResponse } from "./RagResponse";

const AllRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/sidebar" element={<Sidebar/>}/>
        <Route path="/agentic-rag" element={<RagResponse/>}/>
    </Routes>
  )
}

export default AllRoutes;