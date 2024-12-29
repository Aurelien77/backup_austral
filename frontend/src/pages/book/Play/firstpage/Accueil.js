import Logincomposant from "../../../../Users/Login.js";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../helpers/AuthContext.js";
import Onboarding from "./Onboarding.js";

function Accueil() {
  const { authState } = useContext(AuthContext);
  const [login, setlogin] = useState(false);
  const [enr, setenr] = useState(false);
  const [LoginVisible, setLoginVisible] = useState(true);

 const [menuVisibleHome, setmenuVisibleHome] = useState(false);




  const handleClick = () => {
    setlogin((prevLogin) => !prevLogin);
    setenr(false);
    setLoginVisible(!LoginVisible);
  };

  return (
    <>{!authState.status && menuVisibleHome && (
          <div onClick={handleClick}>
            {LoginVisible ? (
              <span className="boutonlogin"></span>
            ) : (
              <span className="boutonlogin2"></span>
            )}
          </div>
        )}

        <div className="screen-center"></div>

        <>
        <div><Onboarding 
        menuVisibleHome={menuVisibleHome}
        setmenuVisibleHome={setmenuVisibleHome}
        /></div>
        </>
<>
        {login && (
          <div>
            <Logincomposant />
          </div>
        )}
        </>
  </>
  );
}

export default Accueil;
