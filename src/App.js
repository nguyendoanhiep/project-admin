import './App.css';
import {ToastContainer} from "react-toastify";
import HeaderComponent from "./components/header/HeaderComponent"
import FooterComponent from "./components/footer/FooterComponent"
import "react-bootstrap"
import "bootstrap-4-react"
import NavigationComponent from "./components/nav/NavigationComponent";
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
            <HeaderComponent/>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                {
                    isLoggedIn ?
                        <div style={{width: '22%'}}>
                            <NavigationComponent/>
                        </div> :
                        <></>
                }
                <div style={{width: isLoggedIn ? '78%' : '100%', padding: 30 , backgroundColor:"#f5f7fb" , borderRadius:10}}>
                    <RouterMain/>
                </div>
            </div>
            <FooterComponent/>
            <ToastContainer/>
        </div>
    )
}

export default App;
