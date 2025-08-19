import { AuthProvider } from "./context/authContext";
import Route from "./routes/ AppRoute";

const App = () => {
  return (
    <AuthProvider>
      <Route />
    </AuthProvider>
  );
};

export default App;
