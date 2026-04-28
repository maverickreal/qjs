import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// CODE SMELL: Empty function
function doNothing() {
  // TODO: Implement something
}

// Middleware
app.use(express.json());

// Simple route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from SonarQube Demo Express TS App!" });
});

// CODE SMELL: Using 'var' instead of 'const/let'
var oldSchoolVar = "This is not recommended";


// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "UP", timestamp: new Date().toISOString() });
});

// Echo endpoint
app.post("/echo", (req: Request, res: Response) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: "No data provided" });
  }
  res.json({ echoed: data, receivedAt: new Date().toISOString() });
});

// RELIABILITY: Potential infinite loop or unreachable code
function checkSomething(val: boolean) {
  if (val) {
    return true;
  } else {
    return false;
  }
  return true; // Unreachable code
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
