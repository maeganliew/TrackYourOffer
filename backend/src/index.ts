//App entry point, set up express server
import app from './app';
import { connectDB } from './config/db';

const PORT = 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});