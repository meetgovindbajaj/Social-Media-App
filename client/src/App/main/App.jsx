import Routers from "../../Routes/Routers";
import Layout from "../layout/Layout";

const App = () => {
  return <Layout children={<Routers />} />;
};

export default App;
