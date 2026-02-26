import app from "./app";
import { AppDataSource } from "./data";

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => console.log(`Rodando porta ${PORT}`));
  })
  .catch((err) => console.error(err));