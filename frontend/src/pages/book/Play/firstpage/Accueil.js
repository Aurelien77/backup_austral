import Logincomposant from "../../../../Users/Login.js";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../helpers/AuthContext.js";
import Onboarding from "./Onboarding.js";
import SetBackground from "../../../../component/SetBackground.js";

function Accueil() {
  const { authState } = useContext(AuthContext);
  const [login, setlogin] = useState(false);
  const [enr, setenr] = useState(false);
  const [LoginVisible, setLoginVisible] = useState(true);
  const [  maj, setmaj] = useState(false);

  const [mybook, setmybook] = useState();
  const [myid, setmyid] = useState();

  useEffect(() => {
    let myBookData = localStorage.getItem("mybook");
    let myIdData = localStorage.getItem("myid");

    if (myBookData && myIdData) {
      setmybook(myBookData);
      setmyid(myIdData);
    } else {
      setmybook(1);
      setmyid(1);
    }
  }, []);

  const handleClick = () => {
    setlogin((prevLogin) => !prevLogin);
    setenr(false);
    setLoginVisible(!LoginVisible);
  };

  return (
    <>
  

      <div>
        {!authState.status && (
          <div onClick={handleClick}>
            {LoginVisible ? (
              <span className="boutonlogin"></span>
            ) : (
              <span className="boutonlogin2"></span>
            )}
          </div>
        )}

        <div className="screen-center"></div>
        <div><Onboarding /></div>
        

        {login && (
          <div>
            <Logincomposant />
          </div>
        )}
      </div>
    </>
  );
}

export default Accueil;
