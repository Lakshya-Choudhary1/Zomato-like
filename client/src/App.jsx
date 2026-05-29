import React, { useEffect } from "react";

import { Route, Routes, Navigate, useLocation } from "react-router-dom";

import userStore from "./store/user.store.js";
import partnerStore from "./store/partner.store.js";


// ================= COMPONENTS =================
import Loading from "./pages/components/utils/Loading.jsx";

// ================= HOME =================
import Home from "./pages/Home.jsx";

// ================= USER PAGES =================
import UserDashboard from "./pages/UserDashboard.jsx";
import UserLogin from "./pages/page/user/UserLogin.jsx";
import UserSignup from "./pages/page/user/UserSignup.jsx";
import UserForgotPassword from "./pages/page/user/UserForgotPassword.jsx";
import UserResetPassword from "./pages/page/user/UserResetPassword.jsx";
import UserVerifyEmail from "./pages/page/user/UserVerifyEmail.jsx";

// ================= PARTNER PAGES =================
import PartnerDashboard from "./pages/PartnerDashboard.jsx";
import PartnerLogin from "./pages/page/partner/PartnerLogin.jsx";
import PartnerSignup from "./pages/page/partner/PartnerSignup.jsx";
import PartnerForgotPassword from "./pages/page/partner/PartnerForgotPassword.jsx";
import PartnerResetPassword from "./pages/page/partner/PartnerResetPassword.jsx";
import PartnerVerifyEmail from "./pages/page/partner/PartnerVerifyEmail.jsx";

// ================= USER PROTECTED ROUTE =================
const UserProtectedRoute = ({ children }) => {
  const user = userStore((state) => state.user);

  const isCheckingAuth = userStore((state) => state.isCheckingAuth);

  if (isCheckingAuth) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/user/login" replace />;
  }

  if (!user.verified) {
    return <Navigate to="/user/verify-email" replace />;
  }

  return children;
};

// ================= USER REDIRECT ROUTE =================
const UserRedirectRoute = ({ children }) => {
  const user = userStore((state) => state.user);

  const isCheckingAuth = userStore((state) => state.isCheckingAuth);

  if (isCheckingAuth) {
    return <Loading />;
  }

  if (user?.verified) {
    return <Navigate to="/user/dashboard" replace />;
  }

  if (user && !user.verified) {
    return <Navigate to="/user/verify-email" replace />;
  }

  return children;
};

// ================= PARTNER PROTECTED ROUTE =================
const PartnerProtectedRoute = ({ children }) => {
  const partner = partnerStore((state) => state.partner);

  const isCheckingAuth = partnerStore((state) => state.isCheckingAuth);

  if (isCheckingAuth) {
    return <Loading />;
  }

  if (!partner) {
    return <Navigate to="/partner/login" replace />;
  }

  if (!partner.verified) {
    return <Navigate to="/partner/verify-email" replace />;
  }

  return children;
};

// ================= PARTNER REDIRECT ROUTE =================
const PartnerRedirectRoute = ({ children }) => {
  const partner = partnerStore((state) => state.partner);

  const isCheckingAuth = partnerStore((state) => state.isCheckingAuth);

  if (isCheckingAuth) {
    return <Loading />;
  }

  if (partner?.verified) {
    return <Navigate to="/partner/dashboard" replace />;
  }

  if (partner && !partner.verified) {
    return <Navigate to="/partner/verify-email" replace />;
  }

  return children;
};

// ================= BIDIRECTIONAL ROUTE =================
const BidirectionalRoute = ({children}) => {
  const user = userStore((state) => state.user);
  const partner = partnerStore((state) => state.partner);

  if (user?.verified) {
    return <Navigate to="/user/dashboard" replace />;
  }

  if(user && !user.verified) {
    return <Navigate to="/user/verify-email" replace />;
  }

  if (partner?.verified) {
    return <Navigate to="/partner/dashboard" replace />;
  }

  if(partner && !partner.verified) {
    return <Navigate to="/partner/verify-email" replace />;
  }

  return children;
};

// ================= APP =================
const App = () => {
  const location = useLocation();
  let checkedAuth = false;

  const checkUserAuth = userStore((state) => state.checkAuth);
  const checkPartnerAuth = partnerStore((state) => state.checkAuth);

  useEffect(() => {
    if(!checkedAuth) {
      checkUserAuth();
      checkPartnerAuth()
      checkedAuth = true;
    }
  }, []);

  const user = userStore((state) => state.user);

  const partner = partnerStore((state) => state.partner);

  return (
    <Routes>
      {/* HOME */}
      <Route 
        path="/"
        element={
          <BidirectionalRoute>
            <Home />
          </BidirectionalRoute>
        } 
      />

      {/* ================= USER ROUTES ================= */}

      <Route
        path="/user/login"
        element={
          <UserRedirectRoute>
            <UserLogin />
          </UserRedirectRoute>
        }
      />

      <Route
        path="/user/signup"
        element={
          <UserRedirectRoute>
            <UserSignup />
          </UserRedirectRoute>
        }
      />

      <Route
        path="/user/dashboard"
        element={
          <UserProtectedRoute>
            <UserDashboard />
          </UserProtectedRoute>
        }
      />

      <Route path="/user/forgot-password" element={<UserForgotPassword />} />

      <Route
        path="/user/reset-password/:resetPasswordToken"
        element={<UserResetPassword />}
      />

      <Route
        path="/user/verify-email"
        element={
          user?.verified ? (
            <Navigate to="/user/dashboard" replace />
          ) : (
            <UserVerifyEmail />
          )
        }
      />

      {/* ================= PARTNER ROUTES ================= */}

      <Route
        path="/partner/login"
        element={
          <PartnerRedirectRoute>
            <PartnerLogin />
          </PartnerRedirectRoute>
        }
      />

      <Route
        path="/partner/signup"
        element={
          <PartnerRedirectRoute>
            <PartnerSignup />
          </PartnerRedirectRoute>
        }
      />

      <Route
        path="/partner/dashboard"
        element={
          <PartnerProtectedRoute>
            <PartnerDashboard />
          </PartnerProtectedRoute>
        }
      />

      <Route
        path="/partner/forgot-password"
        element={<PartnerForgotPassword />}
      />

      <Route
        path="/partner/reset-password/:resetPasswordToken"
        element={<PartnerResetPassword />}
      />

      <Route
        path="/partner/verify-email"
        element={
          partner?.verified ? (
            <Navigate to="/partner/dashboard" replace />
          ) : (
            <PartnerVerifyEmail />
          )
        }
      />

        <Route path="/loading" element={<Loading />} />
      {/* ================= 404 ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
