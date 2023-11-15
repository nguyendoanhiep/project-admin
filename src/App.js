import './App.css';
import {ToastContainer} from "react-toastify";
import HeaderC from "./modules/header/components"
import Footer from "./modules/footer/components"
import "react-bootstrap"
import "bootstrap-4-react"
import Navigation from "./modules/navigation/components";
import RouterMain from "./router/RouterMain";
import {useLocation} from "react-router-dom";
import {useEffect} from "react";


function App() {
    const location = useLocation();
    const isLoggedIn = JSON.parse(localStorage.getItem('Token'));
    useEffect(() => {
    }, [location])
    return (
        <div className="app">
            <HeaderC/>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                {
                    isLoggedIn ?
                        <div style={{width: '19%'}}>
                            <Navigation/>
                        </div> :
                        <></>
                }
                <div style={{width: isLoggedIn ? '78%' : '100%', padding: 30 , backgroundColor:"#f5f7fb" , borderRadius:10}}>
                    <RouterMain/>
                </div>
            </div>
            <Footer/>
            <ToastContainer/>
        </div>
    )
}

export default App;
