import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { LoadingProvider } from "./context/LoadingProvider";
import { LanguageProvider } from "./context/LanguageProvider";
import { ContentProvider } from "./context/ContentProvider";
import { SeoProvider } from "./context/SeoProvider";
import HeadManager from "./components/HeadManager";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
const AdminLayout = lazy(() => import("./admin/AdminLayout"));

const App = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <SeoProvider>
          <ContentProvider>
            <HeadManager />
            <Routes>
              <Route
                path="/*"
                element={
                  <LoadingProvider>
                    <Suspense>
                      <MainContainer>
                        <Suspense>
                          <CharacterModel />
                        </Suspense>
                      </MainContainer>
                    </Suspense>
                  </LoadingProvider>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <Suspense fallback={<div className="admin-loading">Loading admin...</div>}>
                    <AdminLayout />
                  </Suspense>
                }
              />
            </Routes>
          </ContentProvider>
        </SeoProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
