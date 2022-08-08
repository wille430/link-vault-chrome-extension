import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import "./Popup.scss";
import { MemoryRouter, Route, Routes } from "react-router";
import { LinksView } from "./views/LinksView";
import { CollectionsView } from "./views/CollectionsView";
import { CreateLinkView } from "./views/CreateLinkView";
import { CreateCollectionsView } from "./views/CreateCollectionView";

const Popup = () => {
  return (
    <main className="bg-dark text-white p-2">
      <Routes>
        <Route path="/" element={<CollectionsView />} />
        <Route path="/new" element={<CreateCollectionsView />} />
        <Route path="/:colId" element={<LinksView />} />
        <Route path="/:colId/new" element={<CreateLinkView />} />
      </Routes>
    </main>
  );
};

const root = createRoot(document.getElementById("root") as Element);
root.render(
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={["/"]}>
      <Popup />
    </MemoryRouter>
  </QueryClientProvider>
);
