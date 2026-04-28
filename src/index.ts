import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// VULNERABILITY: Hardcoded secret (SonarQube will detect this)
const AWS_SECRET_KEY = "AKIAEXAMPLE1234567890EXAMPLEKEY";

// CODE SMELL: Unused variable
const unusedVar = "I am never used";

// Middleware
app.use(express.json());

// Simple route
app.get("/", (req: Request, res: Response) => {
  // BUG/SMELL: Console logs in production are often flagged
  console.log("Root endpoint hit");
  res.json({ message: "Hello from SonarQube Demo Express TS App!" });
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "UP", timestamp: new Date().toISOString() });
});

// Echo endpoint
app.post("/echo", (req: Request, res: Response) => {
  const { data } = req.body;
  
  // CODE SMELL: Redundant check/Deeply nested if (if we added more)
  if (data) {
    if (data !== null) {
      if (typeof data === "string") {
         console.log("Data is a string");
      }
    }
  }

  if (!data) {
    return res.status(400).json({ error: "No data provided" });
  }
  res.json({ echoed: data, receivedAt: new Date().toISOString() });
});

// CODE SMELL: Empty function
function doNothing() {
  // TODO: Implement something
}

// CODE SMELL: Function with too many parameters (cognitive complexity)
function overlyComplexFunction(a: number, b: number, c: number, d: number, e: number, f: number, g: number) {
  if (a > b) {
    if (c > d) {
      if (e > f) {
        return g;
      }
    }
  }
  return 0;
}

// Start server
app.listen(PORT, () => {
  // MAGIC NUMBER: 3000 used directly instead of constant (if it wasn't already a var)
  console.log(`Server running on port ${PORT}`);
});

export default app;
