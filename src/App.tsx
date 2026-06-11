import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Apply } from "@/pages/Apply";
import { Review } from "@/pages/Review";
import { Capabilities } from "@/pages/Capabilities";
import { Tickets } from "@/pages/Tickets";
import { TicketCreate } from "@/pages/TicketCreate";
import { TicketDetail } from "@/pages/TicketDetail";
import { Sandbox } from "@/pages/Sandbox";
import { Acceptance } from "@/pages/Acceptance";
import { Billing } from "@/pages/Billing";
import { FeedbackPage } from "@/pages/Feedback";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/review" element={<Review />} />
        <Route path="/capabilities" element={<Capabilities />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/tickets/create" element={<TicketCreate />} />
        <Route path="/tickets/:id" element={<TicketDetail />} />
        <Route path="/sandbox" element={<Sandbox />} />
        <Route path="/acceptance" element={<Acceptance />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
    </Router>
  );
}