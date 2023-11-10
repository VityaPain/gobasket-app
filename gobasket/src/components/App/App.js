import React, {useState} from "react";

import Header from "../Header/Header";
import Showcase from "../Showcase/Showcase";
import Profile from "../Profile/Profile";
import Weather from "../Weather/Weather";
import Events from "../EventsAndCourts/Events";
import Footer from "../Footer/Footer";

function App() {
  const [userId, setUserId] = useState(null)

  const getAuthUser = id => {
    setUserId(id)
  }

  const exitUser = () => {
    setUserId(null)
  }

  return (
    <div className="App wrapper">
      <Header />
      <Showcase />
      <Profile />
      <Weather />
      <Events id="test"/>
      <Footer />
    </div>
  );
}

export default App;
