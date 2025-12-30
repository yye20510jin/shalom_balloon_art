import {createContext,useState} from "react";

const AdminContext = createContext();

export function AdminContext_f({children}){
    const[authChange,setAuthChange]  = useState(0);
    const value = {authChange,setAuthChange};
    return(
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}
export default AdminContext; 