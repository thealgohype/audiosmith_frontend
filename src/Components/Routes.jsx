import {Route,Routes} from "react-router-dom";
import { Main } from "./Main";
import { Sidebar } from "./Sidebar";

const AllRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/sidebar" element={<Sidebar/>}/>
    </Routes>
  )
}

export default AllRoutes;