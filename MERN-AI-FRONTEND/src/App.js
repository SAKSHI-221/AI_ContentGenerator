import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "./components/Users/Register";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Registration />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
