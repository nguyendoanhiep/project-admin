import './App.css';
import {ToastContainer} from "react-toastify";
import HeaderComponent from "./components/header/HeaderComponent"
import FooterComponent from "./components/footer/FooterComponent"
import "react-bootstrap"
import "bootstrap-4-react"
import NavigationComponent from "./components/nav/NavigationComponent";
import RouterMain from "./router/RouterMain";


function App() {
    return (
        <div style={{marginLeft: '10%', marginRight: '10%'}}>
            <HeaderComponent/>
            <div style={{display: 'flex', marginTop: 50 , minHeight:720}}>
                <NavigationComponent/>
                <div style={{marginLeft: 50, width: '100%'}}>
                    <RouterMain/>
                </div>
            </div>
            <FooterComponent/>
            <ToastContainer/>
        </div>
    )
}

export default App;
