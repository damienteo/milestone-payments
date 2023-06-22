import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    button: {
      textTransform: "none",
    },
    h2: { marginTop: "2rem", marginBottom: "1.5rem" },
    h5: { marginBottom: "1rem" },
  },
});

export default responsiveFontSizes(theme);

declare module "@mui/material/styles" {
  interface Theme {
    typography: { fontFamily: "Poppins, Roboto, monospace" };
    palette: {
      primary: {
        main: string;
      };
      secondary: {
        main: string;
      };
    };
  }
}
