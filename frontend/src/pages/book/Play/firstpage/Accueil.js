
import {  useState } from "react";

import Onboarding from "./Onboarding.js";

function Accueil() {


  const [Isloading, setIsloading] = useState(false);
  const [menuVisibleHome, setmenuVisibleHome] = useState(false);


  return (
    <>
 

      <div className="screen-center"></div>

      <>
        <div>
          <Onboarding
            menuVisibleHome={menuVisibleHome}
            setmenuVisibleHome={setmenuVisibleHome}
            setIsloading={setIsloading}
            Isloading={Isloading}
          />
        </div>
      </>
  
    </>
  );
}

export default Accueil;
