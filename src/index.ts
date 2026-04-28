import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// VULNERABILITY: Hardcoded secret
const AWS_SECRET_KEY = "AKIAEXAMPLE1234567890EXAMPLEKEY";

// CODE SMELL: Unused variable
const unusedVar = "I am never used";

// CODE SMELL: Using 'var' instead of 'const/let'
var oldSchoolVar = "This is not recommended";

// Middleware
app.use(express.json());

// Simple route
app.get("/", (req: Request, res: Response) => {
  // BUG: Debugger statement in production
  debugger;
  
  // SECURITY VULNERABILITY: Use of eval()
  const userInput = "console.log('danger')";
  eval(userInput);

  console.log("Root endpoint hit");
  res.json({ message: "Hello from SonarQube Demo Express TS App!" });
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "UP", timestamp: new Date().toISOString() });
});

// DUPLICATE CODE: Repeating the health check exactly to trigger duplication detection
app.get("/status-check", (req: Request, res: Response) => {
  res.json({ status: "UP", timestamp: new Date().toISOString() });
});

// Echo endpoint
app.post("/echo", (req: Request, res: Response) => {
  const { data } = req.body;
  
  // CODE SMELL: Deeply nested if and variable shadowing
  if (data) {
    const data = "shadowed"; // Shadowing the outer 'data'
    if (data !== null) {
      if (typeof data === "string") {
         console.log(data);
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

// RELIABILITY: Potential infinite loop or unreachable code
function checkSomething(val: boolean) {
  if (val) {
    return true;
  } else {
    return false;
  }
  return true; // Unreachable code
}

// CODE SMELL: Overly complex function signature
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
  console.log(`Server running on port ${PORT}`);
});

export default app;
