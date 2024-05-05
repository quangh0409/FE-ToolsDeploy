import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import { TerminalContextProvider } from "react-terminal";
function App() {
  return (
    <BrowserRouter>
        <AppRouter />
    </BrowserRouter>
  );
}

export default App;
