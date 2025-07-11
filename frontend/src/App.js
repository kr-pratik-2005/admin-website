import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import DailyReports from './pages/DailyReports';
import ChildReport from './pages/ChildReport'; // <-- Import ChildReport
import ChildDetails from './pages/ChildDetails';
import ChildMedicalInfo from './pages/ChildMedicalInfo';
import ChildDevelopmentInfo from './pages/ChildDevelopmentInfo';
import ChildDailyRoutine from './pages/ChildDailyRoutine';
import ChildAdditionalInfo from './pages/ChildAdditionalInfo';
import Reports from './pages/Reports';
import DailyReportsList from './pages/DailyReportsList';
import Themes from './pages/Themes';
import Fees from './pages/Fees';
import FeesMasterTable from './pages/FeesMasterTable';
import FeesTable from './pages/FeesTable';
import FeesReportTable from './pages/FeesReportTable';
import MonthlyInvoice from './pages/MonthlyInvoice';
import EditInvoice from './pages/EditInvoice';
import ViewReport from './pages/ViewReport';
import FeesReport from "./pages/FeesReport";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/daily-reports" element={<DailyReports />} />
        <Route path="/child-report" element={<ChildReport />} /> 
        <Route path="/child-details" element={<ChildDetails />} />
        <Route path="/medical-info" element={<ChildMedicalInfo />} />
        <Route path="/development-info" element={<ChildDevelopmentInfo />} />
        <Route path="/daily-routine" element={<ChildDailyRoutine />} />
        <Route path="/additional-info" element={<ChildAdditionalInfo />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/daily-reports-lists" element={<DailyReportsList />} />
        <Route path="/themes" element={<Themes />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/fees/master-table" element={<FeesMasterTable />} />
        <Route path="/fees/table" element={<FeesTable />} />
        <Route path="/fees/report-table" element={<FeesReportTable />} />
        <Route path="/fees/monthly-invoice" element={<MonthlyInvoice />} />
        <Route path="/fees/edit-invoice" element={<EditInvoice />} />
         <Route path="/fees-report" element={<FeesReport />} />
        <Route path="/view-report/:studentId" element={<ViewReport />} />
        {/* Add this line */}
      </Routes>
    </Router>
  );
}

export default App;
