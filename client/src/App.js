import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import BackgroundVideo from "./layout/BackgroundVideo";
import ProblemsPage from "./pages/ProblemsPage";

import { colors } from "./data/constants";
import { sectionData } from "./data/constants";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: {
            dark: colors.primaryDark,
            light: colors.purple,
            main: colors.textPrimary,
        },
        background: {
            default: colors.backgroundSecondary,
            paper: colors.backgroundPrimary,
        },
    },
});

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <div className="App">
                <BackgroundVideo />
                <Router>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        {sectionData.map((data) => {
                            return (
                                <Route
                                    exact
                                    key={data.id}
                                    path={data.link}
                                    component={() => (
                                        <ProblemsPage
                                            category={data.category}
                                        />
                                    )}
                                />
                            );
                        })}
                    </Switch>
                </Router>
            </div>
        </MuiThemeProvider>
    );
}

export default App;