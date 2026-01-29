// // import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// // import './App.css'

// // function App() {
// //   const [count, setCount] = useState(0)

// //   return (
// //     <>
// //       <div>
// //         <a href="https://vite.dev" target="_blank">
// //           <img src={viteLogo} className="logo" alt="Vite logo" />
// //         </a>
// //         <a href="https://react.dev" target="_blank">
// //           <img src={reactLogo} className="logo react" alt="React logo" />
// //         </a>
// //       </div>
// //       <h1>Vite + React</h1>
// //       <div className="card">
// //         <button onClick={() => setCount((count) => count + 1)}>
// //           count is {count}
// //         </button>
// //         <p>
// //           Edit <code>src/App.jsx</code> and save to test HMR
// //         </p>
// //       </div>
// //       <p className="read-the-docs">
// //         Click on the Vite and React logos to learn more
// //       </p>
// //     </>
// //   )
// // }

// // export default App



























// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import LoadingSpinner from './components/common/LoadingSpinner';

// // Pages
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import IssuesPage from './pages/IssuesPage';
// import IssueDetailPage from './pages/IssueDetailPage';
// import CreateIssuePage from './pages/CreateIssuePage';
// import AnnouncementsPage from './pages/AnnouncementsPage';
// import LostFoundPage from './pages/LostFoundPage';

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// // Public Route (redirect if authenticated)
// const PublicRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (isAuthenticated) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// };

// function AppRoutes() {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route
//         path="/login"
//         element={
//           <PublicRoute>
//             <Login />
//           </PublicRoute>
//         }
//       />
//       <Route
//         path="/register"
//         element={
//           <PublicRoute>
//             <Register />
//           </PublicRoute>
//         }
//       />

//       {/* Protected Routes */}
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/issues"
//         element={
//           <ProtectedRoute>
//             <IssuesPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/issues/create"
//         element={
//           <ProtectedRoute>
//             <CreateIssuePage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/issues/:id"
//         element={
//           <ProtectedRoute>
//             <IssueDetailPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/announcements"
//         element={
//           <ProtectedRoute>
//             <AnnouncementsPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/lost-found"
//         element={
//           <ProtectedRoute>
//             <LostFoundPage />
//           </ProtectedRoute>
//         }
//       />

//       {/* Default redirect */}
//       <Route path="/" element={<Navigate to="/dashboard" replace />} />
//       <Route path="*" element={<Navigate to="/dashboard" replace />} />
//     </Routes>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <AppRoutes />
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import IssuesPage from './pages/IssuesPage';
import IssueDetailPage from './pages/IssueDetailPage';
import CreateIssuePage from './pages/CreateIssuePage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import LostFoundPage from './pages/LostFoundPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/issues"
        element={
          <ProtectedRoute>
            <IssuesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/issues/create"
        element={
          <ProtectedRoute>
            <CreateIssuePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/issues/:id"
        element={
          <ProtectedRoute>
            <IssueDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/announcements"
        element={
          <ProtectedRoute>
            <AnnouncementsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lost-found"
        element={
          <ProtectedRoute>
            <LostFoundPage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;