import { Routes, Route } from "react-router-dom";
import Results from "./components/Results.jsx";
import TextComponent from "./components/TextComponent.jsx";
import Landing from "./components/Landing.jsx";
import Home from "./components/Home.jsx"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
};
export default App;
