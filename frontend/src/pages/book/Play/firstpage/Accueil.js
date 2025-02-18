import Logincomposant from "../../../../Users/Login.js";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../helpers/AuthContext.js";
import Onboarding from "./Onboarding.js";

function Accueil() {
  const { authState, setAuthState } = useContext(AuthContext);
  const [login, setlogin] = useState(false);
  const [enr, setenr] = useState(false);

  const [Isloading, setIsloading] = useState(false);
  const [menuVisibleHome, setmenuVisibleHome] = useState(false);
/* Gestion de l'etat de NAvigation Livre */
  const handleClick = () => {
    setlogin((prevLogin) => !prevLogin);
    setenr(false);
    setAuthState((prevState) => ({
      ...prevState,
      visibility_login: !prevState.visibility_login,
        
    }));
  };

  return (
    <>
      {!authState.status && authState.visibility_nav_button && (
        <div onClick={handleClick}>
          {authState.visibility_nav_button ? (
            <span className="boutonlogin">Login</span>
          ) : (
            <span className="boutonlogin2">Login</span>
          )}
        </div>
      )}

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
      <>
        {login && (
          <div>
            <Logincomposant setIsloading={setIsloading} />
          </div>
        )}
      </>
    </>
  );
}

export default Accueil;
