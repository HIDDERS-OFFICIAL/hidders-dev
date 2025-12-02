import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import TitleBar from "./components/titlebar";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TitleBar />
      <ModeToggle />
    </ThemeProvider>
  );
}

export default App;
