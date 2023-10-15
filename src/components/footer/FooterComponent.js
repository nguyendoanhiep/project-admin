import React from "react";
import '../../App.css'
const FooterComponent = () => {
    return (
        <div className="mastfoot pb-5 bg-white section-padding pb-0">
            <div className="inner container">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="footer-widget pr-lg-5 pr-0">
                            {/*<Image src={logo} className="img-fluid footer-logo mb-3" style={{ width: '150px', height: '80px' }}/>*/}
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et obcaecati quisquam
                                id sit omnis
                                explicabo voluptate aut placeat</p>
                        </div>

                    </div>
                    <div className="col-lg-4">
                        <div className="footer-widget px-lg-5 px-0">
                            <h4>Open Hours</h4>
                            <ul className="list-unstyled open-hours">
                                <li className="d-flex justify-content-between">
                                    <span>Monday</span><span>9:00 - 24:00</span></li>
                                <li className="d-flex justify-content-between"><span>Tuesday</span><span>9:00 - 24:00</span>
                                </li>
                                <li className="d-flex justify-content-between"><span>Wednesday</span><span>9:00 - 24:00</span>
                                </li>
                                <li className="d-flex justify-content-between"><span>Thursday</span><span>9:00 - 24:00</span>
                                </li>
                                <li className="d-flex justify-content-between">
                                    <span>Friday</span><span>9:00 - 02:00</span></li>
                                <li className="d-flex justify-content-between"><span>Saturday</span><span>9:00 - 02:00</span>
                                </li>
                                <li className="d-flex justify-content-between">
                                    <span>Sunday</span><span> Closed</span></li>
                            </ul>
                        </div>

                    </div>

                    <div className="col-lg-4">
                        <div className="footer-widget pl-lg-5 pl-0">
                            <h4>Newsletter</h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                        </div>

                    </div>
                    <div className="col-md-12 d-flex align-items-center">
                        <p className="mx-auto text-center mb-0">Copyright 2019. All Right Reserved. Design by <span
                           >GetTemplates</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default FooterComponent;