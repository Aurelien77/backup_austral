import Logincomposant from "../../../../Users/Login.js";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../helpers/AuthContext.js";
import Onboarding from "./Onboarding.js";
import Loading from "../../../../component/Loader/Loading.js";

function Accueil() {
  const { authState } = useContext(AuthContext);
  const [login, setlogin] = useState(false);
  const [enr, setenr] = useState(false);
  const [LoginVisible, setLoginVisible] = useState(true);
  const [Isloading, setIsloading] = useState(false);
 const [menuVisibleHome, setmenuVisibleHome] = useState(false);




  const handleClick = () => {
    setlogin((prevLogin) => !prevLogin);
    setenr(false);
    setLoginVisible(!LoginVisible);
  };

  return (
    <>
 
  
    
    {!authState.status && menuVisibleHome && (
          <div onClick={handleClick}>
            {LoginVisible ? (
              <span className="boutonlogin">Login</span>
            ) : (
              <span className="boutonlogin2">Login</span>
            )}
          </div>
        )}

        <div className="screen-center"></div>

        <>
        <div><Onboarding 
        menuVisibleHome={menuVisibleHome}
        setmenuVisibleHome={setmenuVisibleHome}
        setIsloading ={setIsloading}
        Isloading={Isloading}
        /></div>
        </>
<>
        {login && (
          <div>
            <Logincomposant setIsloading ={setIsloading}/>
          </div>
        )}
        </>
  </>
  );
}

export default Accueil;
